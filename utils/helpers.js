export const getPagination = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

export const createResponse = (ok, message, data = null, error = null) => {
  const response = { ok, message };
  if (data) response.data = data;
  if (error) response.error = error;
  return response;
};

export const sanitizeUser = (user) => {
  const userObj = user.toObject ? user.toObject() : user;
  const { password, verificationToken, resetPasswordToken, ...sanitized } = userObj;
  return sanitized;
};

export const formatErrors = (errors) => {
  if (typeof errors === 'string') return errors;
  if (Array.isArray(errors)) return errors.join(', ');
  if (typeof errors === 'object') {
    return Object.values(errors)
      .map(err => err.message || err)
      .join(', ');
  }
  return 'An error occurred';
};
