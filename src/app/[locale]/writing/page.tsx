import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArticleGrid } from "@/components/ArticleGrid";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { TagFilter } from "@/components/TagFilter";
import { routing, type Locale } from "@/i18n/routing";
import { getAllPosts } from "@/lib/content";
import { getTagGroups } from "@/lib/tags";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "index" });
  return { title: t("title"), description: t("intro") };
}

export default async function WritingIndex({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [t, posts, groups] = await Promise.all([
    getTranslations("index"),
    getAllPosts(locale),
    getTagGroups(locale),
  ]);

  return (
    <>
      <SiteHeader switchHref="/writing" />

      <main className="mx-auto max-w-5xl px-6 py-16">
        <h1 className="text-3xl">{t("title")}</h1>
        <p className="text-ink-muted mt-3 max-w-xl leading-relaxed">
          {t("intro")}
        </p>

        <TagFilter groups={groups} />
        <ArticleGrid posts={posts} />
      </main>

      <SiteFooter />
    </>
  );
}
