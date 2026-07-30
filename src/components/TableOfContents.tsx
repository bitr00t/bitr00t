import { getTranslations } from "next-intl/server";
import type { TocEntry } from "@/lib/toc";

export async function TableOfContents({ entries }: { entries: TocEntry[] }) {
  const t = await getTranslations("post");
  if (entries.length < 3) return null;

  return (
    <nav
      aria-labelledby="toc-heading"
      className="sticky top-8 hidden max-h-[80vh] overflow-y-auto lg:block"
    >
      <h2
        id="toc-heading"
        className="text-ink-faint mb-3 font-mono text-[0.6875rem] tracking-wide"
      >
        {t("contents")}
      </h2>
      <ul className="space-y-1.5 text-sm">
        {entries.map((entry) => (
          <li key={entry.id} className={entry.depth === 3 ? "pl-4" : undefined}>
            <a
              href={`#${entry.id}`}
              className="hover:text-ink text-ink-muted block leading-snug transition-colors"
            >
              {entry.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
