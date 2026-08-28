import { NextResponse } from 'next/server';
import { getAllProjects } from '@/lib/content';

export async function GET() {
  try {
    const projects = await getAllProjects();
    return NextResponse.json({
      projects: projects.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        publishStatus: p.publishStatus,
      })),
    });
  } catch {
    return NextResponse.json({ projects: [] });
  }
}
