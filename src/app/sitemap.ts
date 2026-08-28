import { MetadataRoute } from 'next';
import { getPublishedProjects, getPublishedPosts } from '@/lib/content';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://sarthaktallamraju.dev';

  const [projects, posts] = await Promise.all([
    getPublishedProjects(),
    getPublishedPosts(),
  ]);

  return [
    { url: base, lastModified: new Date() },
    { url: `${base}/projects`, lastModified: new Date() },
    { url: `${base}/blog`, lastModified: new Date() },
    { url: `${base}/about`, lastModified: new Date() },
    ...projects.map((p) => ({
      url: `${base}/projects/${p.slug}`,
      lastModified: new Date(),
    })),
    ...posts.map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: new Date(),
    })),
  ];
}
