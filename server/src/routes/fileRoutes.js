import { Router } from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import { adminAuth } from '../middleware/adminAuth.js';
import { FileMeta } from '../models/FileMeta.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } }); // 20MB

function getBucket() {
  const db = mongoose.connection.db;
  return new mongoose.mongo.GridFSBucket(db, { bucketName: 'uploads' });
}

// List files
router.get('/', adminAuth, async (req, res) => {
  try {
    const files = await FileMeta.find({}).sort({ createdAt: -1 });
    res.json({ data: files });
  } catch (e) {
    console.error('List files error:', e);
    res.status(500).json({ message: 'Failed to list files' });
  }
});

// Upload file to GridFS and save metadata
router.post('/', adminAuth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file provided' });

    const bucket = getBucket();
    const { originalname, mimetype, buffer, size } = req.file;

    const uploadStream = bucket.openUploadStream(originalname, { contentType: mimetype });
    uploadStream.end(buffer);

    uploadStream.on('error', (err) => {
      console.error('GridFS upload error:', err);
      return res.status(500).json({ message: 'Upload failed' });
    });

    uploadStream.on('finish', async (file) => {
      try {
        const meta = new FileMeta({
          filename: file.filename,
          originalName: originalname,
          mimetype,
          size,
          gridFsId: file._id,
          uploadedBy: req.admin?.username || 'admin',
        });
        await meta.save();
        res.status(201).json({ message: 'Uploaded', data: meta });
      } catch (e) {
        console.error('Meta save error:', e);
        res.status(500).json({ message: 'Failed to save metadata' });
      }
    });
  } catch (e) {
    console.error('Upload route error:', e);
    res.status(500).json({ message: 'Upload failed' });
  }
});

// Delete file (meta + GridFS)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const meta = await FileMeta.findById(req.params.id);
    if (!meta) return res.status(404).json({ message: 'File not found' });

    const bucket = getBucket();
    try {
      await bucket.delete(new mongoose.Types.ObjectId(meta.gridFsId));
    } catch (e) {
      console.error('GridFS delete error:', e);
    }

    await FileMeta.findByIdAndDelete(meta.id);

    res.json({ message: 'Deleted' });
  } catch (e) {
    console.error('Delete file error:', e);
    res.status(500).json({ message: 'Delete failed' });
  }
});

// Optional: download by meta id
router.get('/:id/download', adminAuth, async (req, res) => {
  try {
    const meta = await FileMeta.findById(req.params.id);
    if (!meta) return res.status(404).json({ message: 'File not found' });

    const bucket = getBucket();
    res.set('Content-Type', meta.mimetype);
    res.set('Content-Disposition', `attachment; filename="${meta.originalName}"`);
    const dl = bucket.openDownloadStream(new mongoose.Types.ObjectId(meta.gridFsId));
    dl.on('error', (e) => {
      console.error('Download error:', e);
      res.status(500).end();
    });
    dl.pipe(res);
  } catch (e) {
    console.error('Download route error:', e);
    res.status(500).json({ message: 'Download failed' });
  }
});

export default router;
