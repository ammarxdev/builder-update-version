import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { adminAuth } from '../middleware/adminAuth.js';
import { auth } from '../middleware/auth.js';
import { Portfolio } from '../models/Portfolio.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/portfolios');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/html' || file.originalname.endsWith('.html')) {
      cb(null, true);
    } else {
      cb(new Error('Only HTML files are allowed'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Upload portfolio (admin only)
router.post('/upload', adminAuth, upload.single('file'), async (req, res) => {
  try {
    const { title, description, category } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const portfolio = new Portfolio({
      title,
      description,
      category: category || 'template',
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      url: `/uploads/portfolios/${req.file.filename}`,
      size: req.file.size
    });

    await portfolio.save();

    res.status(201).json({
      message: 'Portfolio uploaded successfully',
      portfolio
    });
  } catch (error) {
    console.error('Portfolio upload error:', error);
    res.status(500).json({ message: 'Failed to upload portfolio' });
  }
});

// Get all portfolios
router.get('/', async (req, res) => {
  try {
    const portfolios = await Portfolio.find()
      .sort({ createdAt: -1 });
    
    res.json({ data: portfolios });
  } catch (error) {
    console.error('Error fetching portfolios:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single portfolio
router.get('/:id', async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    // Increment views
    portfolio.views += 1;
    await portfolio.save();

    res.json({ data: portfolio });
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Track download
router.post('/:id/download', auth, async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    // Increment downloads
    portfolio.downloads += 1;
    await portfolio.save();

    res.json({ message: 'Download tracked' });
  } catch (error) {
    console.error('Error tracking download:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete portfolio (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    // Delete file from disk
    if (fs.existsSync(portfolio.path)) {
      fs.unlinkSync(portfolio.path);
    }

    await Portfolio.findByIdAndDelete(req.params.id);

    res.json({ message: 'Portfolio deleted successfully' });
  } catch (error) {
    console.error('Error deleting portfolio:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
