import { decodeJWT } from '../middleware/decodeToken.js';
import { requireAdmin } from '../middleware/authorization.js';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config({ quiet: true });
const router = express.Router();

router.get(
  '/generate-upload-url',
  decodeJWT,
  requireAdmin,
  async (req, res) => {
    if (typeof req.query.fileName !== 'string' || !req.query.fileName.trim()) {
      return res.status(400).json({ message: 'File name is required' });
    }
    const fileName = `${Date.now()}-${req.query.fileName}`;

    try {
      const s3 = new S3Client({
        region: 'us-east-2',
        ...(process.env.AWS_ACCESS_KEY && process.env.AWS_SECRET_KEY
          ? {
              credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY,
                secretAccessKey: process.env.AWS_SECRET_KEY,
              },
            }
          : {}),
      });
      const command = new PutObjectCommand({
        Bucket: 'oylo-images',
        Key: fileName,
      });
      const uploadURL = await getSignedUrl(s3, command, { expiresIn: 3600 });
      res.status(200).json({ uploadURL, fileName });
    } catch {
      res.status(500).json({ message: 'Error generating upload URL' });
    }
  }
);

export default router;
