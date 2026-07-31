"use client";

import { useTranslations } from "next-intl";
import { THEME_STORAGE_KEY } from "./ThemeScript";

/**
 * No state and no effect. The server cannot know the reader's preference, so
 * instead of guessing and then correcting — which flickers — both labels are
 * rendered and CSS picks one. The class on <html> is the single source of
 * truth; the inline theme script put it there before hydration.
 */
export function ThemeToggle() {
  const t = useTranslations("nav");

  function toggle() {
    const el = document.documentElement;
    const dark = !el.classList.contains("dark");
    el.classList.toggle("dark", dark);
    el.style.colorScheme = dark ? "dark" : "light";
    try {
      localStorage.setItem(THEME_STORAGE_KEY, dark ? "dark" : "light");
    } catch {
      // Private mode or storage disabled: the choice simply does not persist.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t("toggleTheme")}
      className="text-ink-muted hover:text-ink font-mono text-xs transition-colors"
    >
      <span className="dark:hidden">dark</span>
      <span className="hidden dark:inline">light</span>
    </button>
  );
}
