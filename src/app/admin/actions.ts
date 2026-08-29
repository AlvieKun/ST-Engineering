'use server';
import { revalidatePath } from 'next/cache'; import { prisma } from '@/lib/prisma'; import { requireAdmin } from '@/lib/supabase/server'; import { projectInput, postInput } from '@/lib/validation';

function publishedAt(status: string, scheduledAt?: string) {
  if (status === 'PUBLISHED') return new Date();
  if (status === 'SCHEDULED' && scheduledAt) return null;
  return null;
}

function scheduledAt(status: string, scheduledAt?: string) {
  if (status === 'SCHEDULED' && scheduledAt) {
    return new Date(scheduledAt);
  }
  return null;
}

export async function createProject(input: unknown) {
  await requireAdmin();
  const data = projectInput.parse(input);
  const { categories, technologies, scheduledAt: schedAt, ...rest } = data as any;
  const project = await prisma.project.create({
    data: {
      ...rest,
      categories,
      technologies,
      publishedAt: publishedAt(data.publishStatus, schedAt),
      scheduledAt: scheduledAt(data.publishStatus, schedAt),
    },
  });
  revalidatePath('/');
  revalidatePath('/projects');
  return project.id;
}

export async function updateProject(id: string, input: unknown) {
  await requireAdmin();
  const data = projectInput.parse(input);
  const { categories, technologies, scheduledAt: schedAt, ...rest } = data as any;
  await prisma.project.update({
    where: { id },
    data: {
      ...rest,
      categories,
      technologies,
      publishedAt: publishedAt(data.publishStatus, schedAt),
      scheduledAt: scheduledAt(data.publishStatus, schedAt),
    },
  });
  revalidatePath('/');
  revalidatePath('/projects');
  revalidatePath(`/projects/${data.slug}`);
  return id;
}

export async function deleteProject(id: string) {
  await requireAdmin();
  await prisma.project.delete({ where: { id } });
  revalidatePath('/');
  revalidatePath('/projects');
}

export async function createPost(input: unknown) {
  await requireAdmin();
  const data = postInput.parse(input);
  const { tags, projectId, scheduledAt: schedAt, ...rest } = data as any;
  const post = await prisma.blogPost.create({
    data: {
      ...rest,
      projectId: projectId || null,
      publishedAt: publishedAt(data.publishStatus, schedAt),
      scheduledAt: scheduledAt(data.publishStatus, schedAt),
      tags: { create: await tagLinks(tags) },
    },
  });
  revalidatePath('/');
  revalidatePath('/blog');
  return post.id;
}

export async function updatePost(id: string, input: unknown) {
  await requireAdmin();
  const data = postInput.parse(input);
  const { tags, projectId, scheduledAt: schedAt, ...rest } = data as any;
  await prisma.$transaction([
    prisma.blogPostTag.deleteMany({ where: { blogPostId: id } }),
    prisma.blogPost.update({
      where: { id },
      data: {
        ...rest,
        projectId: projectId || null,
        publishedAt: publishedAt(data.publishStatus, schedAt),
        scheduledAt: scheduledAt(data.publishStatus, schedAt),
        tags: { create: await tagLinks(tags) },
      },
    }),
  ]);
  revalidatePath('/');
  revalidatePath('/blog');
  revalidatePath(`/blog/${data.slug}`);
  return id;
}

export async function deletePost(id: string) {
  await requireAdmin();
  await prisma.blogPost.delete({ where: { id } });
  revalidatePath('/');
  revalidatePath('/blog');
}

export async function updateSiteSettings(data: { resumeVisible: boolean; resumeUrl?: string | null }) {
  await requireAdmin();
  const existing = await prisma.siteSettings.findUnique({ where: { id: 'singleton' } });
  if (existing) {
    await prisma.siteSettings.update({
      where: { id: 'singleton' },
      data: { resumeVisible: data.resumeVisible, resumeUrl: data.resumeUrl ?? existing.resumeUrl },
    });
  } else {
    await prisma.siteSettings.create({
      data: {
        id: 'singleton',
        adminEmail: 'sarthak_tallamraju@mymail.sutd.edu.sg',
        resumeVisible: data.resumeVisible,
        resumeUrl: data.resumeUrl ?? null,
      },
    });
  }
  revalidatePath('/');
  revalidatePath('/admin/settings');
  return true;
}

export async function getMessages() {
  await requireAdmin();
  return await prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function markMessageRead(id: string, read: boolean) {
  await requireAdmin();
  await prisma.contactMessage.update({
    where: { id },
    data: { read },
  });
  revalidatePath('/admin/messages');
}

export async function deleteMessage(id: string) {
  await requireAdmin();
  await prisma.contactMessage.delete({ where: { id } });
  revalidatePath('/admin/messages');
}

async function tagLinks(names: string[]) {
  return Promise.all(
    names.map(async (name) => {
      const tag = await prisma.tag.upsert({
        where: { name },
        update: {},
        create: { name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-') },
      });
      return { tagId: tag.id };
    })
  );
}
