import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { TableOfContents } from "@/components/TableOfContents";
import { mdxComponents } from "@/components/mdx";
import { routing, type Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { getAllSlugs, getPost, getTranslation } from "@/lib/content";
import { mdxOptions } from "@/lib/mdx";
import { feedAlternates } from "@/lib/site";

export async function generateStaticParams() {
  return getAllSlugs();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPost(slug, locale);
  if (!post) return {};

  // hreflang: without it the two language versions compete with each other
  // in search results instead of pointing at one another.
  const languages: Record<string, string> = {
    [locale]: `/${locale}/writing/${slug}`,
  };
  for (const other of routing.locales.filter((l) => l !== locale)) {
    const translated = await getTranslation(post.translationKey, other);
    if (translated) languages[other] = `/${other}/writing/${translated}`;
  }

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `/${locale}/writing/${slug}`,
      languages,
      types: feedAlternates(locale),
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date.toISOString(),
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = await getPost(slug, locale);
  if (!post) notFound();

  const t = await getTranslations("post");

  const other =
    routing.locales.find((l) => l !== locale) ?? routing.defaultLocale;
  const translatedSlug = await getTranslation(post.translationKey, other);

  const { content } = await compileMDX({
    source: post.body,
    components: mdxComponents,
    options: { mdxOptions },
  });

  return (
    <>
      {/* Stay on the same article when switching language; fall back to the
          index only when this piece has no translation. */}
      <SiteHeader
        switchHref={translatedSlug ? `/writing/${translatedSlug}` : "/writing"}
      />

      <main className="mx-auto max-w-5xl px-6 py-16">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_14rem] lg:gap-12">
          <article className="min-w-0">
            <header className="border-rule mb-12 border-b pb-8">
              <div className="text-ink-faint flex flex-wrap items-baseline gap-3 font-mono text-xs">
                <time dateTime={post.date.toISOString()}>
                  {post.date.toISOString().slice(0, 10)}
                </time>
                <span>·</span>
                <span>{t("readingTime", { minutes: post.minutes })}</span>
                {post.tags.length > 0 && (
                  <>
                    <span>·</span>
                    <span>{post.tags.join(", ")}</span>
                  </>
                )}
              </div>

              <h1 className="mt-4 text-3xl leading-tight sm:text-4xl">
                {post.title}
              </h1>
              <p className="text-ink-muted mt-4 text-lg leading-relaxed">
                {post.description}
              </p>

              {!translatedSlug && (
                <p className="text-ink-faint border-rule mt-6 border-l-2 pl-4 text-sm">
                  {t("notTranslated")}
                </p>
              )}
            </header>

            <div className="max-w-[68ch] text-[1.0625rem]">{content}</div>

            <Link
              href="/writing"
              className="text-ink-muted hover:text-ink border-rule mt-16 block border-t pt-8 font-mono text-xs transition-colors"
            >
              ← {t("back")}
            </Link>
          </article>

          <aside>
            <TableOfContents entries={post.toc} />
          </aside>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
