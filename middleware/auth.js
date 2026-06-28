const jwt = require('jsonwebtoken');
const BlacklistedToken = require('../models/blacklistedTokens');

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const blacklisted = await BlacklistedToken.findOne({ token });
    if (blacklisted) return res.status(401).send({ message: 'Token has been invalidated. Please log in again.' });

    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).send({ message: 'Invalid or expired token.' });
  }
};

const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const blacklisted = await BlacklistedToken.findOne({ token });
      if (!blacklisted) {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
      }
    } catch {
      // invalid token — treat as guest
    }
  }
  next();
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).send({ message: 'Access denied. Admins only.' });
  }
  next();
};

module.exports = { auth, adminOnly, optionalAuth };
