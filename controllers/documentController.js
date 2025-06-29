import Document from '../models/Document.js';
import fs from 'fs';
import path from 'path';

export const uploadDocument = async (req, res) => {
  try {
    const { file } = req;
    if (!file) return res.status(400).json({ message: 'No file uploaded' });

    const doc = new Document({
      filename: file.filename,
      path: file.path,
      originalName: file.originalname,
      uploadedBy: req.user.id, // user injected via protect middleware
    });

    await doc.save();
    res.status(201).json({ message: 'File uploaded successfully', doc });
  } catch (err) {
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
};

export const getMyDocuments = async (req, res) => {
  try {
    const docs = await Document.find({ uploadedBy: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(docs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch documents' });
  }
};


export const deleteDocument = async (req, res) => {
  try {
    const doc = await Document.findOne({
      _id: req.params.id,
      uploadedBy: req.user.id,
    });

    if (!doc) return res.status(404).json({ message: 'Document not found' });

    // Remove file from filesystem
    fs.unlink(path.resolve(doc.path), (err) => {
      if (err) console.error('Error deleting file:', err);
    });

    // Delete from database
    await doc.deleteOne();

    res.status(200).json({ message: 'Document deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete document', error: err.message });
  }
};
