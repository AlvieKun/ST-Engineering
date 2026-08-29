import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function getDatabaseUrl(): string {
  let url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not set');

  // Append PgBouncer-friendly connection pool parameters if not already present.
  //
  // pgbouncer=true:
  //   Disable prepared statements (required by PgBouncer transaction mode).
  //
  // connection_limit=1:
  //   Each Vercel serverless function instance creates its own PrismaClient.
  //   With multiple concurrent instances, even connection_limit=2 causes pool
  //   exhaustion because each instance opens 2 connections to PgBouncer.
  //   Setting it to 1 minimizes the total connection footprint across all instances.
  //
  // pool_timeout=30:
  //   Give queries more time to acquire a connection, especially during cold starts
  //   when the Prisma engine needs to establish a new connection.
  const params = [
    ['pgbouncer', 'true'],
    ['connection_limit', '1'],
    ['pool_timeout', '30'],
  ];

  for (const [key, value] of params) {
    if (!url.includes(`${key}=`)) {
      url += url.includes('?') ? '&' : '?';
      url += `${key}=${value}`;
    }
  }

  return url;
}

// Ensure only ONE PrismaClient is created per serverless function instance.
// In development, reuse across hot reloads. In production (Vercel), the
// globalThis singleton prevents creating a new client on every request
// within the same function instance.
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

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
