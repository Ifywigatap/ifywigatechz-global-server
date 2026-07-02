import Contact from '../models/Contact.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { getPagination } from '../utils/helpers.js';

export const createContact = asyncHandler(async (req, res) => {
  const { name, email, phone, subject, message, category } = req.body;

  const contact = new Contact({
    name,
    email,
    phone,
    subject,
    message,
    category: category || 'general',
    userId: req.userId || null
  });

  await contact.save();

  res.status(201).json({
    ok: true,
    message: 'Contact message sent successfully',
    data: contact
  });
});

export const getAllContacts = asyncHandler(async (req, res) => {
  const { skip, limit, page } = getPagination(req.query);
  const { status, category } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (category) filter.category = category;

  const total = await Contact.countDocuments(filter);
  const contacts = await Contact.find(filter)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  res.status(200).json({
    ok: true,
    data: contacts,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

export const getContactById = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    return res.status(404).json({
      ok: false,
      message: 'Contact not found'
    });
  }

  res.status(200).json({
    ok: true,
    data: contact
  });
});

export const updateContactStatus = asyncHandler(async (req, res) => {
  const { status, priority, response } = req.body;

  const contact = await Contact.findByIdAndUpdate(
    req.params.id,
    {
      ...(status && { status }),
      ...(priority && { priority }),
      ...(response && {
        response: {
          message: response.message,
          respondedBy: req.userId,
          respondedAt: new Date()
        }
      })
    },
    { new: true, runValidators: true }
  );

  if (!contact) {
    return res.status(404).json({
      ok: false,
      message: 'Contact not found'
    });
  }

  res.status(200).json({
    ok: true,
    message: 'Contact updated successfully',
    data: contact
  });
});

export const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);

  if (!contact) {
    return res.status(404).json({
      ok: false,
      message: 'Contact not found'
    });
  }

  res.status(200).json({
    ok: true,
    message: 'Contact deleted successfully'
  });
});
