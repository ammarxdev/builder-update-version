// Admin auth middleware
// - Extracts JWT from Authorization header
// - Verifies token with JWT_SECRET
// - Ensures token is for an admin (payload.type === 'admin')
// - Attaches req.admin and calls next(); otherwise responds with 401/403
import jwt from 'jsonwebtoken';

export const adminAuth = (req, res, next) => {
  // Expect header: Authorization: Bearer <token>
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  
  if (!token) {
    return res.status(401).json({ message: 'No admin token provided' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verify it's an admin token
    if (payload.type !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
    
    // Attach admin info to request for downstream handlers
    req.admin = { id: payload.id, role: payload.role };
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid or expired admin token' });
  }
};
