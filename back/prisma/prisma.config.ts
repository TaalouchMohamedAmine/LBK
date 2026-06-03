import { defineConfig } from "@prisma/internals";

export default defineConfig({
  // Configuration handled via DATABASE_URL env variable
  // and passed to PrismaClient via datasourceUrl
});
