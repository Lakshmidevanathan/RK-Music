import { PrismaBetterSQLite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";
import path from "path";

/** Resolve SQLite path the same way Prisma CLI does (relative to prisma/). */
function sqliteUrl(): string {
  const raw = process.env.DATABASE_URL ?? "file:./dev.db";
  if (!raw.startsWith("file:")) return raw;

  const filePart = raw.slice("file:".length);
  if (path.isAbsolute(filePart)) return raw;

  const absolute = path.join(process.cwd(), "prisma", filePart.replace(/^\.\//, ""));
  return absolute;
}

function createPrismaClient() {
  const adapter = new PrismaBetterSQLite3({ url: sqliteUrl() });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
