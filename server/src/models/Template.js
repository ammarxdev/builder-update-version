import mongoose from 'mongoose';

const templateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String, default: 'General' },
    thumbnailUrl: { type: String },
    colors: { type: [String], default: [] },
    layout: { type: String },
    style: { type: String },
    preview: { type: String },
    html: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    views: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const Template = mongoose.model('Template', templateSchema);
