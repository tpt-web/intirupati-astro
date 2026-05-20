import type { CollectionEntry } from 'astro:content';
import { blogPath } from './postUrls';

const stopWords = new Set([
	'a', 'an', 'and', 'are', 'at', 'booking', 'by', 'complete', 'cost', 'darshan',
	'details', 'for', 'from', 'guide', 'how', 'in', 'info', 'is', 'of', 'on',
	'online', 'pooja', 'price', 'seva', 'temple', 'the', 'timings', 'tirumala',
	'tirupati', 'to', 'today', 'with',
]);

export function keywords(value: string) {
	return new Set(
		value
			.toLowerCase()
			.replace(/[^a-z0-9\s-]/g, ' ')
			.split(/[\s-]+/)
			.filter((word) => word.length > 2 && !stopWords.has(word)),
	);
}

export function getRelatedBlogLinks(
	post: CollectionEntry<'blog'>,
	allPosts: CollectionEntry<'blog'>[],
	allTools: CollectionEntry<'tools'>[],
) {
	const currentKeywords = keywords(`${post.data.title} ${post.data.description}`);
	const candidates = [
		...allPosts
			.filter((entry) => entry.id !== post.id)
			.map((entry) => ({
				title: entry.data.title,
				description: entry.data.description,
				href: blogPath(entry),
				type: 'Guide',
				date: entry.data.pubDate,
				keywords: keywords(`${entry.data.title} ${entry.data.description}`),
			})),
		...allTools.map((entry) => ({
			title: entry.data.title,
			description: entry.data.description,
			href: `/tools/${entry.id}/`,
			type: 'Tool',
			date: entry.data.pubDate ?? new Date(0),
			keywords: keywords(`${entry.data.title} ${entry.data.description}`),
		})),
	];

	return candidates
		.map((candidate) => ({
			...candidate,
			score: [...candidate.keywords].filter((word) => currentKeywords.has(word)).length,
		}))
		.sort((a, b) => b.score - a.score || b.date.valueOf() - a.date.valueOf())
		.slice(0, 5);
}
