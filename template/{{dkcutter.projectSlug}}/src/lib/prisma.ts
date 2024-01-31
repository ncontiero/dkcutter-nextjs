import { PrismaClient } from "@prisma/client";

{%- if dkcutter.useEnvValidator %}

import { env } from "@/env.mjs";
{%- else %}

const env = process.env;
{%- endif %}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
