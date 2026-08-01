import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getAllSlugs, getPost } from "@/lib/content";
import { colours, contentType, fonts, size } from "@/lib/og";

export const alt = "Article preview";
export { contentType, size };

export function generateStaticParams() {
  return getAllSlugs();
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = await getPost(slug, locale);
  const t = await getTranslations({ locale, namespace: "post" });

  // Long titles need to shrink rather than overflow: Satori will happily draw
  // past the edge of the canvas.
  const title = post?.title ?? "bitr00t";
  const titleSize = title.length > 90 ? 52 : title.length > 55 ? 62 : 74;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: colours.paper,
        padding: 80,
      }}
    >
      <div
        style={{
          display: "flex",
          fontFamily: "Plex Mono",
          fontWeight: 500,
          fontSize: 30,
        }}
      >
        <span style={{ color: colours.ink }}>bitr</span>
        <span style={{ color: colours.accent }}>00</span>
        <span style={{ color: colours.ink }}>t</span>
      </div>

      <div
        style={{
          display: "flex",
          fontFamily: "Plex Serif",
          fontWeight: 600,
          fontSize: titleSize,
          lineHeight: 1.15,
          color: colours.ink,
          maxWidth: 1000,
        }}
      >
        {title}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          borderTop: `2px solid ${colours.rule}`,
          paddingTop: 26,
          fontFamily: "Plex Mono",
          fontSize: 24,
          color: colours.inkFaint,
        }}
      >
        {post ? (
          <>
            <span>{post.date.toISOString().slice(0, 10)}</span>
            <span>·</span>
            <span>{t("readingTime", { minutes: post.minutes })}</span>
            {post.tags.length > 0 && (
              <>
                <span>·</span>
                <span style={{ color: colours.accent }}>
                  {post.tags.join("  ")}
                </span>
              </>
            )}
          </>
        ) : null}
      </div>
    </div>,
    { ...size, fonts },
  );
}
