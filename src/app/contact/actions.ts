'use server';

import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';

type ContactInput = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export async function submitContactForm(input: ContactInput): Promise<{ success?: boolean; error?: string }> {
  const { name, email, subject, message } = input;

  // Server-side validation
  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();
  const cleanSubject = subject.trim();
  const cleanMessage = message.trim();

  if (!cleanName || cleanName.length > 100) {
    return { error: 'Name is required and must be under 100 characters.' };
  }

  if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) || cleanEmail.length > 200) {
    return { error: 'Please enter a valid email address.' };
  }

  if (!cleanSubject || cleanSubject.length > 200) {
    return { error: 'Subject is required and must be under 200 characters.' };
  }

  if (!cleanMessage || cleanMessage.length < 10 || cleanMessage.length > 5000) {
    return { error: 'Message must be between 10 and 5000 characters.' };
  }

  // Basic spam protection: reject messages with excessive links
  const linkCount = (cleanMessage.match(/https?:\/\//g) || []).length;
  if (linkCount > 3) {
    return { error: 'Message contains too many links. Please reduce them.' };
  }

  try {
    // Store message in database
    await prisma.contactMessage.create({
      data: {
        name: cleanName,
        email: cleanEmail,
        subject: cleanSubject,
        message: cleanMessage,
      },
    });

    // Send email notification via Resend (best-effort)
    try {
      await sendEmailNotification({
        name: cleanName,
        email: cleanEmail,
        subject: cleanSubject,
        message: cleanMessage,
      });
    } catch {
      // Email notification failure is non-fatal; the message is already stored
    }

    return { success: true };
  } catch {
    return { error: 'Something went wrong while sending your message. Please try again.' };
  }
}

async function sendEmailNotification(input: ContactInput) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return; // Resend not configured — skip silently

  const resend = new Resend(apiKey);
  const timestamp = new Date().toLocaleString('en-SG', { timeZone: 'Asia/Singapore' });

  await resend.emails.send({
    from: 'Portfolio Contact <onboarding@resend.dev>',
    to: 'sarthak_tallamraju@mymail.sutd.edu.sg',
    subject: `[Contact] ${input.subject}`,
    text: `New message from ${input.name} (${input.email})\n\nSubject: ${input.subject}\n\n${input.message}\n\n---\nSubmitted: ${timestamp} (SGT)`,
    replyTo: input.email,
  });
}
