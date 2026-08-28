import { getPublishedPosts } from '@/lib/content';
import BlogClient from './BlogClient';

export const dynamic = 'force-dynamic';

export default async function Blog() {
  const posts = await getPublishedPosts();

  return <BlogClient initialPosts={posts} />;
}
