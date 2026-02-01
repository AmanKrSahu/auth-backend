import 'dotenv/config';

import { defineConfig } from 'prisma/config';

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL!,
  },
  migrations: {
    seed: 'tsup src/core/database/seed.ts --format esm --no-clean --onSuccess "node dist/seed.js"',
  },
});
