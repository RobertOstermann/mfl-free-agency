import { definePrismaConfig } from "@prisma/cli-engine";
import { defineConfig as ormConfig } from "@prisma/orm-postgres/config";
import { config as loadEnv } from "dotenv";

// Mirror Vite's precedence: `.env.local` wins over `.env`. dotenv never
// overwrites an already-set key, so load the higher-priority file first.
loadEnv({ path: [".env.local", ".env"], quiet: true });

// eslint-disable-next-line import/no-default-export
export default definePrismaConfig({
  orm: ormConfig({
    contract: "./src/prisma/contract.prisma",
    db: {
      connection: process.env["DATABASE_URL_UNPOOLED"]!,
    },
    migrations: {
      dir: "./src/prisma/codegen",
    },
  }),
});
