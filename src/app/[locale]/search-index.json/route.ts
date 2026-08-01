import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { buildSearchIndex } from "@/lib/search-index";

export const dynamic = "force-static";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/**
 * The index is a separate static file rather than part of the page payload:
 * it is fetched only when someone actually opens the search, and it caches
 * independently of the pages it describes.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    return new Response("Not found", { status: 404 });
  }

  const documents = await buildSearchIndex(locale);

  return Response.json(documents, {
    headers: { "Cache-Control": "public, max-age=0, must-revalidate" },
  });
}
