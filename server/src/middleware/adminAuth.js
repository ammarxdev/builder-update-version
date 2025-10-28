import jwt from 'jsonwebtoken';

export const adminAuth = (req, res, next) => {
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
    
    req.admin = { id: payload.id, role: payload.role };
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid or expired admin token' });
  }
};
