import { Router } from 'express';
import {
  getUserStats,
  getUserActivity,
  getDownloadStats,
  getDownloadHistory,
  getDashboardOverview
} from '../controllers/analyticsController.js';
import { adminAuth } from '../middleware/adminAuth.js';
import { WebsiteStats } from '../models/WebsiteStats.js';

const router = Router();

// All analytics routes require admin authentication
router.use(adminAuth);

// Dashboard
router.get('/dashboard', getDashboardOverview);

// User Analytics
router.get('/users/stats', getUserStats);
router.get('/users/activity', getUserActivity);

// Download Analytics
router.get('/downloads/stats', getDownloadStats);
router.get('/downloads/history', getDownloadHistory);

// Website Stats
router.get('/website/stats', async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    startDate.setHours(0, 0, 0, 0);

    const stats = await WebsiteStats.find({
      date: { $gte: startDate }
    }).sort({ date: 1 });

    // Get totals
    const totals = stats.reduce((acc, stat) => ({
      pageViews: acc.pageViews + stat.pageViews,
      uniqueVisitors: acc.uniqueVisitors + stat.uniqueVisitors,
      clicks: acc.clicks + stat.clicks
    }), { pageViews: 0, uniqueVisitors: 0, clicks: 0 });

    // Get today's stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStats = await WebsiteStats.findOne({ date: { $gte: today } });

    res.json({
      totals,
      today: todayStats || { pageViews: 0, uniqueVisitors: 0, clicks: 0 },
      history: stats.map(s => ({
        date: s.date,
        pageViews: s.pageViews,
        uniqueVisitors: s.uniqueVisitors,
        clicks: s.clicks
      }))
    });
  } catch (error) {
    console.error('Error fetching website stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
