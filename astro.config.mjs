import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://ecosystem.secondrenaissance.net',
  integrations: [react()],
});
