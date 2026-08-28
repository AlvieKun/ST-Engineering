import { getPublishedPosts } from '@/lib/content';
import BlogClient from './BlogClient';

export default async function Blog() {
  const posts = await getPublishedPosts();

  return <BlogClient initialPosts={posts} />;
}
