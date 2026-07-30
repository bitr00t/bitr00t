import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { getAllPosts, getAllTags } from "@/lib/content";

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

  const [t, posts, tags] = await Promise.all([
    getTranslations("index"),
    getAllPosts(locale),
    getAllTags(locale),
  ]);

  return (
    <>
      <SiteHeader switchHref="/writing" />

      <main className="mx-auto max-w-5xl px-6 py-16">
        <h1 className="text-3xl">{t("title")}</h1>
        <p className="text-ink-muted mt-3 max-w-xl leading-relaxed">
          {t("intro")}
        </p>

        {/* Topic filters, not media-type filters: the point is to show range. */}
        <div className="text-ink-muted mt-10 flex flex-wrap gap-x-4 gap-y-2 font-mono text-xs">
          <span className="text-ink">{t("allTags")}</span>
          {tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>

        {posts.length === 0 ? (
          <p className="text-ink-faint mt-16">{t("empty")}</p>
        ) : (
          <ul className="mt-10 grid gap-px sm:grid-cols-2">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/writing/${post.slug}`}
                  className="border-rule hover:border-rule-strong group block h-full border p-6 transition-colors"
                >
                  <div className="text-ink-faint flex items-baseline gap-3 font-mono text-[0.6875rem]">
                    <time dateTime={post.date.toISOString()}>
                      {post.date.toISOString().slice(0, 10)}
                    </time>
                    <span>·</span>
                    <span>{post.minutes} min</span>
                  </div>
                  <h2 className="group-hover:text-accent mt-3 text-lg leading-snug transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-ink-muted mt-2 text-sm leading-relaxed">
                    {post.description}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>

      <SiteFooter />
    </>
  );
}
