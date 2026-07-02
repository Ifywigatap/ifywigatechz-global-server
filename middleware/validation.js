import validator from 'validator';

export const validateEmail = (email) => {
  return validator.isEmail(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 8;
};

export const validateContactForm = (req, res, next) => {
  const { name, email, message, subject } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({
      ok: false,
      message: 'Name is required and must be a string'
    });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({
      ok: false,
      message: 'Valid email is required'
    });
  }

  if (!subject || typeof subject !== 'string' || subject.trim().length === 0) {
    return res.status(400).json({
      ok: false,
      message: 'Subject is required'
    });
  }

  if (!message || typeof message !== 'string' || message.trim().length < 10) {
    return res.status(400).json({
      ok: false,
      message: 'Message is required and must be at least 10 characters'
    });
  }

  next();
};

export const validateUserRegistration = (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;

  if (!name || name.trim().length === 0) {
    return res.status(400).json({
      ok: false,
      message: 'Name is required'
    });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({
      ok: false,
      message: 'Valid email is required'
    });
  }

  if (!validatePassword(password)) {
    return res.status(400).json({
      ok: false,
      message: 'Password must be at least 8 characters'
    });
  }

  if (password !== passwordConfirm) {
    return res.status(400).json({
      ok: false,
      message: 'Passwords do not match'
    });
  }

  next();
};
