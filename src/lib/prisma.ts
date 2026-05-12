import { PrismaClient } from "@/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "node:path";

const tursoUrl = process.env.TURSO_URL;
const tursoToken = process.env.TURSO_TOKEN;

const adapter = tursoUrl
  ? new PrismaLibSql({ url: tursoUrl, authToken: tursoToken })
  : new PrismaLibSql({ url: `file:${path.join(process.cwd(), "data", "photography.db")}` });

export const prisma = new PrismaClient({ adapter });
