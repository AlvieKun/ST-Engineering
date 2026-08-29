'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, MailOpen, Trash2 } from 'lucide-react';
import { getMessages, markMessageRead, deleteMessage } from '../actions';

type Message = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);

  useEffect(() => {
    loadMessages();
  }, []);

  async function loadMessages() {
    try {
      const data = await getMessages();
      setMessages(
        (data as any[]).map((m) => ({
          ...m,
          createdAt: m.createdAt instanceof Date ? m.createdAt.toISOString() : m.createdAt,
        }))
      );
    } catch {
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }

  async function toggleRead(msg: Message) {
    try {
      await markMessageRead(msg.id, !msg.read);
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, read: !m.read } : m))
      );
      if (selected?.id === msg.id) {
        setSelected({ ...msg, read: !msg.read });
      }
    } catch {
      // ignore
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this message?')) return;
    try {
      await deleteMessage(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch {
      // ignore
    }
  }

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <main className="container py-16">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <p className="eyebrow mb-4">CMS / Messages</p>
          <h1 className="title">
            Inbox.
            {unreadCount > 0 && (
              <span className="ml-3 text-lg text-[var(--accent)]">
                {unreadCount} unread
              </span>
            )}
          </h1>
        </div>
        <Link href="/admin" className="font-mono text-xs text-[var(--muted)]">
          ← Dashboard
        </Link>
      </div>

      {loading ? (
        <p className="text-[var(--muted)]">Loading...</p>
      ) : messages.length === 0 ? (
        <div className="border-t grid-line py-16 text-center text-[var(--muted)]">
          No messages yet.
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
          {/* Message list */}
          <div className="space-y-0">
            {messages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => {
                  setSelected(msg);
                  if (!msg.read) toggleRead(msg);
                }}
                className={`flex w-full items-start gap-3 border-b grid-line py-4 text-left ${
                  selected?.id === msg.id ? 'bg-[var(--panel)]' : ''
                }`}
              >
                {msg.read ? (
                  <MailOpen size={14} className="mt-1 shrink-0 text-[var(--muted)]" />
                ) : (
                  <Mail size={14} className="mt-1 shrink-0 text-[var(--accent)]" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`truncate text-sm ${msg.read ? '' : 'font-bold'}`}>
                      {msg.name}
                    </span>
                    <span className="shrink-0 font-mono text-[10px] text-[var(--muted)]">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mt-1 truncate text-xs text-[var(--muted)]">{msg.subject}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Message detail */}
          <div className="border grid-line p-6">
            {selected ? (
              <div>
                <div className="mb-6 flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold">{selected.subject}</h2>
                    <div className="mt-2 font-mono text-xs text-[var(--muted)]">
                      From: {selected.name} &lt;{selected.email}&gt;
                    </div>
                    <div className="mt-1 font-mono text-[10px] text-[var(--muted)]">
                      {new Date(selected.createdAt).toLocaleString('en-SG', {
                        timeZone: 'Asia/Singapore',
                        dateStyle: 'full',
                        timeStyle: 'short',
                      })}{' '}
                      (SGT)
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleRead(selected)}
                      className="font-mono text-xs text-[var(--muted)] hover:text-[var(--accent)]"
                    >
                      {selected.read ? 'Mark unread' : 'Mark read'}
                    </button>
                    <button
                      onClick={() => handleDelete(selected.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="whitespace-pre-line border-t grid-line pt-6 text-sm leading-7">
                  {selected.message}
                </div>
                <div className="mt-6 border-t grid-line pt-4">
                  <a
                    href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                    className="font-mono text-xs text-[var(--accent)] hover:underline"
                  >
                    Reply via email →
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-[var(--muted)]">
                Select a message to read
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
