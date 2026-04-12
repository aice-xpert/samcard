import express, { Response } from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { supabase } from '../config/supabase';
import { AuthRequest, verifySession } from '../middleware/auth';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

const normalizeBucketName = (value: unknown): string | undefined => {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed || undefined;
};

router.post('/', verifySession, upload.single('file'), async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.file;
    const ext = path.extname(file.originalname);
    const filename = `${uuidv4()}${ext}`;

    // Resolve bucket in strict priority: explicit request bucket -> env bucket -> fallback.
    const bucket =
      normalizeBucketName(req.body?.bucket) ||
      normalizeBucketName(process.env.STORAGE_BUCKET) ||
      normalizeBucketName(process.env.SUPABASE_BUCKET) ||
      'samcard-profiles';

    const filePath = `${req.user!.uid}/${filename}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (uploadError) {
      return res.status(500).json({ error: uploadError.message });
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(uploadData.path);

    return res.json({
      url: publicUrl,
      bucket,
      path: uploadData.path,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

export default router;
