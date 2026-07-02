import Certificate from '../models/Certificate.js';
import User from '../models/User.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import PDFDocument from 'pdfkit';
import path from 'path';
import fs from 'fs';
import { getPagination } from '../utils/helpers.js';

export const verifyCertificate = asyncHandler(async (req, res) => {
  const { certId } = req.params;

  if (!certId) {
    return res.status(400).json({ ok: false, message: 'Certificate ID is required.' });
  }

  const certificate = await Certificate.findOne({ certId: certId.toUpperCase() });

  if (!certificate || certificate.status === 'revoked') {
    return res.status(404).json({ ok: false, message: 'Certificate not found or invalid.' });
  }

  res.status(200).json({
    ok: true,
    data: certificate
  });
});

export const downloadCertificate = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { courseName } = req.query;
  const userId = req.userId;

  if (!courseId) {
    return res.status(400).json({ ok: false, message: 'Course ID is required.' });
  }

  // 1. Get user details
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ ok: false, message: 'User not found.' });
  }

  // 2. Find or create certificate record
  const actualCourseName = courseName || courseId.replace(/-/g, ' ').toUpperCase();
  let certificate = await Certificate.findOne({ userId, courseName: actualCourseName });

  if (!certificate) {
    const uniqueString = Math.random().toString(36).substring(2, 8).toUpperCase();
    const certId = `IFY-${new Date().getFullYear()}-${uniqueString}`;

    certificate = await Certificate.create({
      certId,
      userId,
      studentName: user.name || `${user.firstName} ${user.lastName}` || 'Dedicated Student',
      courseName: actualCourseName,
      issueDate: new Date(),
      status: 'valid'
    });
  }

  // 3. Generate PDF
  const doc = new PDFDocument({
    layout: 'landscape',
    size: 'A4',
    margin: 50
  });

  // Set headers to trigger a file download in the browser
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="IFYWIGATECHZ_Certificate_${courseId}.pdf"`);

  doc.pipe(res);

  // --- Certificate Design ---
  const width = doc.page.width;
  const height = doc.page.height;

  // Background & Borders
  doc.rect(0, 0, width, height).fill('#0f172a'); // Dark slate background
  doc.lineWidth(10).rect(20, 20, width - 40, height - 40).stroke('#eab308'); // Outer gold border
  doc.lineWidth(2).rect(30, 30, width - 60, height - 60).stroke('#eab308'); // Inner gold border

  // Logo Placement
  const logoPath = path.join(process.cwd(), 'public', 'Ifyglobal.png');
  let startY = 120; // Default text start position if no logo is found

  try {
    if (fs.existsSync(logoPath)) {
      // Draw logo center-top
      doc.image(logoPath, (width / 2) - 40, 45, { width: 80 });
      startY = 145; // Push the title text further down to make room for the logo
    }
  } catch (err) {
    console.warn('Could not load logo for PDF:', err);
  }

  // Content
  doc.y = startY;
  doc.fillColor('#eab308').fontSize(45).font('Helvetica-Bold').text('CERTIFICATE OF COMPLETION', { align: 'center' });
  doc.moveDown(1);
  doc.fillColor('#ffffff').fontSize(18).font('Helvetica').text('This is proudly presented to', { align: 'center' });
  doc.moveDown(1);
  doc.fillColor('#eab308').fontSize(40).font('Helvetica-Bold').text(certificate.studentName, { align: 'center', underline: true });
  doc.moveDown(1);
  doc.fillColor('#ffffff').fontSize(18).font('Helvetica').text('for successfully completing the course requirements for', { align: 'center' });
  doc.moveDown(1);
  doc.fillColor('#3b82f6').fontSize(30).font('Helvetica-Bold').text(certificate.courseName, { align: 'center' });

  // Footer Details & Signatures
  const bottomY = height - 120;
  doc.fillColor('#94a3b8').fontSize(14).font('Helvetica');
  doc.text(`Certificate ID: ${certificate.certId}`, 60, bottomY);
  doc.text(`Issue Date: ${new Date(certificate.issueDate).toLocaleDateString()}`, 60, bottomY + 20);
  
  doc.text('Ifeanyichukwu Oko Isu', width - 300, bottomY, { align: 'center' });
  doc.text('_______________________', width - 300, bottomY + 5, { align: 'center' });
  doc.text('Lead Instructor', width - 300, bottomY + 25, { align: 'center' });

  // Finalize PDF
  doc.end();
});

export const getAllCertificates = asyncHandler(async (req, res) => {
  const { skip, limit, page } = getPagination(req.query);
  
  const total = await Certificate.countDocuments();
  const certificates = await Certificate.find()
    .populate('userId', 'name email avatar')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  res.status(200).json({
    ok: true,
    data: certificates,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});