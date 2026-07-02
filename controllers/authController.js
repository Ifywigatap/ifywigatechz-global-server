import User from '../models/User.js';
import { generateToken, generateRefreshToken, validatePasswordPolicy } from '../utils/jwt.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import cloudinary from '../config/cloudinary.js';
import * as Sentry from '@sentry/node';

const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProduction,
    // 'none' is required if frontend and backend are on different domains in production
    sameSite: isProduction ? 'none' : 'strict',
    // Optional: set the domain if frontend/backend share a parent domain
    ...(isProduction && process.env.COOKIE_DOMAIN && { domain: process.env.COOKIE_DOMAIN })
  };
};

const setAuthCookies = (res, accessToken, refreshToken) => {
  const options = getCookieOptions();

  if (accessToken) {
    res.cookie('accessToken', accessToken, { ...options, maxAge: 15 * 60 * 1000 }); // 15 mins
  }
  if (refreshToken) {
    res.cookie('refreshToken', refreshToken, { ...options, maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7 days
  }
};

const getNameParts = (fullName = '') => {
  const parts = fullName.trim().split(' ').filter(Boolean);
  return {
    firstName: parts[0] || '',
    lastName: parts.slice(1).join(' ') || ''
  };
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, firstName, lastName } = req.body;
  const fullName = name || [firstName, lastName].filter(Boolean).join(' ').trim();

  // Password policy
  const policyError = validatePasswordPolicy(password);
  if (policyError) {
    return res.status(400).json({
      ok: false,
      message: policyError
    });
  }

  // Check if user already exists
  let user = await User.findOne({ email });
  if (user) {
    return res.status(409).json({
      ok: false,
      message: 'User already exists with that email'
    });
  }

  // Create new user
  user = new User({
    name: fullName,
    email,
    password,
    role: 'user'
  });

  await user.save();

  const { token: accessToken } = generateToken(user._id, user.role);
  const { token: refreshTokenStr, expiry } = await generateRefreshToken(user._id);
  
  user.refreshToken = refreshTokenStr;
  user.refreshTokenExpiry = expiry;
  await user.save();

  const userData = user.toJSON();
  const nameParts = getNameParts(userData.name);

  setAuthCookies(res, accessToken, refreshTokenStr);

  res.status(201).json({
    ok: true,
    message: 'User registered successfully',
    data: {
      user: {
        ...userData,
        ...nameParts
      },
      accessToken,
      refreshToken: refreshTokenStr
    }
  });

});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      ok: false,
      message: 'Email and password are required'
    });
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !user.isActive || user.lockUntil > new Date()) {
    return res.status(401).json({
      ok: false,
      message: 'Invalid email or password'
    });
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    user.failedLoginAttempts += 1;
    if (user.failedLoginAttempts >= 5) {
      user.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 mins lock
    }
    await user.save();
    return res.status(401).json({
      ok: false,
      message: 'Invalid email or password'
    });
  }

  // Reset failed attempts
  user.failedLoginAttempts = 0;
  user.lockUntil = null;

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  const accessToken = generateToken(user._id, user.role);
  const { token: refreshTokenStr, expiry } = await generateRefreshToken(user._id);
  
  user.refreshToken = refreshTokenStr;
  user.refreshTokenExpiry = expiry;
  await user.save();

  const userData = user.toJSON();
  const nameParts = getNameParts(userData.name);

  setAuthCookies(res, accessToken, refreshTokenStr);

  res.status(200).json({
    ok: true,
    message: 'Login successful',
    data: {
      user: {
        ...userData,
        ...nameParts
      },
      accessToken,
      refreshToken: refreshTokenStr
    }
  });
});


export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId);

  if (!user) {
    return res.status(404).json({
      ok: false,
      message: 'User not found'
    });
  }

  const userData = user.toJSON();
  const nameParts = getNameParts(userData.name);

  res.status(200).json({
    ok: true,
    data: {
      ...userData,
      ...nameParts
    }
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, firstName, lastName, phone, bio, company, website, location, socialLinks, preferences, billingAddress } = req.body;
  const updatedName = name || [firstName, lastName].filter(Boolean).join(' ').trim();

  const user = await User.findByIdAndUpdate(
    req.userId,
    {
      ...(updatedName && { name: updatedName }),
      ...(phone && { phone }),
      ...(bio && { bio }),
      ...(company && { company }),
      ...(website && { website }),
      ...(location && { location }),
      ...(socialLinks && { socialLinks }),
      ...(preferences && { preferences }),
      ...(billingAddress && { billingAddress })
    },
    { new: true, runValidators: true }
  );

  const userData = user.toJSON();
  const nameParts = getNameParts(userData.name);

  res.status(200).json({
    ok: true,
    message: 'Profile updated successfully',
    data: {
      ...userData,
      ...nameParts
    }
  });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.userId).select('+password');

  const isPasswordValid = await user.comparePassword(currentPassword);
  if (!isPasswordValid) {
    return res.status(401).json({
      ok: false,
      message: 'Current password is incorrect'
    });
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    ok: true,
    message: 'Password changed successfully'
  });
});

