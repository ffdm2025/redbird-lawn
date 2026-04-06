// src/content.config.ts
// Astro 6 content collection definition for blog posts.
// Uses the new glob() loader — legacy src/content/config.ts is removed in Astro 6.
// Schema validation runs at build time — all frontmatter fields are type-checked.
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    author: z.string().default('Alberto Murillo'),
    excerpt: z.string(),
    tags: z.array(z.string()).optional().default([]),
    ogImage: z.string().optional(),
  }),
});

export const collections = { blog };
