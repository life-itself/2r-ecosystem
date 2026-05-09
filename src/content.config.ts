import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const pip = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './pip/profiles' }),
});

const cohere = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './cohere/profiles' }),
});

export const collections = { pip, cohere };