export const logout = asyncHandler(async (req, res) => {
  // Clear refresh token (blacklist simple)
  await User.findByIdAndUpdate(req.userId, {
    refreshToken: null,
    refreshTokenExpiry: null
  });
  
  const options = getCookieOptions();
  res.clearCookie('accessToken', options);
  res.clearCookie('refreshToken', options);

  res.status(200).json({
    ok: true,
    message: 'Logged out successfully'
  });
});

export const refreshToken = asyncHandler(async (req, res) => {
  // Backward compatibility: Check cookies first, fallback to body
  const clientRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
  
  if (!clientRefreshToken) {
    return res.status(400).json({
      ok: false,
      message: 'Refresh token required'
    });
  }

  const user = await User.findOne({ refreshToken: clientRefreshToken }).select('+refreshToken +refreshTokenExpiry');
  
  if (!user || user.refreshTokenExpiry < new Date()) {
    return res.status(403).json({
      ok: false,
      message: 'Invalid refresh token'
    });
  }

  const accessToken = generateToken(user._id, user.role);
  
  setAuthCookies(res, accessToken, null);

  res.status(200).json({
    ok: true,
    data: { accessToken }
  });
});

export const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      ok: false,
      message: 'Please provide an image file'
    });
  }

  // Fetch the user to get their current avatar
  const currentUser = await User.findById(req.userId);
  
  // If the user already has a Cloudinary avatar, delete it first to save space
  if (currentUser && currentUser.avatar && currentUser.avatar.public_id) {
    try {
      await cloudinary.uploader.destroy(currentUser.avatar.public_id);
    } catch (error) {
      // Manually capture the error in Sentry without crashing or throwing
      Sentry.captureException(error, { 
        extra: { userId: req.userId, publicId: currentUser.avatar.public_id } 
      });
      console.error('Failed to delete old avatar from Cloudinary:', error);
    }
  }

  // Convert the file buffer to a base64 string for Cloudinary
  const b64 = Buffer.from(req.file.buffer).toString('base64');
  const dataURI = `data:${req.file.mimetype};base64,${b64}`;

  // Upload to Cloudinary with automatic optimization and face-aware cropping
  const result = await cloudinary.uploader.upload(dataURI, {
    folder: 'ifywigatechz/avatars',
    transformation: [
      { width: 250, height: 250, crop: 'fill', gravity: 'face' }, // Automatically center on the face
      { quality: 'auto', fetch_format: 'auto' } // Automaticaly compress and serve best format (like WebP)
    ]
  });

  // Update the user's avatar URL in the database
  const user = await User.findByIdAndUpdate(
    req.userId,
    { 
      avatar: {
        url: result.secure_url,
        public_id: result.public_id
      }
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    ok: true,
    message: 'Avatar updated successfully',
    data: { avatar: user.avatar }
  });
});

export const googleLogin = asyncHandler(async (req, res) => {
  const { email, name, avatar, uid } = req.body;

  if (!email || !uid) {
    throw new AppError('Google Authentication data is missing.', 400);
  }

  // Find user by googleId first, then by email
  let user = await User.findOne({ googleId: uid });

  if (!user) {
    user = await User.findOne({ email });
    
    // If user exists by email, link their Google account
    if (user) {
      user.googleId = uid;
      // Only update avatar if it's a Google avatar and user doesn't have a Cloudinary one
      if (avatar && (!user.avatar || !user.avatar.url?.includes('cloudinary'))) {
        // For Google avatars, we just store the URL, no public_id
        // as we don't manage deletion on Cloudinary for these.
        user.avatar = avatar;
      }
    } else {
      // If no user exists, create a new one
      user = new User({
        name: name || 'Google User',
        email,
        password: uid, // Use Firebase UID as a secure placeholder password
        googleId: uid,
        avatar,
        role: 'user',
        isVerified: true // Google emails are verified
      });
    }
  }

  user.lastLogin = new Date();
  await user.save();

  const { token: accessToken } = generateToken(user._id, user.role);
  const { token: refreshTokenStr, expiry } = await generateRefreshToken(user._id);
  
  user.refreshToken = refreshTokenStr;
  user.refreshTokenExpiry = expiry;
  await user.save();

  const userData = user.toJSON();
  const nameParts = getNameParts(userData.name);

  setAuthCookies(res, accessToken, refreshTokenStr);

  res.status(200).json({
    ok: true,
    message: 'Google authentication successful',
    data: {
      user: { ...userData, ...nameParts },
      accessToken,
      refreshToken: refreshTokenStr
    }
  });
});
