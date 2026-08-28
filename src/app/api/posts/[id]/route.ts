import { NextResponse } from 'next/server';
import { getPostById } from '@/lib/content';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const post = await getPostById(id);
    if (!post) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ post });
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
