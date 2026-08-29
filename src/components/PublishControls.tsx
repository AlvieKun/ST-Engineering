'use client';

import { useState } from 'react';

type PublishControlsProps = {
  publishStatus: string;
  scheduledAt: string | null;
};

export default function PublishControls({ publishStatus, scheduledAt }: PublishControlsProps) {
  const [status, setStatus] = useState(publishStatus);
  const [date, setDate] = useState(
    scheduledAt ? new Date(scheduledAt).toISOString().slice(0, 10) : ''
  );
  const [time, setTime] = useState(
    scheduledAt ? new Date(scheduledAt).toISOString().slice(11, 16) : '09:00'
  );

  return (
    <section className="border-t grid-line pt-8">
      <p className="eyebrow mb-6">Publication</p>

      <input type="hidden" name="publishStatus" value={status} />
      <input
        type="hidden"
        name="scheduledAt"
        value={status === 'SCHEDULED' && date ? `${date}T${time}:00.000Z` : ''}
      />

      <div className="grid gap-6 md:grid-cols-3">
        {/* Draft */}
        <label
          className="flex cursor-pointer items-center gap-3 border grid-line p-4"
          style={
            status === 'DRAFT'
              ? { borderColor: 'var(--ink)', backgroundColor: 'var(--panel)' }
              : undefined
          }
        >
          <input
            type="radio"
            name="publishStatusRadio"
            value="DRAFT"
            checked={status === 'DRAFT'}
            onChange={() => setStatus('DRAFT')}
            className="accent-[var(--ink)]"
          />
          <div>
            <div className="font-mono text-xs font-bold">Draft</div>
            <div className="mt-1 text-[10px] text-[var(--muted)]">Private</div>
          </div>
        </label>

        {/* Scheduled */}
        <label
          className="flex cursor-pointer items-center gap-3 border grid-line p-4"
          style={
            status === 'SCHEDULED'
              ? { borderColor: 'var(--ink)', backgroundColor: 'var(--panel)' }
              : undefined
          }
        >
          <input
            type="radio"
            name="publishStatusRadio"
            value="SCHEDULED"
            checked={status === 'SCHEDULED'}
            onChange={() => setStatus('SCHEDULED')}
            className="accent-[var(--ink)]"
          />
          <div>
            <div className="font-mono text-xs font-bold">Scheduled</div>
            <div className="mt-1 text-[10px] text-[var(--muted)]">Future publish</div>
          </div>
        </label>

        {/* Published */}
        <label
          className="flex cursor-pointer items-center gap-3 border grid-line p-4"
          style={
            status === 'PUBLISHED'
              ? { borderColor: 'var(--ink)', backgroundColor: 'var(--panel)' }
              : undefined
          }
        >
          <input
            type="radio"
            name="publishStatusRadio"
            value="PUBLISHED"
            checked={status === 'PUBLISHED'}
            onChange={() => setStatus('PUBLISHED')}
            className="accent-[var(--ink)]"
          />
          <div>
            <div className="font-mono text-xs font-bold">Published</div>
            <div className="mt-1 text-[10px] text-[var(--muted)]">Live now</div>
          </div>
        </label>
      </div>

      {status === 'SCHEDULED' && (
        <div className="mt-5 flex flex-col gap-4 border grid-line p-5 md:flex-row md:items-end">
          <div>
            <span className="mb-2 block font-mono text-xs text-[var(--muted)]">Publish date</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              min={new Date().toISOString().slice(0, 10)}
              className="border-b grid-line bg-transparent px-0 py-2 font-mono text-sm outline-none focus:border-[var(--accent)]"
            />
          </div>
          <div>
            <span className="mb-2 block font-mono text-xs text-[var(--muted)]">Publish time</span>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              className="border-b grid-line bg-transparent px-0 py-2 font-mono text-sm outline-none focus:border-[var(--accent)]"
            />
          </div>
          <span className="font-mono text-[10px] text-[var(--muted)]">
            Singapore Time (SGT, UTC+8)
          </span>
        </div>
      )}
    </section>
  );
}
