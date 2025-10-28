import mongoose from 'mongoose';

const websiteStatsSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now
  },
  pageViews: {
    type: Number,
    default: 0
  },
  uniqueVisitors: {
    type: Number,
    default: 0
  },
  clicks: {
    type: Number,
    default: 0
  },
  visitors: [{
    ip: String,
    userAgent: String,
    timestamp: Date
  }]
});

websiteStatsSchema.index({ date: 1 });

export const WebsiteStats = mongoose.model('WebsiteStats', websiteStatsSchema);

// Track page view
export async function trackPageView(req) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    let stats = await WebsiteStats.findOne({ 
      date: { $gte: today } 
    });

    if (!stats) {
      stats = new WebsiteStats({ date: today });
    }

    stats.pageViews += 1;

    // Check if this is a unique visitor
    const existingVisitor = stats.visitors.find(v => v.ip === ip);
    if (!existingVisitor) {
      stats.uniqueVisitors += 1;
      stats.visitors.push({
        ip,
        userAgent,
        timestamp: new Date()
      });
    }

    await stats.save();
    return stats;
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
}

// Track click
export async function trackClick(req) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let stats = await WebsiteStats.findOne({ 
      date: { $gte: today } 
    });

    if (!stats) {
      stats = new WebsiteStats({ date: today });
    }

    stats.clicks += 1;
    await stats.save();
    return stats;
  } catch (error) {
    console.error('Error tracking click:', error);
  }
}
