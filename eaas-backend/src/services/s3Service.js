import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

const REGION = process.env.AWS_REGION || 'ap-south-1';
const BUCKET = process.env.AWS_S3_BUCKET || 'eaas-ticket-attachments';
const EXPIRY = parseInt(process.env.AWS_S3_PRESIGNED_URL_EXPIRY || '900', 10);

const s3 = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const ALLOWED_CONTENT_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
  'image/jpg',
]);

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * Generate a presigned PUT URL so the browser can upload directly to S3.
 * The file never passes through our backend — bandwidth stays zero.
 *
 * @param {string} ticketId  - e.g. TKT-006
 * @param {string} filename  - original filename from the browser
 * @param {string} contentType - MIME type
 * @returns {{ uploadUrl: string, fileUrl: string, s3Key: string }}
 */
export const getPresignedUploadUrl = async (ticketId, filename, contentType) => {
  if (!ALLOWED_CONTENT_TYPES.has(contentType)) {
    throw new Error(`Unsupported file type: ${contentType}`);
  }

  // Sanitise filename and build a deterministic S3 key
  const safeFilename = filename.replace(/[^a-zA-Z0-9.\-_]/g, '_');
  const s3Key = `tickets/${ticketId}/${uuidv4()}-${safeFilename}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: s3Key,
    ContentType: contentType,
    // Enforce max size server-side via content-length-range policy
    // (set via bucket policy for production hardening)
  });

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: EXPIRY });

  // Public read URL (bucket must have appropriate policy or use CloudFront)
  const fileUrl = `https://${BUCKET}.s3.${REGION}.amazonaws.com/${s3Key}`;

  return { uploadUrl, fileUrl, s3Key };
};

/**
 * Delete a previously uploaded attachment (e.g. when ticket is closed).
 * @param {string} s3Key
 */
export const deleteAttachment = async (s3Key) => {
  const command = new DeleteObjectCommand({ Bucket: BUCKET, Key: s3Key });
  await s3.send(command);
};

export default { getPresignedUploadUrl, deleteAttachment };
