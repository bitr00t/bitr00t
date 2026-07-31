import GithubSlugger from "github-slugger";
import type { Locale } from "@/i18n/routing";
import { getAllPosts, type PostMeta } from "./content";

/**
 * A fresh slugger per call on purpose: GithubSlugger remembers what it has
 * already produced and would turn the second occurrence of "rust" into
 * "rust-1". Here the same tag must always yield the same slug.
 */
export function tagSlug(tag: string): string {
  return new GithubSlugger().slug(tag);
}

export interface TagGroup {
  /** As written in the frontmatter. */
  tag: string;
  slug: string;
  posts: PostMeta[];
}

export async function getTagGroups(locale: Locale): Promise<TagGroup[]> {
  const posts = await getAllPosts(locale);
  const groups = new Map<string, TagGroup>();

  for (const post of posts) {
    for (const tag of post.tags) {
      const slug = tagSlug(tag);
      const group = groups.get(slug) ?? { tag, slug, posts: [] };
      group.posts.push(post);
      groups.set(slug, group);
    }
  }

  return [...groups.values()].sort((a, b) => a.tag.localeCompare(b.tag));
}

export async function getTagGroup(
  locale: Locale,
  slug: string,
): Promise<TagGroup | null> {
  return (await getTagGroups(locale)).find((g) => g.slug === slug) ?? null;
}
