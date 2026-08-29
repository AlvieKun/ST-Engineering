import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function getDatabaseUrl(): string {
  let url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not set');

  // Append PgBouncer-friendly connection pool parameters if not already present.
  // pgbouncer=true: Disable prepared statements (required by PgBouncer transaction mode).
  // connection_limit=2: Keep pool tiny — each Vercel serverless instance gets its
  //   own PrismaClient, so we must not exhaust PgBouncer's per-project limit.
  // pool_timeout=15: Allow more time to acquire a connection during cold starts.
  const params = [
    ['pgbouncer', 'true'],
    ['connection_limit', '2'],
    ['pool_timeout', '15'],
  ];

  for (const [key, value] of params) {
    if (!url.includes(`${key}=`)) {
      url += url.includes('?') ? '&' : '?';
      url += `${key}=${value}`;
    }
  }

  return url;
}

// PrismaClient with connection pool tuned for Vercel serverless + Supabase PgBouncer.
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
  });

// In development, reuse the client across hot reloads to avoid
// exhausting the connection pool on file changes.
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
