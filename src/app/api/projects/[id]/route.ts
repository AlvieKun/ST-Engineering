import { NextResponse } from 'next/server';
import { getProjectById } from '@/lib/content';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const project = await getProjectById(id);
    if (!project) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ project });
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
