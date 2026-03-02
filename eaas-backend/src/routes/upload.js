import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { getUploadPresignedUrl } from '../controllers/uploadController.js';

const router = express.Router();

// POST /api/upload/presigned-url
// Returns a presigned S3 PUT URL for direct browser → S3 upload
router.post('/presigned-url', authenticate, getUploadPresignedUrl);

export default router;
