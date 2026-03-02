import { getPresignedUploadUrl } from '../services/s3Service.js';

/**
 * POST /api/upload/presigned-url
 * Body: { ticketId, filename, contentType }
 *
 * Returns a short-lived S3 presigned PUT URL.
 * The browser uploads the file directly to S3 — never hits our Express server.
 * This is the standard AWS pattern for secure, scalable file uploads.
 */
export const getUploadPresignedUrl = async (req, res, next) => {
  try {
    const { ticketId, filename, contentType } = req.body;

    if (!ticketId || !filename || !contentType) {
      return res.status(400).json({
        error: 'ticketId, filename, and contentType are required',
      });
    }

    const { uploadUrl, fileUrl, s3Key } = await getPresignedUploadUrl(
      ticketId,
      filename,
      contentType
    );

    res.json({
      uploadUrl,
      fileUrl,
      s3Key,
      bucket: process.env.AWS_S3_BUCKET || 'eaas-ticket-attachments',
      region: process.env.AWS_REGION || 'ap-south-1',
      expiresIn: parseInt(process.env.AWS_S3_PRESIGNED_URL_EXPIRY || '900', 10),
    });
  } catch (error) {
    next(error);
  }
};
