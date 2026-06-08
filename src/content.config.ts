import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const heroImage = (image: () => z.ZodTypeAny) =>
	z.optional(z.string().startsWith('/').or(z.string().url()).or(image()));

const baseSchema = ({ image }: { image: () => z.ZodTypeAny }) =>
	z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date().optional(),
		updatedDate: z.coerce.date().optional(),
		heroImage: heroImage(image),
	});

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		baseSchema({ image }).extend({
			pubDate: z.coerce.date(),
		}),
});

const tools = defineCollection({
	loader: glob({ base: './src/content/tools', pattern: '**/*.{md,mdx}' }),
	schema: baseSchema,
});

const stotras = defineCollection({
	loader: glob({ base: './src/content/stotras', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		baseSchema({ image }).extend({
			pubDate: z.coerce.date(),
		}),
});

const shayari = defineCollection({
	loader: glob({ base: './src/content/shayari', pattern: '**/*.{md,mdx}' }),
	schema: baseSchema,
});

const quotes = defineCollection({
	loader: glob({ base: './src/content/quotes', pattern: '**/*.{md,mdx}' }),
	schema: baseSchema,
});

const prompts = defineCollection({
	loader: glob({ base: './src/content/prompts', pattern: '**/*.{md,mdx}' }),
	schema: baseSchema,
});

export const collections = { blog, tools, stotras, shayari, quotes, prompts };
