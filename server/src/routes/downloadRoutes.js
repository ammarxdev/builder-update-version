import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { trackDownload } from '../utils/downloadTracker.js';

const router = Router();

// Track download event (requires user authentication)
router.post('/track-download', auth, async (req, res) => {
  try {
    const { fileType, templateId, templateName, fileName } = req.body;
    const userId = req.user.id;

    // Get additional metadata
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    // Track the download
    await trackDownload({
      userId,
      fileName,
      fileType,
      templateId,
      templateName,
      ipAddress,
      userAgent
    });

    res.json({ success: true, message: 'Download tracked' });
  } catch (error) {
    console.error('Track download error:', error);
    res.status(500).json({ message: 'Failed to track download' });
  }
});

export default router;
