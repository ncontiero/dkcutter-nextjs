import "dotenv/config";
import { defineConfig } from "prisma/config";
import { env } from "./src/env";

export default defineConfig({
  datasource: {
    url: env.DATABASE_URL,
  },
});
