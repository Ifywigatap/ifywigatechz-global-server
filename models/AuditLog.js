import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: String,
  action: {
    type: String,
    required: true,
    enum: ['login', 'logout', 'role_change', 'password_change', 'profile_update', 'admin_action', 'api_access']
  },
  resource: String,
  oldValue: mongoose.Schema.Types.Mixed,
  newValue: mongoose.Schema.Types.Mixed,
  success: {
    type: Boolean,
    default: true
  },
  details: String
}, {
  timestamps: true
});

// Index for fast queries
auditLogSchema.index({ userId: 1, createdAt: -1 });
auditLogSchema.index({ action: 1, createdAt: -1 });
auditLogSchema.index({ ipAddress: 1, createdAt: -1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;

