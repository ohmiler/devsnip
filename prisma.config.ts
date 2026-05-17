import { config } from "dotenv";
import { defineConfig } from "prisma/config";

config({ path: ".env" });
config({ path: ".env.local", override: true });

const datasourceUrl = process.env.MIGRATE_DATABASE_URL ?? process.env.DATABASE_URL;

if (!datasourceUrl) {
  throw new Error("Set DATABASE_URL or MIGRATE_DATABASE_URL before running Prisma commands.");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: datasourceUrl,
  },
});
