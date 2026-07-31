import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { PostMeta } from "@/lib/content";

export async function ArticleGrid({ posts }: { posts: PostMeta[] }) {
  const t = await getTranslations("index");

  if (posts.length === 0) {
    return <p className="text-ink-faint mt-16">{t("empty")}</p>;
  }

  return (
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
  );
}
