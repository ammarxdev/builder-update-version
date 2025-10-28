import mongoose from 'mongoose';

const downloadSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    fileName: {
      type: String,
      required: true
    },
    fileType: {
      type: String,
      enum: ['html', 'zip'],
      required: true
    },
    templateId: {
      type: String
    },
    templateName: {
      type: String
    },
    fileSize: {
      type: Number // in bytes
    },
    downloadTimestamp: {
      type: Date,
      default: Date.now,
      index: true
    },
    ipAddress: {
      type: String
    },
    userAgent: {
      type: String
    }
  },
  { timestamps: true }
);

// Index for analytics queries
downloadSchema.index({ downloadTimestamp: -1 });
downloadSchema.index({ user: 1, downloadTimestamp: -1 });

export const Download = mongoose.model('Download', downloadSchema);
