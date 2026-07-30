import { getTranslations, setRequestLocale } from "next-intl/server";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { getAllPosts } from "@/lib/content";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [t, posts] = await Promise.all([
    getTranslations("site"),
    getAllPosts(locale),
  ]);

  return (
    <>
      <SiteHeader switchHref="/" />

      <main className="mx-auto max-w-5xl px-6 py-20">
        <h1 className="font-mono text-4xl tracking-tight sm:text-5xl">
          bitr<span className="text-accent">00</span>t
        </h1>
        <p className="text-ink-muted mt-5 max-w-xl text-lg leading-relaxed">
          {t("tagline")}
        </p>

        <ul className="border-rule mt-16 border-t">
          {posts.slice(0, 5).map((post) => (
            <li key={post.slug} className="border-rule border-b">
              <Link
                href={`/writing/${post.slug}`}
                className="group flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:gap-6"
              >
                <time
                  dateTime={post.date.toISOString()}
                  className="text-ink-faint shrink-0 font-mono text-xs sm:w-24"
                >
                  {post.date.toISOString().slice(0, 10)}
                </time>
                <span className="group-hover:text-accent transition-colors">
                  {post.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </main>

      <SiteFooter />
    </>
  );
}
