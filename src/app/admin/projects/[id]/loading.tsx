export default function EditProjectLoading() {
  return (
    <main className="container max-w-4xl py-16">
      <div className="h-3 w-24 animate-pulse bg-[var(--panel)]" />
      <div className="mb-10 mt-8">
        <div className="mb-4 h-3 w-32 animate-pulse bg-[var(--panel)]" />
        <div className="h-8 w-48 animate-pulse bg-[var(--panel)]" />
      </div>
      <div className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="h-12 animate-pulse bg-[var(--panel)]" />
          <div className="h-12 animate-pulse bg-[var(--panel)]" />
        </div>
        <div className="h-12 animate-pulse bg-[var(--panel)]" />
        <div className="grid gap-6 md:grid-cols-3">
          <div className="h-12 animate-pulse bg-[var(--panel)]" />
          <div className="h-12 animate-pulse bg-[var(--panel)]" />
          <div className="h-12 animate-pulse bg-[var(--panel)]" />
        </div>
        <div className="h-40 animate-pulse bg-[var(--panel)]" />
      </div>
    </main>
  );
}
