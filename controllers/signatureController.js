import Signature from '../models/Signature.js';

export const saveSignature = async (req, res) => {
  try {
    const { fileId, x, y, page } = req.body;

    const signature = new Signature({
      fileId,
      signer: req.user.id,
      x,
      y,
      page,
    });

    await signature.save();
    res.status(201).json({ message: 'Signature position saved', signature });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save signature', error: error.message });
  }
};
