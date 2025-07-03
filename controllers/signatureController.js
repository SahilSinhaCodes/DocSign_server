import Signature from '../models/Signature.js';
import fs from 'fs';
import path from 'path';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import Document from '../models/Document.js';

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


export const applySignature = async (req, res) => {
  try {
    const { fileId } = req.body;

    // Fetch original document and signatures
    const document = await Document.findById(fileId);
    const signatures = await Signature.find({ fileId });

    const filePath = path.join('uploads', path.basename(document.path));
    const existingPdfBytes = fs.readFileSync(filePath);

    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Draw each signature on the corresponding page
    for (const sig of signatures) {
      const page = pages[(sig.page || 1) - 1];
      const { width, height } = page.getSize();

      const absX = sig.x * width;
      const absY = sig.y * height;

      page.drawText('Signed by ' + sig.signer, {
        x: absX,
        y: absY,
        size: 12,
        font,
        color: rgb(0, 0, 1),
      });
    }

    // Save to /signed folder
    const signedFileName = `signed-${Date.now()}.pdf`;
    const signedPath = path.join('signed', signedFileName);

    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(signedPath, pdfBytes);

    res.json({ message: 'Signature applied successfully', path: signedPath });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to apply signature' });
  }
};
