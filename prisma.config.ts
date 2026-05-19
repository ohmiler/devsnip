import { config } from "dotenv";
import { defineConfig } from "prisma/config";

config({ path: ".env" });
config({ path: ".env.local", override: true });

const datasourceUrl = process.env.MIGRATE_DATABASE_URL ?? process.env.DATABASE_URL;
const isGenerateCommand = process.argv.includes("generate");
const generateOnlyDatasourceUrl =
  "postgresql://user:password@localhost:5432/devsnip";

if (!datasourceUrl && !isGenerateCommand) {
  throw new Error("Set DATABASE_URL or MIGRATE_DATABASE_URL before running Prisma commands.");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: datasourceUrl ?? generateOnlyDatasourceUrl,
  },
});
