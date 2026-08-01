import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Search } from "./Search";
import { ThemeToggle } from "./ThemeToggle";

export async function SiteHeader({ switchHref }: { switchHref?: string }) {
  const t = await getTranslations("nav");

  return (
    <header className="border-rule mx-auto flex max-w-5xl items-baseline justify-between border-b px-6 py-6">
      <Link href="/" className="font-mono text-base tracking-tight">
        bitr<span className="text-accent">00</span>t
      </Link>

      <nav className="flex items-baseline gap-6">
        <Link
          href="/writing"
          className="hover:text-ink text-ink-muted font-mono text-xs transition-colors"
        >
          {t("writing")}
        </Link>
        <Search />
        <LanguageSwitcher href={switchHref} />
        <ThemeToggle />
      </nav>
    </header>
  );
}
