import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const signToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { 
    expiresIn: '7d' 
  });
};


export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    console.log('Registration attempt:', name, email);
    
    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate name
    if (name.trim().length < 2) {
      return res.status(400).json({ message: 'Name must be at least 2 characters' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with correct field name
    const user = await User.create({ 
      name: name.trim(), 
      email: email.toLowerCase().trim(), 
      passwordHash: hashedPassword
    });

    // Generate token
    const token = signToken(user._id);

    // Response
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ 
        success: false,
        message: 'Email already in use' 
      });
    }
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Registration failed',
      error: error.message 
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    // Case-insensitive email lookup
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Incorrect password' });
    
    // Blocked users cannot log in
    if (user.isBlocked) {
      return res.status(403).json({ message: 'Your account is blocked. Contact support.' });
    }

    // Check if user is restricted
    if (user.status === 'Restricted') {
      return res.status(403).json({ message: 'Your account has been restricted. Please contact support.' });
    }
    
    // Update last active
    user.lastActive = new Date();
    await user.save();
    
    const token = signToken(user._id);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (e) {
    console.error('Login error:', e);
    res.status(500).json({ message: 'Login failed' });
  }
};

export const me = async (req, res) => 
{
  try {
    const user = await User.findById(req.user.id).select('_id name email');
    res.json({ user });
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch user' });
  }
};
