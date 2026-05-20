import type { CollectionEntry } from 'astro:content';

type PostEntry = CollectionEntry<'blog'> | CollectionEntry<'stotras'>;

export function blogPath(post: CollectionEntry<'blog'>) {
	return `/${post.id}/`;
}

export function stotraPath(post: CollectionEntry<'stotras'>) {
	return `/stotras/${post.id}/`;
}

export function postCanonicalURL(post: PostEntry, site: URL | undefined) {
	if (post.collection === 'stotras') {
		return new URL(stotraPath(post), site).toString();
	}

	return new URL(blogPath(post), site).toString();
}
