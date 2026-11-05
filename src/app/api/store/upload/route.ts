import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import {
  verifyAdminAuth,
  checkRateLimit,
  getClientIp,
} from '@/core/security/guard';

const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    if (!checkRateLimit(`upload:${ip}`, 20, 300_000)) {
      return NextResponse.json(
        { success: false, message: 'تجاوزت الحد المسموح من عمليات الرفع، يرجى الانتظار' },
        { status: 429 }
      );
    }

    const auth = verifyAdminAuth(req);
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: 'غير مصرح لك برفع ملفات' },
        { status: 401 }
      );
    }

    const contentType = req.headers.get('content-type') || '';
    const uploadedUrls: string[] = [];

    // Ensure upload directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'media', 'uploads');
    let canWriteToDisk = true;
    try {
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
    } catch {
      canWriteToDisk = false;
    }

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const files: File[] = [];

      for (const entry of formData.values()) {
        if (entry instanceof File && entry.size > 0) {
          if (entry.size > MAX_FILE_SIZE_BYTES) {
            return NextResponse.json(
              { success: false, message: 'حجم الصورة يتجاوز الحد الأقصى (5 ميجابايت)' },
              { status: 400 }
            );
          }
          files.push(entry);
        }
      }

      for (let idx = 0; idx < files.length; idx++) {
        const file = files[idx];
        const rawName = file.name || 'image.jpg';
        const rawExt = path.extname(rawName).toLowerCase() || '.jpg';

        if (!ALLOWED_EXTENSIONS.has(rawExt)) {
          return NextResponse.json(
            { success: false, message: 'نوع الملف غير مدعوم. الصيغ المسموحة: JPG, PNG, WEBP, GIF' },
            { status: 400 }
          );
        }

        const fileName = `img-${Date.now()}-${idx}${rawExt}`;
        const filePath = path.join(uploadsDir, fileName);

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        if (canWriteToDisk) {
          try {
            fs.writeFileSync(filePath, buffer);
            uploadedUrls.push(`/media/uploads/${fileName}`);
          } catch {
            const mime = ALLOWED_MIME_TYPES.has(file.type) ? file.type : 'image/jpeg';
            const base64 = buffer.toString('base64');
            uploadedUrls.push(`data:${mime};base64,${base64}`);
          }
        } else {
          const mime = ALLOWED_MIME_TYPES.has(file.type) ? file.type : 'image/jpeg';
          const base64 = buffer.toString('base64');
          uploadedUrls.push(`data:${mime};base64,${base64}`);
        }
      }
    } else {
      // JSON body with data URLs
      const body = await req.json();
      const filesList = Array.isArray(body.files) ? body.files : [];

      for (let idx = 0; idx < filesList.length; idx++) {
        const item = filesList[idx];
        const dataUrl = typeof item === 'string' ? item : item.dataUrl;

        if (!dataUrl || typeof dataUrl !== 'string') continue;

        const match = dataUrl.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
        if (match) {
          const mime = match[1].toLowerCase();
          if (!ALLOWED_MIME_TYPES.has(mime)) {
            continue;
          }

          let ext = '.jpg';
          if (mime.includes('png')) ext = '.png';
          else if (mime.includes('webp')) ext = '.webp';
          else if (mime.includes('gif')) ext = '.gif';

          const base64Data = match[2];
          const buffer = Buffer.from(base64Data, 'base64');

          if (buffer.length > MAX_FILE_SIZE_BYTES) {
            continue;
          }

          if (canWriteToDisk) {
            const fileName = `img-${Date.now()}-${idx}${ext}`;
            const filePath = path.join(uploadsDir, fileName);
            try {
              fs.writeFileSync(filePath, buffer);
              uploadedUrls.push(`/media/uploads/${fileName}`);
            } catch {
              uploadedUrls.push(dataUrl);
            }
          } else {
            uploadedUrls.push(dataUrl);
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      count: uploadedUrls.length,
      urls: uploadedUrls,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, message: 'فشل رفع الصور' },
      { status: 500 }
    );
  }
}
