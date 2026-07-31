/**
 * Facts about the site that several places need to agree on. Feeds, sitemaps
 * and social previews all require absolute URLs, so the base URL cannot be
 * inferred from the request — it has to be configured.
 */
export const site = {
  name: "bitr00t",
  author: "Bitr00t",
  github: "https://github.com/bitr00t",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;

export function absoluteUrl(path: string): string {
  return new URL(path, site.url).toString();
}

/**
 * Feed autodiscovery, as a `Metadata["alternates"]["types"]` fragment.
 *
 * Next merges metadata per top-level field, so any page that sets `alternates`
 * for canonical or hreflang replaces the layout's block wholesale — and would
 * silently drop the feed link. Both call sites use this.
 */
export function feedAlternates(locale: string) {
  return {
    "application/rss+xml": [
      { url: `/${locale}/feed.xml`, title: `${site.name} (${locale})` },
    ],
  };
}
