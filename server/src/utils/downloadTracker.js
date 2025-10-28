import { Download } from '../models/Download.js';
import { User } from '../models/User.js';

/**
 * Track a download event
 * @param {Object} params - Download parameters
 * @param {String} params.userId - User ID
 * @param {String} params.fileName - Downloaded file name
 * @param {String} params.fileType - 'html' or 'zip'
 * @param {String} params.templateId - Template identifier
 * @param {String} params.templateName - Template name
 * @param {Number} params.fileSize - File size in bytes
 * @param {String} params.ipAddress - User IP address
 * @param {String} params.userAgent - User agent string
 */
export async function trackDownload(params) {
  try {
    const {
      userId,
      fileName,
      fileType,
      templateId,
      templateName,
      fileSize,
      ipAddress,
      userAgent
    } = params;

    // Create download record
    await Download.create({
      user: userId,
      fileName,
      fileType,
      templateId,
      templateName,
      fileSize,
      ipAddress,
      userAgent,
      downloadTimestamp: new Date()
    });

    // Update user download count and last active
    await User.findByIdAndUpdate(userId, {
      $inc: { totalDownloads: 1 },
      lastActive: new Date()
    });

    return { success: true };
  } catch (error) {
    console.error('Download tracking error:', error);
    return { success: false, error };
  }
}
