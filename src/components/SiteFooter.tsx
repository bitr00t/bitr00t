import { getTranslations } from "next-intl/server";

export async function SiteFooter() {
  const t = await getTranslations("footer");

  return (
    <footer className="border-rule text-ink-faint mx-auto mt-24 max-w-5xl border-t px-6 py-8 font-mono text-xs">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span>{t("colophon")}</span>
        <a
          href="https://github.com/bitr00t"
          className="hover:text-ink transition-colors"
          rel="noopener noreferrer"
        >
          github.com/bitr00t
        </a>
      </div>
    </footer>
  );
}