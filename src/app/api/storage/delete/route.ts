import { NextResponse } from 'next/server';
import { createSupabaseServerClient, requireAdmin } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    await requireAdmin();

    const { path } = await request.json();

    if (!path || typeof path !== 'string') {
      return NextResponse.json({ error: 'No path provided.' }, { status: 400 });
    }

    // Only allow deleting from the portfolio bucket
    if (!path.startsWith('projects/') && !path.startsWith('uploads/')) {
      return NextResponse.json({ error: 'Invalid path.' }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.storage.from('portfolio').remove([path]);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Delete failed' },
      { status: 401 }
    );
  }
}
