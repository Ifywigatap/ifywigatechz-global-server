import mongoose from 'mongoose';
import AuditLog from '../models/AuditLog.js';
import User from '../models/User.js';
import { asyncHandler } from './errorHandler.js';

export const auditLog = (actionType) =>
  asyncHandler(async (req, res, next) => {
    let username = 'anonymous';
    let userId = new mongoose.Types.ObjectId(
      '000000000000000000000000'
    );

    if (req.userId) {
      userId = req.userId;
      const user = await User.findById(req.userId).select('name email');
      username = user ? user.name || user.email : 'unknown_user';
    } else if (req.body?.email) {
      username = req.body.email;
    }

    try {
      const logEntry = new AuditLog({
        userId,
        username,
        role: req.userRole || 'guest',
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        action: actionType,
        resource: req.originalUrl,
        details: req.method,
      });

      await logEntry.save();
    } catch (error) {
      console.error('Audit log error:', error.message);
    }

    next();
  });