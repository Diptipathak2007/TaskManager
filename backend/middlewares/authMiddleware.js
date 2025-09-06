const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes
const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    console.log('=== AUTH DEBUG ===');
    console.log('Authorization header:', token);
    console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);

    if (token && token.startsWith('Bearer ')) {
      // Remove 'Bearer ' from token string
      token = token.split(' ')[1];
      console.log('Extracted token:', token);
      console.log('Token length:', token ? token.length : 'undefined');

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token:', decoded);

      // Attach user to request - no need for .select('-password') since password has select: false by default
      req.user = await User.findById(decoded.id);

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      console.log('User found:', req.user.email);
      next();
    } else {
      console.log('No valid authorization header');
      return res.status(401).json({ message: 'Not authorized, no token' });
    }
  } catch (err) {
    console.error('Protect middleware error:', err.message);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// Middleware for admin-only routes
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Admin access only' });
  }
};

module.exports = { protect, adminOnly };