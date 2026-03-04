// @ts-check
import { defineConfig } from 'astro/config';
import fs from 'node:fs';
import path from 'node:path';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [
      {
        name: 'public-dir-index',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url && req.url.endsWith('/') && !req.url.startsWith('/@')) {
              const filePath = path.join(process.cwd(), 'public', req.url, 'index.html');
              if (fs.existsSync(filePath)) {
                req.url = req.url + 'index.html';
              }
            }
            next();
          });
        },
      },
    ],
  },

  adapter: cloudflare(),
});