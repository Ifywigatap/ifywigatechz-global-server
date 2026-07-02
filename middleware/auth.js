import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  try {
    // Check for token in cookies first, fallback to Authorization header
    const token = req.cookies?.accessToken || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        ok: false,
        message: 'No token provided, authorization required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    return res.status(401).json({
      ok: false,
      message: 'Invalid or expired token'
    });
  }
};

export const adminMiddleware = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({
      ok: false,
      message: 'Access denied. Admin privileges required.'
    });
  }
  next();
};

export const optionalAuth = (req, res, next) => {
  try {
    // Check for token in cookies first, fallback to Authorization header
    const token = req.cookies?.accessToken || req.headers.authorization?.split(' ')[1];
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.id;
      req.userRole = decoded.role;
    }
    next();
  } catch (error) {
    // Continue without auth
    next();
  }
};

export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.userRole) {
      return res.status(401).json({
        ok: false,
        message: 'Authentication required'
      });
    }

    if (!allowedRoles.includes(req.userRole)) {
      return res.status(403).json({
        ok: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};
