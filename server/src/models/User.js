import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    lastActive: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
    status: { type: String, enum: ['Active', 'Inactive', 'Restricted'], default: 'Active' },
    totalDownloads: { type: Number, default: 0 }
  },
  { timestamps: true }
);

// Index for analytics
userSchema.index({ lastActive: -1 });
userSchema.index({ createdAt: -1 });

export const User = mongoose.model('User', userSchema);
