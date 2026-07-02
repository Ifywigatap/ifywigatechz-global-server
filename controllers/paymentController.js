import User from '../models/User.js';
import Payment from '../models/Payment.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import UserProperty from '../models/UserProperty.js';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import Paystack from 'paystack';

const paystack = Paystack(process.env.PAYSTACK_SECRET_KEY);

/**
 * Grants a user access to a specific course.
 * This function is designed to be idempotent.
 * @param {string} email - The user's email.
 * @param {string} courseKey - The key for the course to unlock (e.g., 'ai', 'web3').
 */
const grantCourseAccess = async (email, courseKey) => {
  if (!courseKey) {
    console.error(`[grantCourseAccess] Invalid course key provided for email: ${email}`);
    return null;
  }

  const user = await User.findOneAndUpdate(
    { email },
    { [`${courseKey}CoursePaid`]: true },
    { new: true }
  );

  if (user) {
    console.log(`[grantCourseAccess] Unlocked course '${courseKey}' for ${email}`);
  } else {
    console.warn(`[grantCourseAccess] User not found with email: ${email} during access grant.`);
  }
  return user;
};

/**
 * Handles fulfilling the value of a successful payment.
 * Ensures idempotency and processes dynamic courses, academy courses, and plans.
 * @param {string} reference 
 * @param {object} customer 
 * @param {number} amount 
 * @param {object} metadata 
 */
const fulfillPayment = async (reference, customer, amount, metadata) => {
  // Idempotency Check: See if we've already recorded this payment
  const existingPayment = await Payment.findOne({ reference });
  if (existingPayment) {
    return { alreadyVerified: true, payment: existingPayment };
  }

  const courseKey = metadata?.course;
  const courseId = metadata?.courseId;
  const userId = metadata?.userId;
  const propertyId = metadata?.propertyId;

  // 1. Fulfill Hardcoded Academy Courses (e.g., ai, web3, dataAnalytics)
  if (courseKey) {
    await grantCourseAccess(customer.email, courseKey);
  }

  // 2. Fulfill Dynamic Database Courses
  if (courseId && userId) {
    // Upsert ensures we don't accidentally create duplicate enrollments during webhooks
    await Enrollment.updateOne(
      { course: courseId, user: userId },
      { $setOnInsert: { course: courseId, user: userId } },
      { upsert: true }
    );
    console.log(`[fulfillPayment] Enrolled user ${userId} in dynamic course ${courseId}`);
  }

  // 3. Fulfill Featured Property Upgrades
  if (propertyId && metadata?.type === 'feature_property') {
    await UserProperty.findByIdAndUpdate(propertyId, {
      isFeatured: true,
      featuredExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Features for 30 days
    });
    console.log(`[fulfillPayment] Property ${propertyId} is now featured.`);
  }

  // Record the payment
  const payment = await Payment.create({
    email: customer.email,
    amount: amount / 100, // convert back to Naira
    reference,
    course: courseKey || courseId || propertyId || metadata?.planId || 'unknown',
    status: 'success',
  });

  return { alreadyVerified: false, payment };
};

export const initializePayment = async (req, res) => {
  try {
    const { email, amount, course, metadata = {} } = req.body;
    if (!email || !amount) {
      return res.status(400).json({ ok: false, error: 'Email and amount are required.' });
    }

    const reference = `ifyg_${course || metadata?.courseId || metadata?.planId || 'payment'}_${uuidv4().split('-')[0]}`;

    const response = await paystack.transaction.initialize({
      amount: amount * 100, // kobo
      email,
      reference,
      metadata: {
        course,
        userId: req.userId || null, // Pass userId if available from authMiddleware
        ...metadata
      }
    });

    res.status(200).json({ ok: true, data: response.data });
  } catch (error) {
    console.error('[initializePayment] Error:', error);
    res.status(500).json({ ok: false, error: 'Failed to initialize payment.' });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.body;
    if (!reference) {
      return res.status(400).json({ ok: false, error: 'Payment reference is required.' });
    }

    const response = await paystack.transaction.verify(reference);
    const { data } = response;

    if (data && data.status === 'success') {
      const { metadata, customer, amount } = data;

      const result = await fulfillPayment(reference, customer, amount, metadata);

      res.status(200).json({ 
        ok: true, 
        message: result.alreadyVerified ? "Payment already verified." : "Payment verified successfully.", 
        data, 
        unlocked: metadata?.course || metadata?.courseId 
      });
    } else {
      res.status(400).json({ ok: false, error: 'Payment verification failed or payment not successful.' });
    }
  } catch (error) {
    console.error('[verifyPayment] Error:', error);
    res.status(500).json({ ok: false, error: 'An error occurred during payment verification.' });
  }
};

export const webhookHandler = async (req, res) => {
  try {
    // 1. Verify webhook signature for security
    const secret = process.env.PAYSTACK_SECRET_KEY;
    const hash = crypto.createHmac('sha512', secret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (hash !== req.headers['x-paystack-signature']) {
      console.warn('[Webhook] Invalid signature received.');
      return res.status(401).send('Unauthorized');
    }

    // 2. Acknowledge receipt immediately
    res.sendStatus(200);

    // 3. Process the event asynchronously
    const event = req.body;
    if (event.event === 'charge.success') {
      const { reference, metadata, customer, amount } = event.data;

      const result = await fulfillPayment(reference, customer, amount, metadata);
      
      if (result.alreadyVerified) {
        console.log(`[Webhook] Reference ${reference} already processed. Skipping.`);
      } else {
      console.log(`[Webhook] Successfully processed payment for reference: ${reference}`);
      }
    }
  } catch (error) {
    // This error is for server logging, as we've already sent a 200 OK response.
    console.error('[Webhook] Error:', error);
  }
};
