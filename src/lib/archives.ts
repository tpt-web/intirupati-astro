import type { CollectionEntry } from 'astro:content';

export type ArchiveKind = 'category' | 'tag';

export type ArchiveDefinition = {
	kind: ArchiveKind;
	slug: string;
	title: string;
	description: string;
	terms: string[];
};

export const archiveDefinitions: ArchiveDefinition[] = [
	{
		kind: 'category',
		slug: 'tirumala/sevas',
		title: 'Tirumala Sevas',
		description: 'Guides for Tirumala sevas, timings, booking, reporting rules, and ticket information.',
		terms: ['tirumala', 'seva', 'sevas', 'arjitha', 'kalyanotsavam', 'suprabhatam', 'archana'],
	},
	{
		kind: 'category',
		slug: 'tirupati/accommodations',
		title: 'Tirupati Accommodations',
		description: 'Accommodation guides for Tirupati and Tirumala rooms, guest houses, CRO, cottages, and booking.',
		terms: ['accommodation', 'accommodations', 'room', 'rooms', 'guest', 'house', 'cottage', 'cro'],
	},
	{
		kind: 'category',
		slug: 'tirumala',
		title: 'Tirumala',
		description: 'Tirumala darshan, sevas, rooms, temples, and devotee guide articles.',
		terms: ['tirumala'],
	},
	{
		kind: 'category',
		slug: 'tirupati',
		title: 'Tirupati',
		description: 'Tirupati temple guides, travel information, rooms, darshan updates, and pilgrim resources.',
		terms: ['tirupati'],
	},
	{
		kind: 'tag',
		slug: 'tirumala-darshan-status-today',
		title: 'Tirumala Darshan Status Today',
		description: 'Current Tirumala darshan status, crowd updates, waiting time, and free darshan guide articles.',
		terms: ['tirumala', 'darshan', 'status', 'today', 'crowd', 'waiting', 'free', 'ssd'],
	},
];

export function generatedTagDefinitions(posts: CollectionEntry<'blog'>[]) {
	return posts.map((post) => ({
		kind: 'tag' as const,
		slug: post.id,
		title: post.data.title,
		description: post.data.description,
		terms: post.id.split('-'),
	}));
}

export function archiveMatches(definition: ArchiveDefinition, post: CollectionEntry<'blog'>) {
	const haystack = `${post.id} ${post.data.title} ${post.data.description}`.toLowerCase();
	return definition.terms.some((term) => haystack.includes(term.toLowerCase()));
}

export function archiveTitleFromSlug(slug: string) {
	return slug
		.split('/')
		.at(-1)!
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
}
