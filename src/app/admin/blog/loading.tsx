export default function BlogLoading() {
  return (
    <main className="container py-16">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <div className="mb-4 h-3 w-24 animate-pulse bg-[var(--panel)]" />
          <div className="h-8 w-48 animate-pulse bg-[var(--panel)]" />
        </div>
      </div>
      <div className="border-t grid-line">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-4 border-b grid-line py-5">
            <div className="h-4 flex-1 animate-pulse bg-[var(--panel)]" />
            <div className="h-4 w-24 animate-pulse bg-[var(--panel)]" />
            <div className="h-4 w-20 animate-pulse bg-[var(--panel)]" />
          </div>
        ))}
      </div>
    </main>
  );
}
