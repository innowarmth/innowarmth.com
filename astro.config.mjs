// @ts-check
import mdx from '@astrojs/mdx';
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://innowamrth.com',
	integrations: [mdx(), sitemap()],
});
