import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { TagGroup } from "@/lib/tags";

/**
 * Topic filters rather than media-type filters: the point of the row is to
 * show range at a glance. Real links, not client-side state — so a topic can
 * be shared, bookmarked and crawled.
 */
export async function TagFilter({
  groups,
  active,
}: {
  groups: TagGroup[];
  active?: string;
}) {
  const t = await getTranslations("index");
  if (groups.length === 0) return null;

  const base = "font-mono text-xs transition-colors hover:text-ink";

  return (
    <nav
      aria-label={t("title")}
      className="mt-10 flex flex-wrap gap-x-4 gap-y-2"
    >
      <Link
        href="/writing"
        aria-current={active ? undefined : "page"}
        className={`${base} ${active ? "text-ink-muted" : "text-ink"}`}
      >
        {t("allTags")}
      </Link>

      {groups.map((group) => (
        <Link
          key={group.slug}
          href={`/writing/tag/${group.slug}`}
          aria-current={active === group.slug ? "page" : undefined}
          className={`${base} ${active === group.slug ? "text-ink" : "text-ink-muted"}`}
        >
          {group.tag}
          <span className="text-ink-faint ml-1">{group.posts.length}</span>
        </Link>
      ))}
    </nav>
  );
}
