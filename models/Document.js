import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
  {
    filename: String,
    path: String,
    originalName: String,
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.model('Document', documentSchema);
