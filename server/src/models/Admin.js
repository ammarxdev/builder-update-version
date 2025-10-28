import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema(
  {
    username: { 
      type: String, 
      required: true, 
      unique: true, 
      index: true 
    },
    passwordHash: { 
      type: String, 
      required: true 
    },
    role: { 
      type: String, 
      default: 'admin',
      enum: ['admin', 'super_admin']
    },
    lastLogin: { 
      type: Date 
    }
  },
  { timestamps: true }
);

export const Admin = mongoose.model('Admin', adminSchema);
