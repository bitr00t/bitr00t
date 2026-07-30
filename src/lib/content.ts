import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { z } from "zod";
import { routing, type Locale } from "@/i18n/routing";
import { extractToc, type TocEntry } from "./toc";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

/**
 * Files are named `<slug>.<locale>.mdx`. Translations of one article share a
 * `translationKey`, which is what the language switcher follows — the slug is
 * free to differ per language, because a German URL should read as German.
 */
const frontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.coerce.date(),
  tags: z.array(z.string()).default([]),
  translationKey: z.string().min(1),
  draft: z.boolean().default(false),
});

export type Frontmatter = z.infer<typeof frontmatterSchema>;

export interface PostMeta extends Frontmatter {
  slug: string;
  locale: Locale;
  minutes: number;
}

export interface Post extends PostMeta {
  body: string;
  toc: TocEntry[];
}

const FILENAME = /^(?<slug>.+)\.(?<locale>[a-z]{2})\.mdx$/;

async function listFiles(): Promise<
  { file: string; slug: string; locale: Locale }[]
> {
  let names: string[];
  try {
    names = await fs.readdir(POSTS_DIR);
  } catch {
    return [];
  }

  return names.flatMap((file) => {
    const groups = FILENAME.exec(file)?.groups;
    if (!groups) return [];
    const locale = groups.locale as Locale;
    if (!routing.locales.includes(locale)) return [];
    return [{ file, slug: groups.slug, locale }];
  });
}

async function read(file: string, slug: string, locale: Locale): Promise<Post> {
  const raw = await fs.readFile(path.join(POSTS_DIR, file), "utf8");
  const { data, content } = matter(raw);

  const parsed = frontmatterSchema.safeParse(data);
  if (!parsed.success) {
    // Failing the build beats shipping an article with a silently missing date.
    throw new Error(
      `Invalid frontmatter in content/posts/${file}:\n${z.prettifyError(parsed.error)}`,
    );
  }

  return {
    ...parsed.data,
    slug,
    locale,
    body: content,
    minutes: Math.max(1, Math.round(readingTime(content).minutes)),
    toc: extractToc(content),
  };
}

/** Strips the heavy fields so index pages never ship article bodies. */
function toMeta(post: Post): PostMeta {
  const {
    title,
    description,
    date,
    tags,
    translationKey,
    draft,
    slug,
    locale,
    minutes,
  } = post;
  return {
    title,
    description,
    date,
    tags,
    translationKey,
    draft,
    slug,
    locale,
    minutes,
  };
}

const isPublished = (post: PostMeta) =>
  !post.draft || process.env.NODE_ENV === "development";

export async function getAllPosts(locale: Locale): Promise<PostMeta[]> {
  const files = (await listFiles()).filter((f) => f.locale === locale);
  const posts = await Promise.all(
    files.map(({ file, slug, locale }) => read(file, slug, locale)),
  );

  return posts
    .filter(isPublished)
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .map((post) => toMeta(post));
}

export async function getPost(
  slug: string,
  locale: Locale,
): Promise<Post | null> {
  const match = (await listFiles()).find(
    (f) => f.slug === slug && f.locale === locale,
  );
  if (!match) return null;

  const post = await read(match.file, match.slug, match.locale);
  return isPublished(post) ? post : null;
}

/** Slug of the same article in another language, or null if untranslated. */
export async function getTranslation(
  translationKey: string,
  locale: Locale,
): Promise<string | null> {
  const files = (await listFiles()).filter((f) => f.locale === locale);
  for (const { file, slug, locale } of files) {
    const post = await read(file, slug, locale);
    if (post.translationKey === translationKey && isPublished(post)) {
      return post.slug;
    }
  }
  return null;
}

export async function getAllSlugs(): Promise<
  { locale: Locale; slug: string }[]
> {
  const files = await listFiles();
  const posts = await Promise.all(
    files.map(({ file, slug, locale }) => read(file, slug, locale)),
  );
  return posts
    .filter(isPublished)
    .map(({ slug, locale }) => ({ slug, locale }));
}

export async function getAllTags(locale: Locale): Promise<string[]> {
  const posts = await getAllPosts(locale);
  return [...new Set(posts.flatMap((p) => p.tags))].sort();
}