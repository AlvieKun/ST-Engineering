import { NextResponse } from 'next/server';
import { createSupabaseServerClient, requireAdmin } from '@/lib/supabase/server';

const imageTypes = new Set(['image/png', 'image/jpeg', 'image/webp']);
const pdfTypes = new Set(['application/pdf']);

export async function POST(request: Request) {
  try {
    await requireAdmin();

    const form = await request.formData();
    const file = form.get('file');
    const folder = String(form.get('folder') || 'uploads');
    const type = String(form.get('type') || 'image'); // 'image' or 'deck'

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    const maxSizes: Record<string, number> = {
      image: 8 * 1024 * 1024, // 8 MB
      deck: 20 * 1024 * 1024, // 20 MB
    };

    const allowedTypes = type === 'deck' ? pdfTypes : imageTypes;
    const maxSize = maxSizes[type] || maxSizes.image;

    if (!allowedTypes.has(file.type)) {
      const expected = type === 'deck' ? 'PDF' : 'PNG, JPG, or WebP';
      return NextResponse.json(
        { error: `File type not allowed. Use ${expected}.` },
        { status: 400 }
      );
    }

    if (file.size > maxSize) {
      const mb = Math.round(maxSize / (1024 * 1024));
      return NextResponse.json(
        { error: `File too large. Maximum size is ${mb}MB.` },
        { status: 400 }
      );
    }

    const ext = type === 'deck' ? '.pdf' : file.name.split('.').pop() || 'bin';
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
    const path = `${folder}/${crypto.randomUUID()}-${safeName}`;

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.storage
      .from('portfolio')
      .upload(path, file, {
        contentType: file.type,
        upsert: false,
      });

    if (error) throw error;

    const { data } = supabase.storage.from('portfolio').getPublicUrl(path);

    return NextResponse.json({ url: data.publicUrl, path });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 401 }
    );
  }
}
