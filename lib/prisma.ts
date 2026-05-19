import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { readDatabasePoolMax } from "@/lib/database-config";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  pgPool?: Pool;
};

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to initialize Prisma.");
}

const pgPool =
  globalForPrisma.pgPool ??
  new Pool({
    allowExitOnIdle: true,
    connectionString: databaseUrl,
    connectionTimeoutMillis: 5_000,
    idleTimeoutMillis: 10_000,
    max: readDatabasePoolMax(),
  });

const adapter = new PrismaPg(pgPool);

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

globalForPrisma.pgPool = pgPool;
globalForPrisma.prisma = prisma;

export default prisma;
