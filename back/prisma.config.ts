import "dotenv/config";
import * as process from "process";

export default {
  schema: "./prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL,
  },
  migrations: {
    seed: "node ./prisma/seed.js",
  },
};
