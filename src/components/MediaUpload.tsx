'use client';

import { useState, useRef } from 'react';

type MediaUploadProps = {
  label: string;
  type: 'image' | 'deck';
  value: string | null;
  onChange: (url: string | null) => void;
  folder: string;
};

export default function MediaUpload({ label, type, value, onChange, folder }: MediaUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setUploading(true);

    try {
      const form = new FormData();
      form.append('file', file);
      form.append('folder', folder);
      form.append('type', type);

      const res = await fetch('/api/storage/upload', { method: 'POST', body: form });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Upload failed');

      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  async function handleRemove() {
    // Extract the storage path from the URL for deletion
    if (value) {
      try {
        const url = new URL(value);
        const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/portfolio\/(.+)/);
        if (pathMatch) {
          await fetch('/api/storage/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ path: decodeURIComponent(pathMatch[1]) }),
          });
        }
      } catch {
        // Best-effort deletion; even if it fails, clear the URL reference
      }
    }
    onChange(null);
  }

  const accept = type === 'deck' ? '.pdf' : 'image/png,image/jpeg,image/webp';

  return (
    <label className="block">
      <span className="mb-2 block font-mono text-xs text-[var(--muted)]">{label}</span>

      {value ? (
        <div className="border grid-line p-4">
          {type === 'image' ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt={label}
              className="mb-3 max-h-48 w-auto object-contain"
            />
          ) : (
            <div className="mb-3 flex items-center gap-2 font-mono text-sm">
              <span className="text-[var(--accent)]">📄</span>
              <span className="truncate">{value.split('/').pop()}</span>
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto text-xs text-[var(--accent)] hover:underline"
              >
                View
              </a>
            </div>
          )}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="font-mono text-xs text-[var(--accent)] hover:underline"
            >
              {uploading ? 'Uploading...' : 'Replace'}
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="font-mono text-xs text-red-500 hover:underline"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          className="flex cursor-pointer flex-col items-center justify-center border border-dashed grid-line p-6 hover:border-[var(--accent)]"
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? (
            <span className="font-mono text-xs text-[var(--muted)]">Uploading...</span>
          ) : (
            <>
              <span className="mb-1 text-2xl">{type === 'image' ? '🖼️' : '📄'}</span>
              <span className="font-mono text-xs text-[var(--muted)]">
                Click to upload {type === 'image' ? 'image' : 'PDF'}
              </span>
              <span className="mt-1 font-mono text-[10px] text-[var(--muted)]">
                {type === 'image' ? 'PNG, JPG, WebP up to 8MB' : 'PDF up to 20MB'}
              </span>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="mt-2 text-xs text-red-500">{error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleUpload}
        className="hidden"
      />
    </label>
  );
}
