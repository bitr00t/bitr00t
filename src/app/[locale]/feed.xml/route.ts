import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { getAllPosts } from "@/lib/content";
import { absoluteUrl, site } from "@/lib/site";

// Prerendered alongside the pages: the feed is as static as the articles are.
export const dynamic = "force-static";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
};

/**
 * CDATA would be shorter, but it breaks on a literal `]]>` — which is exactly
 * the kind of thing that turns up in an article about parsers.
 */
const xml = (value: string) => value.replace(/[&<>"']/g, (c) => ENTITIES[c]);

export async function GET(
  _request: Request,
  // Route handlers hand over the raw string; Next will not accept a narrowed
  // param type here, so the narrowing happens below instead.
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale: raw } = await params;
  if (!hasLocale(routing.locales, raw)) {
    return new Response("Not found", { status: 404 });
  }
  const locale = raw;

  const [t, posts] = await Promise.all([
    getTranslations({ locale, namespace: "site" }),
    getAllPosts(locale),
  ]);

  const self = absoluteUrl(`/${locale}/feed.xml`);
  const home = absoluteUrl(`/${locale}`);

  // Derived from the newest article rather than from the clock, so rebuilding
  // without publishing anything does not churn every subscriber's reader.
  // Omitted entirely while a locale has nothing published — a feed dated 1970
  // is worse than a feed with no date.
  const lastBuildDate = posts[0]
    ? `\n    <lastBuildDate>${posts[0].date.toUTCString()}</lastBuildDate>`
    : "";

  const items = posts
    .map((post) => {
      const url = absoluteUrl(`/${locale}/writing/${post.slug}`);
      return `    <item>
      <title>${xml(post.title)}</title>
      <link>${xml(url)}</link>
      <guid isPermaLink="true">${xml(url)}</guid>
      <pubDate>${post.date.toUTCString()}</pubDate>
      <description>${xml(post.description)}</description>
${post.tags.map((tag) => `      <category>${xml(tag)}</category>`).join("\n")}
    </item>`;
    })
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xml(site.name)}</title>
    <link>${xml(home)}</link>
    <description>${xml(t("tagline"))}</description>
    <language>${xml(locale)}</language>${lastBuildDate}
    <atom:link href="${xml(self)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
