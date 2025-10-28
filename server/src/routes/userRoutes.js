import { Router } from 'express';
import { adminAuth } from '../middleware/adminAuth.js';
import { User } from '../models/User.js';

const router = Router();

// Get all users (admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const users = await User.find()
      .select('-passwordHash')
      .sort({ createdAt: -1 });
    
    res.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByIdAndDelete(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Restrict/Unrestrict user (admin only)
router.patch('/:id/restrict', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { restrict } = req.body;
    
    console.log('Restrict user request:', { id, restrict, body: req.body });
    
    const user = await User.findById(id);
    
    if (!user) {
      console.log('User not found:', id);
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log('Before update:', { status: user.status });
    user.status = restrict ? 'Restricted' : 'Active';
    await user.save();
    console.log('After update:', { status: user.status });
    
    res.json({ 
      message: `User ${restrict ? 'restricted' : 'unrestricted'} successfully`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Error updating user restriction:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
