import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArticleGrid } from "@/components/ArticleGrid";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { TagFilter } from "@/components/TagFilter";
import { routing, type Locale } from "@/i18n/routing";
import { getTagGroup, getTagGroups } from "@/lib/tags";

export async function generateStaticParams() {
  const params: { locale: Locale; tag: string }[] = [];

  for (const locale of routing.locales) {
    for (const group of await getTagGroups(locale)) {
      params.push({ locale, tag: group.slug });
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; tag: string }>;
}): Promise<Metadata> {
  const { locale, tag } = await params;
  const group = await getTagGroup(locale, tag);
  if (!group) return {};

  const t = await getTranslations({ locale, namespace: "index" });

  return {
    title: t("taggedTitle", { tag: group.tag }),
    description: t("taggedIntro", {
      count: group.posts.length,
      tag: group.tag,
    }),
    // Tag pages are for readers, not for search: they restate the index with
    // fewer entries. They are deliberately absent from the sitemap for the
    // same reason.
    robots: { index: false, follow: true },
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ locale: Locale; tag: string }>;
}) {
  const { locale, tag } = await params;
  setRequestLocale(locale);

  const [group, groups, t] = await Promise.all([
    getTagGroup(locale, tag),
    getTagGroups(locale),
    getTranslations("index"),
  ]);

  if (!group) notFound();

  return (
    <>
      {/* A tag slug is derived from the article's own words, so the same topic
          may not exist in the other language. Falling back to the index is the
          honest behaviour. */}
      <SiteHeader switchHref="/writing" />

      <main className="mx-auto max-w-5xl px-6 py-16">
        <h1 className="text-3xl">{t("taggedTitle", { tag: group.tag })}</h1>
        <p className="text-ink-muted mt-3 leading-relaxed">
          {t("taggedIntro", { count: group.posts.length, tag: group.tag })}
        </p>

        <TagFilter groups={groups} active={group.slug} />
        <ArticleGrid posts={group.posts} />
      </main>

      <SiteFooter />
    </>
  );
}
