import type { CollectionEntry } from 'astro:content';

type PostEntry = CollectionEntry<'blog'> | CollectionEntry<'stotras'>;

export function postPath(post: PostEntry) {
	return `/${post.id}/`;
}

export function blogPath(post: CollectionEntry<'blog'>) {
	return postPath(post);
}

export function stotraPath(post: CollectionEntry<'stotras'>) {
	return postPath(post);
}

export function postCanonicalURL(post: PostEntry, site: URL | undefined) {
	return new URL(postPath(post), site).toString();
}
