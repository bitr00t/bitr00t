import { redirect } from "next/navigation";
import { routing } from "@/i18n/routing";

/**
 * Only reached for paths outside the [locale] tree, which in practice means a
 * missing locale prefix. Sending the reader to the default language beats a
 * dead end.
 */
export default function NotFound() {
  redirect(`/${routing.defaultLocale}`);
}
