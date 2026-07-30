import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

/**
 * Switches to the other language. `href` is passed in by the page, so an
 * article can point at its own translation instead of dumping the reader on
 * the index — and falls back to the index only when no translation exists.
 */
export async function LanguageSwitcher({ href = "/" }: { href?: string }) {
  const current = (await getLocale()) as Locale;
  const other =
    routing.locales.find((l) => l !== current) ?? routing.defaultLocale;
  const t = await getTranslations("nav");

  return (
    <Link
      href={href}
      locale={other}
      hrefLang={other}
      className="hover:text-ink text-ink-muted font-mono text-xs transition-colors"
    >
      {t("switchLanguage")}
    </Link>
  );
}
