export default function MessagesLoading() {
  return (
    <main className="container py-16">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <div className="mb-4 h-3 w-24 animate-pulse bg-[var(--panel)]" />
          <div className="h-8 w-48 animate-pulse bg-[var(--panel)]" />
        </div>
      </div>
      <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
        <div className="space-y-0">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-start gap-3 border-b grid-line py-4">
              <div className="mt-1 h-3.5 w-3.5 animate-pulse bg-[var(--panel)]" />
              <div className="flex-1">
                <div className="h-4 w-32 animate-pulse bg-[var(--panel)]" />
                <div className="mt-2 h-3 w-48 animate-pulse bg-[var(--panel)]" />
              </div>
            </div>
          ))}
        </div>
        <div className="border grid-line p-6">
          <div className="h-6 w-64 animate-pulse bg-[var(--panel)]" />
          <div className="mt-4 h-4 w-40 animate-pulse bg-[var(--panel)]" />
          <div className="mt-8 space-y-3">
            <div className="h-4 w-full animate-pulse bg-[var(--panel)]" />
            <div className="h-4 w-3/4 animate-pulse bg-[var(--panel)]" />
            <div className="h-4 w-1/2 animate-pulse bg-[var(--panel)]" />
          </div>
        </div>
      </div>
    </main>
  );
}
