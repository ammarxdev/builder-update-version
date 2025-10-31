import { Router } from 'express';
import { adminLogin, getAdminProfile, createAdmin } from '../controllers/adminAuthController.js';
import { adminAuth } from '../middleware/adminAuth.js';
import { User } from '../models/User.js';

const router = Router();

// Admin Authentication
router.post('/login', adminLogin);
router.get('/profile', adminAuth, getAdminProfile);
router.post('/create', createAdmin); // Remove or protect this in production

// Block/Unblock user (admin only)
// PUT /api/admin/block/:id  { block?: boolean }
// - If body.block is provided, sets isBlocked to that value
// - Otherwise toggles current isBlocked
router.put('/block/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { block } = req.body || {};

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (typeof block === 'boolean') {
      user.isBlocked = block;
    } else {
      user.isBlocked = !user.isBlocked;
    }
    await user.save();

    return res.json({
      message: user.isBlocked ? 'User blocked successfully' : 'User unblocked successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isBlocked: user.isBlocked,
        status: user.status,
      }
    });
  } catch (error) {
    console.error('Error toggling user block:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
