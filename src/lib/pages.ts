import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import { routing, type Locale } from "@/i18n/routing";

/**
 * Standing pages — imprint, privacy policy — as opposed to articles.
 *
 * These live in the code repository rather than the content one: they are site
 * furniture, they must be deployable without the article checkout, and they
 * change when the site changes rather than when something gets written.
 *
 * Same filename convention as posts, so a slug can read naturally in each
 * language: imprint.en.mdx and impressum.de.mdx are one page under a shared
 * translationKey.
 */
const PAGES_DIR = path.join(process.cwd(), "src", "content", "pages");

const frontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  translationKey: z.string().min(1),
  updated: z.coerce.date(),
});

export interface Page extends z.infer<typeof frontmatterSchema> {
  slug: string;
  locale: Locale;
  body: string;
}

const FILENAME = /^(?<slug>.+)\.(?<locale>[a-z]{2})\.mdx$/;

async function listFiles() {
  const names = await fs.readdir(PAGES_DIR);

  return names.flatMap((file) => {
    const groups = FILENAME.exec(file)?.groups;
    if (!groups) return [];
    const locale = groups.locale as Locale;
    if (!routing.locales.includes(locale)) return [];
    return [{ file, slug: groups.slug, locale }];
  });
}

async function read(file: string, slug: string, locale: Locale): Promise<Page> {
  const raw = await fs.readFile(path.join(PAGES_DIR, file), "utf8");
  const { data, content } = matter(raw);

  const parsed = frontmatterSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(
      `Invalid frontmatter in src/content/pages/${file}:\n${z.prettifyError(parsed.error)}`,
    );
  }

  return { ...parsed.data, slug, locale, body: content };
}

export async function getPage(
  slug: string,
  locale: Locale,
): Promise<Page | null> {
  const match = (await listFiles()).find(
    (f) => f.slug === slug && f.locale === locale,
  );
  return match ? read(match.file, match.slug, match.locale) : null;
}

export async function getAllPageSlugs(): Promise<
  { locale: Locale; page: string }[]
> {
  return (await listFiles()).map(({ slug, locale }) => ({
    locale,
    page: slug,
  }));
}

/** Slug of the same page in another language. */
export async function getPageTranslation(
  translationKey: string,
  locale: Locale,
): Promise<string | null> {
  for (const { file, slug, locale: l } of await listFiles()) {
    if (l !== locale) continue;
    const page = await read(file, slug, l);
    if (page.translationKey === translationKey) return page.slug;
  }
  return null;
}

/** Footer links, resolved per language. */
export async function getLegalLinks(
  locale: Locale,
): Promise<{ slug: string; title: string }[]> {
  const files = (await listFiles()).filter((f) => f.locale === locale);
  const pages = await Promise.all(
    files.map(({ file, slug, locale }) => read(file, slug, locale)),
  );
  return pages
    .sort((a, b) => a.translationKey.localeCompare(b.translationKey))
    .map(({ slug, title }) => ({ slug, title }));
}
