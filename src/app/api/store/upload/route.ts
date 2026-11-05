import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
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

      // Collect all files from formData
      for (const entry of formData.values()) {
        if (entry instanceof File && entry.size > 0) {
          files.push(entry);
        }
      }

      for (let idx = 0; idx < files.length; idx++) {
        const file = files[idx];
        const rawName = file.name || 'image.jpg';
        const rawExt = path.extname(rawName).toLowerCase() || '.jpg';
        const cleanExt = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'].includes(rawExt)
          ? rawExt
          : '.jpg';
        const fileName = `img-${Date.now()}-${idx}${cleanExt}`;
        const filePath = path.join(uploadsDir, fileName);

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        if (canWriteToDisk) {
          try {
            fs.writeFileSync(filePath, buffer);
            uploadedUrls.push(`/media/uploads/${fileName}`);
          } catch {
            // Serverless fallback to data URL
            const mime = file.type || 'image/jpeg';
            const base64 = buffer.toString('base64');
            uploadedUrls.push(`data:${mime};base64,${base64}`);
          }
        } else {
          const mime = file.type || 'image/jpeg';
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
        const name = typeof item === 'string' ? 'image.jpg' : item.name || 'image.jpg';

        if (!dataUrl) continue;

        // Extract base64 parts
        const match = dataUrl.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
        if (match && canWriteToDisk) {
          const mime = match[1];
          const base64Data = match[2];
          let ext = '.jpg';
          if (mime.includes('png')) ext = '.png';
          else if (mime.includes('webp')) ext = '.webp';
          else if (mime.includes('svg')) ext = '.svg';
          else if (mime.includes('gif')) ext = '.gif';

          const fileName = `img-${Date.now()}-${idx}${ext}`;
          const filePath = path.join(uploadsDir, fileName);

          try {
            fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
            uploadedUrls.push(`/media/uploads/${fileName}`);
          } catch {
            uploadedUrls.push(dataUrl);
          }
        } else {
          uploadedUrls.push(dataUrl);
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
