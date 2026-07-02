import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export const generateToken = (userId, role, expiresIn = '15m') => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET,
    { expiresIn }
  );
};

export const generateRefreshToken = async (userId) => {
  const token = crypto.randomBytes(40).toString('hex');
  const expiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  
  return { token, expiry };
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

export const validatePasswordPolicy = (password) => {
  const minLength = 12;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?\":{}|<>]/.test(password);
  
  if (password.length < minLength) return 'Password must be at least 12 characters';
  if (!hasUpper) return 'Password must contain uppercase letter';
  if (!hasLower) return 'Password must contain lowercase letter';
  if (!hasNumber) return 'Password must contain number';
  if (!hasSpecial) return 'Password must contain special character';
  
  return null;
};

