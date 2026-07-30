"use client";

import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";

/**
 * No `mounted` state and no effect: the server cannot know the reader's OS
 * preference, so instead of guessing and then correcting (which flickers), both
 * labels are rendered and CSS picks one. The click handler reads the class the
 * theme provider already put on <html>.
 */
export function ThemeToggle() {
  const { setTheme } = useTheme();
  const t = useTranslations("nav");

  return (
    <button
      type="button"
      onClick={() =>
        setTheme(
          document.documentElement.classList.contains("dark")
            ? "light"
            : "dark",
        )
      }
      aria-label={t("toggleTheme")}
      className="text-ink-muted hover:text-ink font-mono text-xs transition-colors"
    >
      <span className="dark:hidden">dark</span>
      <span className="hidden dark:inline">light</span>
    </button>
  );
}
