import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const pip = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './pip/profiles' }),
});

const cohere = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './cohere/profiles' }),
});

const pages = defineCollection({
  loader: glob({
    // Explicit shallow patterns avoid picomatch negation-array issues with
    // dot-directories (.astro/) that the glob-loader watcher uses internally.
    pattern: [
      '*.{md,mdx}',
      'pip/*.{md,mdx}',
      'pip/topics/*.{md,mdx}',
      'pip/activitys/*.{md,mdx}',
      'cohere/*.{md,mdx}',
    ],
    base: '.',
  }),
  schema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    created: z.union([z.string(), z.date()]).transform((v) =>
      v instanceof Date ? v.toISOString().slice(0, 10) : v,
    ).optional(),
    authors: z.array(z.string()).optional(),
    links: z
      .array(
        z.object({
          label: z.string(),
          href: z.string(),
          primary: z.boolean().optional(),
        }),
      )
      .optional(),
  }),
});

export const collections = { pip, cohere, pages };
