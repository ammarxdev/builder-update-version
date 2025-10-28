import { User } from '../models/User.js';
import { Download } from '../models/Download.js';

// Get User Statistics
export const getUserStats = async (req, res) => {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    // Total users
    const totalUsers = await User.countDocuments();

    // Active users (last 7 days)
    const activeUsers = await User.countDocuments({
      lastActive: { $gte: weekAgo }
    });

    // Daily active users (today)
    const dailyActive = await User.countDocuments({
      lastActive: { $gte: today }
    });

    // New registrations (today)
    const newToday = await User.countDocuments({
      createdAt: { $gte: today }
    });

    // New registrations (this week)
    const newThisWeek = await User.countDocuments({
      createdAt: { $gte: weekAgo }
    });

    // New registrations (this month)
    const newThisMonth = await User.countDocuments({
      createdAt: { $gte: monthAgo }
    });

    // User growth over last 30 days
    const growthData = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const count = await User.countDocuments({
        createdAt: { $gte: date, $lt: nextDate }
      });

      growthData.push({
        date: date.toISOString().split('T')[0],
        count
      });
    }

    res.json({
      totalUsers,
      activeUsers,
      dailyActive,
      newToday,
      newThisWeek,
      newThisMonth,
      growthData
    });

  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ message: 'Failed to fetch user statistics' });
  }
};

// Get User Activity List
export const getUserActivity = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const skip = (page - 1) * limit;

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    // Build query
    const query = {};
    
    if (status === 'active') {
      query.lastActive = { $gte: weekAgo };
    } else if (status === 'inactive') {
      query.lastActive = { $lt: weekAgo };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Get users with pagination
    const users = await User.find(query)
      .select('name email createdAt lastActive totalDownloads')
      .sort({ lastActive: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    // Format response
    const formattedUsers = users.map(user => {
      const isActive = user.lastActive >= weekAgo;
      return {
        id: user._id,
        name: user.name,
        email: user.email,
        registrationDate: user.createdAt,
        lastActive: user.lastActive,
        status: isActive ? 'active' : 'inactive',
        totalDownloads: user.totalDownloads || 0
      };
    });

    res.json({
      users: formattedUsers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get user activity error:', error);
    res.status(500).json({ message: 'Failed to fetch user activity' });
  }
};

// Get Download Statistics
export const getDownloadStats = async (req, res) => {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    // Total downloads
    const totalDownloads = await Download.countDocuments();

    // Downloads today
    const downloadsToday = await Download.countDocuments({
      downloadTimestamp: { $gte: today }
    });

    // Downloads this week
    const downloadsThisWeek = await Download.countDocuments({
      downloadTimestamp: { $gte: weekAgo }
    });

    // Downloads this month
    const downloadsThisMonth = await Download.countDocuments({
      downloadTimestamp: { $gte: monthAgo }
    });

    // Downloads by type
    const htmlDownloads = await Download.countDocuments({ fileType: 'html' });
    const zipDownloads = await Download.countDocuments({ fileType: 'zip' });

    // Daily downloads for last 30 days
    const dailyDownloads = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const count = await Download.countDocuments({
        downloadTimestamp: { $gte: date, $lt: nextDate }
      });

      dailyDownloads.push({
        date: date.toISOString().split('T')[0],
        count
      });
    }

    // Most popular templates
    const popularTemplates = await Download.aggregate([
      { $match: { templateName: { $exists: true, $ne: null } } },
      { $group: { _id: '$templateName', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      totalDownloads,
      downloadsToday,
      downloadsThisWeek,
      downloadsThisMonth,
      downloadsByType: {
        html: htmlDownloads,
        zip: zipDownloads
      },
      dailyDownloads,
      popularTemplates: popularTemplates.map(t => ({
        name: t._id,
        count: t.count
      }))
    });

  } catch (error) {
    console.error('Get download stats error:', error);
    res.status(500).json({ message: 'Failed to fetch download statistics' });
  }
};

// Get Download History
export const getDownloadHistory = async (req, res) => {
  try {
    const { page = 1, limit = 20, fileType, startDate, endDate } = req.query;
    const skip = (page - 1) * limit;

    // Build query
    const query = {};
    
    if (fileType) {
      query.fileType = fileType;
    }

    if (startDate || endDate) {
      query.downloadTimestamp = {};
      if (startDate) query.downloadTimestamp.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.downloadTimestamp.$lte = end;
      }
    }

    // Get downloads with user info
    const downloads = await Download.find(query)
      .populate('user', 'name email')
      .sort({ downloadTimestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Download.countDocuments(query);

    // Format response
    const formattedDownloads = downloads.map(download => ({
      id: download._id,
      user: {
        id: download.user?._id,
        name: download.user?.name || 'Unknown',
        email: download.user?.email || 'N/A'
      },
      fileName: download.fileName,
      fileType: download.fileType,
      templateName: download.templateName || 'N/A',
      downloadTimestamp: download.downloadTimestamp,
      ipAddress: download.ipAddress
    }));

    res.json({
      downloads: formattedDownloads,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get download history error:', error);
    res.status(500).json({ message: 'Failed to fetch download history' });
  }
};

// Get Dashboard Overview
export const getDashboardOverview = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Get all key metrics
    const [
      totalUsers,
      totalDownloads,
      todayUsers,
      yesterdayUsers,
      todayDownloads,
      yesterdayDownloads,
      recentUsers,
      recentDownloads
    ] = await Promise.all([
      User.countDocuments(),
      Download.countDocuments(),
      User.countDocuments({ createdAt: { $gte: today } }),
      User.countDocuments({ createdAt: { $gte: yesterday, $lt: today } }),
      Download.countDocuments({ downloadTimestamp: { $gte: today } }),
      Download.countDocuments({ downloadTimestamp: { $gte: yesterday, $lt: today } }),
      User.find().sort({ createdAt: -1 }).limit(5).select('name email createdAt'),
      Download.find().populate('user', 'name email').sort({ downloadTimestamp: -1 }).limit(5)
    ]);

    // Calculate growth percentages
    const userGrowth = yesterdayUsers > 0 
      ? ((todayUsers - yesterdayUsers) / yesterdayUsers * 100).toFixed(1)
      : 0;
    
    const downloadGrowth = yesterdayDownloads > 0
      ? ((todayDownloads - yesterdayDownloads) / yesterdayDownloads * 100).toFixed(1)
      : 0;

    res.json({
      overview: {
        totalUsers,
        totalDownloads,
        todayUsers,
        todayDownloads,
        userGrowth: parseFloat(userGrowth),
        downloadGrowth: parseFloat(downloadGrowth)
      },
      recentUsers: recentUsers.map(u => ({
        id: u._id,
        name: u.name,
        email: u.email,
        joinedAt: u.createdAt
      })),
      recentDownloads: recentDownloads.map(d => ({
        id: d._id,
        user: d.user?.name || 'Unknown',
        fileName: d.fileName,
        timestamp: d.downloadTimestamp
      }))
    });

  } catch (error) {
    console.error('Get dashboard overview error:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard overview' });
  }
};
