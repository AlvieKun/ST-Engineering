export default function AdminLoading() {
  return (
    <main className="container py-16">
      <div className="flex flex-col justify-between gap-6 border-b grid-line pb-10 md:flex-row md:items-end">
        <div>
          <div className="mb-4 h-3 w-32 animate-pulse bg-[var(--panel)]" />
          <div className="h-8 w-48 animate-pulse bg-[var(--panel)]" />
          <div className="mt-5 h-4 w-64 animate-pulse bg-[var(--panel)]" />
        </div>
      </div>
      <div className="grid gap-3 py-10 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="border grid-line p-5">
            <div className="h-3 w-16 animate-pulse bg-[var(--panel)]" />
            <div className="mt-3 h-10 w-12 animate-pulse bg-[var(--panel)]" />
          </div>
        ))}
      </div>
    </main>
  );
}
