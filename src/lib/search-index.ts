import type { Locale } from "@/i18n/routing";
import { getAllPosts, getPost } from "./content";

export interface SearchDocument {
  id: string;
  slug: string;
  title: string;
  description: string;
  tags: string[];
  date: string;
  /** Prose only — see stripMdx. */
  body: string;
}

/**
 * Reduces an article to the words a reader would search for.
 *
 * Code blocks go: a search for "assert" should not match every listing in
 * every article, and indexing them roughly doubles the payload for results
 * nobody wants. Inline code stays — `is_zero` in a sentence is exactly the
 * kind of term worth finding.
 */
function stripMdx(source: string): string {
  return source
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/\$\$[\s\S]*?\$\$/g, " ")
    .replace(/\$[^$\n]+\$/g, " ")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, " ")
    .replace(/<\/?[A-Z][\w.]*(\s[^>]*)?\/?>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_~`>|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function buildSearchIndex(
  locale: Locale,
): Promise<SearchDocument[]> {
  const posts = await getAllPosts(locale);

  return Promise.all(
    posts.map(async (meta) => {
      const post = await getPost(meta.slug, locale);
      return {
        id: `${locale}:${meta.slug}`,
        slug: meta.slug,
        title: meta.title,
        description: meta.description,
        tags: meta.tags,
        date: meta.date.toISOString().slice(0, 10),
        body: post ? stripMdx(post.body) : "",
      };
    }),
  );
}
