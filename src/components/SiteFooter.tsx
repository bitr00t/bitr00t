import { getLocale, getTranslations } from "next-intl/server";
import { site } from "@/lib/site";

export async function SiteFooter() {
  const [t, locale] = await Promise.all([
    getTranslations("footer"),
    getLocale(),
  ]);

  return (
    <footer className="border-rule text-ink-faint mx-auto mt-24 max-w-5xl border-t px-6 py-8 font-mono text-xs">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span>{t("colophon")}</span>
        <div className="flex items-center gap-5">
          <a
            href={`/${locale}/feed.xml`}
            className="hover:text-ink transition-colors"
          >
            RSS
          </a>
          <a
            href={site.github}
            className="hover:text-ink transition-colors"
            rel="noopener noreferrer"
          >
            github.com/bitr00t
          </a>
        </div>
      </div>
    </footer>
  );
}
