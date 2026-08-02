import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { mdxComponents } from "@/components/mdx";
import { routing, type Locale } from "@/i18n/routing";
import { mdxOptions } from "@/lib/mdx";
import { getAllPageSlugs, getPage, getPageTranslation } from "@/lib/pages";
import { feedAlternates } from "@/lib/site";

export async function generateStaticParams() {
  return getAllPageSlugs();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; page: string }>;
}): Promise<Metadata> {
  const { locale, page: slug } = await params;
  const page = await getPage(slug, locale);
  if (!page) return {};

  const languages: Record<string, string> = { [locale]: `/${locale}/${slug}` };
  for (const other of routing.locales.filter((l) => l !== locale)) {
    const translated = await getPageTranslation(page.translationKey, other);
    if (translated) languages[other] = `/${other}/${translated}`;
  }

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: `/${locale}/${slug}`,
      languages,
      types: feedAlternates(locale),
    },
  };
}

export default async function StandingPage({
  params,
}: {
  params: Promise<{ locale: Locale; page: string }>;
}) {
  const { locale, page: slug } = await params;
  setRequestLocale(locale);

  const page = await getPage(slug, locale);
  if (!page) notFound();

  const t = await getTranslations("page");

  const other =
    routing.locales.find((l) => l !== locale) ?? routing.defaultLocale;
  const translatedSlug = await getPageTranslation(page.translationKey, other);

  const { content } = await compileMDX({
    source: page.body,
    components: mdxComponents,
    options: { mdxOptions },
  });

  return (
    <>
      <SiteHeader switchHref={translatedSlug ? `/${translatedSlug}` : "/"} />

      <main className="mx-auto max-w-5xl px-6 py-16">
        <article className="max-w-[68ch]">
          <h1 className="text-3xl leading-tight">{page.title}</h1>
          <p className="text-ink-faint mt-3 font-mono text-xs">
            {t("updated", { date: page.updated.toISOString().slice(0, 10) })}
          </p>
          <div className="mt-10 text-[1.0625rem]">{content}</div>
        </article>
      </main>

      <SiteFooter />
    </>
  );
}
