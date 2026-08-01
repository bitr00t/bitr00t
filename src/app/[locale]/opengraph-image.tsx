import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { colours, contentType, fonts, size } from "@/lib/og";
import { site } from "@/lib/site";

export const alt = site.name;
export { contentType, size };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "site" });

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        background: colours.paper,
        padding: 96,
      }}
    >
      <div
        style={{
          display: "flex",
          fontFamily: "Plex Mono",
          fontWeight: 500,
          fontSize: 64,
        }}
      >
        <span style={{ color: colours.ink }}>bitr</span>
        <span style={{ color: colours.accent }}>00</span>
        <span style={{ color: colours.ink }}>t</span>
      </div>
      <div
        style={{
          marginTop: 28,
          fontFamily: "Plex Serif",
          fontSize: 38,
          color: colours.inkMuted,
          maxWidth: 820,
          lineHeight: 1.35,
        }}
      >
        {t("tagline")}
      </div>
    </div>,
    { ...size, fonts },
  );
}
