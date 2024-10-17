import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Transform string to Date object
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
  }),
});

const app = defineCollection({
  type: 'content',
  // Type-check frontmatter using a schema
  schema: z.object({
    name: z.string(),
    baseline: z.string(),
    // Transform string to Date object
    playStoreLink: z.string().url().startsWith('https://play.google.com'),
    appleStoreLink: z.string().url().startsWith('https://apps.apple.com'),
    logoImage: z.string(),
    heroImage: z.string(),

    // Transform string to Date object
	pubDate: z.coerce.date(),
	isPublic: z.boolean().default(true),
	
	deleteAccountFormUrl: z.string().url().startsWith('https://'),
  }),
});

const privacy = defineCollection({
  type: 'content',
  // Type-check frontmatter using a schema
  schema: z.object({
	title: z.string(),
	// Transform string to Date object
	pubDate: z.coerce.date(),
  }),
});

const tos = defineCollection({
	type: 'content',
	// Type-check frontmatter using a schema
	schema: z.object({
	  title: z.string(),
	  // Transform string to Date object
	  pubDate: z.coerce.date(),
	}),
  });

export const collections = { blog, app, privacy, tos };
