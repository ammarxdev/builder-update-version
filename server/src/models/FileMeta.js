import mongoose from 'mongoose';

const fileMetaSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  mimetype: { type: String, required: true },
  size: { type: Number, required: true },
  gridFsId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
  uploadedBy: { type: String },
}, { timestamps: true });

fileMetaSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export const FileMeta = mongoose.model('FileMeta', fileMetaSchema);
