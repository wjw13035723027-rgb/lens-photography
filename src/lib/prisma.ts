import { PrismaClient } from "@/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "node:path";

const tursoUrl = process.env.TURSO_URL;
const tursoToken = process.env.TURSO_TOKEN;
const remoteDbRequired = process.env.VERCEL === "1" || process.env.TURSO_REQUIRED === "true";

if (!tursoUrl && remoteDbRequired) {
  throw new Error("TURSO_URL must be set when deploying or when TURSO_REQUIRED=true");
}

if (tursoUrl?.startsWith("libsql://") && !tursoToken) {
  throw new Error("TURSO_TOKEN must be set for hosted Turso databases");
}

const adapter = tursoUrl
  ? new PrismaLibSql({ url: tursoUrl, authToken: tursoToken })
  : new PrismaLibSql({ url: `file:${path.join(process.cwd(), "data", "photography.db")}` });

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
