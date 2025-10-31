// User auth middleware
// - Extracts JWT from Authorization header
// - Verifies token and attaches req.user
// - Responds with 401 when token is missing/invalid
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export const auth = (req, res, next) => {
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id };
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Optional: reject blocked users for protected routes
export const rejectBlocked = async (req, res, next) => {
  try {
    const user = await User.findById(req.user?.id).select('isBlocked');
    if (user?.isBlocked) {
      return res.status(403).json({ message: 'Your account is blocked. Contact support.' });
    }
    return next();
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
};
