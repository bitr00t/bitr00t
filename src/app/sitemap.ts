import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getAllPosts, getTranslation } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

/**
 * One sitemap at the root covering both languages.
 *
 * Every entry carries the full set of `alternates`, including a link back to
 * itself — that is what the hreflang specification requires, and it is the
 * reason the two language versions are read as one document in two languages
 * rather than as two documents competing for the same query.
 *
 * `changeFrequency` and `priority` are deliberately absent: Google ignores
 * both, and a number nobody reads is a number that will eventually be wrong.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const byLocale = await Promise.all(
    routing.locales.map(async (locale) => ({
      locale,
      posts: await getAllPosts(locale),
    })),
  );

  // Languages with nothing published are left out entirely. The pages still
  // exist and stay reachable through the switcher, but submitting an empty
  // index for indexing — and advertising an hreflang alternate that leads to
  // it — is worse than waiting until there is something to find. Publishing
  // the first article in a language brings it back automatically.
  const active = byLocale.filter(({ posts }) => posts.length > 0);
  const fallbackLocale =
    active.find((l) => l.locale === routing.defaultLocale)?.locale ??
    active[0]?.locale;

  const entries: MetadataRoute.Sitemap = [];

  for (const path of ["", "/writing"]) {
    const languages = Object.fromEntries(
      active.map(({ locale }) => [locale, absoluteUrl(`/${locale}${path}`)]),
    );
    if (fallbackLocale) {
      languages["x-default"] = absoluteUrl(`/${fallbackLocale}${path}`);
    }

    for (const { locale, posts } of active) {
      entries.push({
        url: absoluteUrl(`/${locale}${path}`),
        // The newest article, not the build clock: an index page has not
        // changed just because the site was rebuilt.
        lastModified: posts[0]?.date,
        alternates: { languages },
      });
    }
  }

  for (const { locale, posts } of active) {
    for (const post of posts) {
      const languages: Record<string, string> = {
        [locale]: absoluteUrl(`/${locale}/writing/${post.slug}`),
      };

      for (const other of routing.locales.filter((l) => l !== locale)) {
        const translated = await getTranslation(post.translationKey, other);
        if (translated) {
          languages[other] = absoluteUrl(`/${other}/writing/${translated}`);
        }
      }

      // Only meaningful once the default language actually has this piece.
      const fallback = languages[routing.defaultLocale];
      if (fallback) languages["x-default"] = fallback;

      entries.push({
        url: absoluteUrl(`/${locale}/writing/${post.slug}`),
        lastModified: post.date,
        alternates: { languages },
      });
    }
  }

  return entries;
}
