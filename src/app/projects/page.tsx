import { getPublishedProjects } from '@/lib/content';
import ProjectsClient from './ProjectsClient';

export const dynamic = 'force-dynamic';

export default async function Projects() {
  const projects = await getPublishedProjects();

  return <ProjectsClient initialProjects={projects} />;
}
