import type { CollectionEntry } from 'astro:content';

export type StotraLanguage = {
	label: string;
	slug: string;
	scheme: string;
	locale: string;
};

export const stotraLanguages = [
	{ label: 'English', slug: 'english', scheme: 'iast', locale: 'en-IN' },
	{ label: 'Devanagari', slug: 'devanagari', scheme: 'devanagari', locale: 'sa-IN' },
	{ label: 'Telugu', slug: 'telugu', scheme: 'telugu', locale: 'te-IN' },
	{ label: 'Tamil', slug: 'tamil', scheme: 'tamil', locale: 'ta-IN' },
	{ label: 'Kannada', slug: 'kannada', scheme: 'kannada', locale: 'kn-IN' },
	{ label: 'Malayalam', slug: 'malayalam', scheme: 'malayalam', locale: 'ml-IN' },
	{ label: 'Gujarati', slug: 'gujarati', scheme: 'gujarati', locale: 'gu-IN' },
	{ label: 'Odia', slug: 'odia', scheme: 'oriya', locale: 'or-IN' },
	{ label: 'Bengali', slug: 'bengali', scheme: 'bengali', locale: 'bn-IN' },
	{ label: 'Marathi', slug: 'marathi', scheme: 'devanagari', locale: 'mr-IN' },
	{ label: 'Assamese', slug: 'assamese', scheme: 'assamese', locale: 'as-IN' },
	{ label: 'Punjabi', slug: 'punjabi', scheme: 'gurmukhi', locale: 'pa-IN' },
	{ label: 'Hindi', slug: 'hindi', scheme: 'devanagari', locale: 'hi-IN' },
	{ label: 'Samskritam', slug: 'samskritam', scheme: 'devanagari', locale: 'sa-IN' },
	{ label: 'Nepali', slug: 'nepali', scheme: 'devanagari', locale: 'ne-NP' },
	{ label: 'Sinhala', slug: 'sinhala', scheme: 'sinhala', locale: 'si-LK' },
	{ label: 'Grantha', slug: 'grantha', scheme: 'grantha', locale: 'sa-IN' },
] satisfies StotraLanguage[];

const languageSuffixes = stotraLanguages.map((language) => language.slug);

export function stotraBaseSlug(postId: string) {
	const suffixPattern = new RegExp(`-(${languageSuffixes.join('|')})$`);
	return postId.replace(suffixPattern, '');
}

export function stotraLanguagePath(post: CollectionEntry<'stotras'>, language: StotraLanguage) {
	return `/stotras/${language.slug}/${stotraBaseSlug(post.id)}/`;
}

