import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true },
    sourceTemplate: { type: mongoose.Schema.Types.ObjectId, ref: 'Template' },
    html: { type: String, required: true },
  },
  { timestamps: true }
);

export const Project = mongoose.model('Project', projectSchema);
