import { prisma } from '@/lib/prisma';
import { projects as fallbackProjects, posts as fallbackPosts } from './data';

export type Project = {
  id: string;
  slug: string;
  title: string;
  description: string;
  summary: string;
  category: string;
  tags: string[];
  status: string;
  featured: boolean;
  year: string;
  problem: string;
  solution: string;
  implementation: string;
  decisions: string;
  failure: string;
  lessons: string;
  metrics: { value: string; label: string; description: string }[];
  links: Record<string, string>;
  architecture: string;
};

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
  projectId?: string;
  content: string;
};

export type SiteSettings = {
  resumeVisible: boolean;
  resumeUrl: string | null;
  adminEmail: string;
};

// Map database project to UI shape
function mapProject(p: any): Project {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    description: p.shortDescription,
    summary: p.content || p.shortDescription,
    category: p.categories[0] || 'Build',
    tags: p.tags?.map((t: any) => t.tag?.name || t) || [],
    status: p.status,
    featured: p.featured,
    year: String((p.publishedAt || p.createdAt).getFullYear()),
    problem: p.problem,
    solution: p.solution,
    implementation: p.implementation,
    decisions: p.engineeringDecisions,
    failure: p.failureAnalysis,
    lessons: p.lessonsLearned,
    metrics: p.metrics?.map((m: any) => ({
      value: m.value,
      label: m.label,
      description: m.description || '',
    })) || [],
    links: Object.fromEntries(
      Object.entries({
        github: p.githubUrl,
        demo: p.demoUrl,
        documentation: p.documentationUrl,
        paper: p.paperUrl,
        huggingFace: p.huggingFaceUrl,
        dataset: p.datasetUrl,
      }).filter(([, value]) => value)
    ),
    architecture: p.architectureImageUrl || 'Architecture diagram',
  };
}

// Map database post to UI shape
function mapPost(p: any): Post {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    date: (p.publishedAt || p.createdAt).toISOString().slice(0, 10),
    readTime: `${Math.max(1, Math.ceil(p.content.trim().split(/\s+/).filter(Boolean).length / 220))} min read`,
    tags: p.tags?.map((t: any) => t.tag?.name || t) || [],
    projectId: p.projectId,
    content: p.content,
  };
}

export async function getPublishedProjects(): Promise<Project[]> {
  if (!process.env.DATABASE_URL) return fallbackProjects;
  try {
    const rows = await prisma.project.findMany({
      where: { publishStatus: 'PUBLISHED' },
      include: { metrics: true, tags: { include: { tag: true } } },
      orderBy: [{ featured: 'desc' }, { publishedAt: 'desc' }],
    });
    return rows.map(mapProject);
  } catch {
    return fallbackProjects;
  }
}

export async function getPublishedPosts(): Promise<Post[]> {
  if (!process.env.DATABASE_URL) return fallbackPosts;
  try {
    const rows = await prisma.blogPost.findMany({
      where: { publishStatus: 'PUBLISHED' },
      include: { tags: { include: { tag: true } } },
      orderBy: { publishedAt: 'desc' },
    });
    return rows.map(mapPost);
  } catch {
    return fallbackPosts;
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (!process.env.DATABASE_URL) {
    return fallbackProjects.find((p) => p.slug === slug) || null;
  }
  try {
    const row = await prisma.project.findUnique({
      where: { slug },
      include: { metrics: true, tags: { include: { tag: true } } },
    });
    if (!row) return null;
    return mapProject(row);
  } catch {
    return fallbackProjects.find((p) => p.slug === slug) || null;
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!process.env.DATABASE_URL) {
    return fallbackPosts.find((p) => p.slug === slug) || null;
  }
  try {
    const row = await prisma.blogPost.findUnique({
      where: { slug },
      include: { tags: { include: { tag: true } } },
    });
    if (!row) return null;
    return mapPost(row);
  } catch {
    return fallbackPosts.find((p) => p.slug === slug) || null;
  }
}

export async function getRelatedPosts(projectId: string): Promise<Post[]> {
  if (!process.env.DATABASE_URL) {
    return fallbackPosts.filter((p) => p.projectId === projectId);
  }
  try {
    const rows = await prisma.blogPost.findMany({
      where: { projectId, publishStatus: 'PUBLISHED' },
      include: { tags: { include: { tag: true } } },
      orderBy: { publishedAt: 'desc' },
    });
    return rows.map(mapPost);
  } catch {
    return fallbackPosts.filter((p) => p.projectId === projectId);
  }
}

// Admin functions - return raw database rows (throw on error so dashboard can display it)
export async function getAllProjects() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not configured');
  return await prisma.project.findMany({
    include: { metrics: true, tags: { include: { tag: true } } },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getAllPosts() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not configured');
  return await prisma.blogPost.findMany({
    include: { tags: { include: { tag: true } }, project: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getProjectById(id: string) {
  if (!process.env.DATABASE_URL) return null;
  try {
    return await prisma.project.findUnique({
      where: { id },
      include: { metrics: true, tags: { include: { tag: true } } },
    });
  } catch {
    return null;
  }
}

export async function getPostById(id: string) {
  if (!process.env.DATABASE_URL) return null;
  try {
    return await prisma.blogPost.findUnique({
      where: { id },
      include: { tags: { include: { tag: true } }, project: true },
    });
  } catch {
    return null;
  }
}

export async function getAllTags() {
  if (!process.env.DATABASE_URL) return [];
  try {
    return await prisma.tag.findMany({
      orderBy: { name: 'asc' },
    });
  } catch {
    return [];
  }
}

export async function getSiteSettingsData(): Promise<SiteSettings> {
  const defaultSettings: SiteSettings = {
    resumeVisible: false,
    resumeUrl: null,
    adminEmail: 'sarthak_tallamraju@mymail.sutd.edu.sg',
  };
  if (!process.env.DATABASE_URL) return defaultSettings;
  try {
    const row = await prisma.siteSettings.findUnique({
      where: { id: 'singleton' },
    });
    return row
      ? { resumeVisible: row.resumeVisible, resumeUrl: row.resumeUrl, adminEmail: row.adminEmail }
      : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

export async function getProjectCounts() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not configured');
  const [total, published, drafts] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { publishStatus: 'PUBLISHED' } }),
    prisma.project.count({ where: { publishStatus: 'DRAFT' } }),
  ]);
  return { total, published, drafts };
}

export async function getPostCounts() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not configured');
  const [total, published, drafts] = await Promise.all([
    prisma.blogPost.count(),
    prisma.blogPost.count({ where: { publishStatus: 'PUBLISHED' } }),
    prisma.blogPost.count({ where: { publishStatus: 'DRAFT' } }),
  ]);
  return { total, published, drafts };
}
