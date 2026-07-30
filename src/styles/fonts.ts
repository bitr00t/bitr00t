import localFont from "next/font/local";

/**
 * Self-hosted rather than pulled from Google at build time. Three reasons:
 * the Docker build stays offline and reproducible, CI cannot break because a
 * font CDN is unreachable, and no request ever leaves for a third party — which
 * removes the fonts from the cookie-consent conversation entirely.
 *
 * Files are the latin subsets from @fontsource, vendored into src/fonts.
 */

export const serif = localFont({
  variable: "--font-plex-serif",
  display: "swap",
  src: [
    {
      path: "../fonts/ibm-plex-serif-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/ibm-plex-serif-latin-400-italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../fonts/ibm-plex-serif-latin-500-normal.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/ibm-plex-serif-latin-500-italic.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "../fonts/ibm-plex-serif-latin-600-normal.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../fonts/ibm-plex-serif-latin-600-italic.woff2",
      weight: "600",
      style: "italic",
    },
  ],
});

export const mono = localFont({
  variable: "--font-plex-mono",
  display: "swap",
  src: [
    {
      path: "../fonts/ibm-plex-mono-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    // A real italic, not a slanted upright — which is why the comments in a
    // listing can be set in italic without looking sheared.
    {
      path: "../fonts/ibm-plex-mono-latin-400-italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../fonts/ibm-plex-mono-latin-500-normal.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/ibm-plex-mono-latin-500-italic.woff2",
      weight: "500",
      style: "italic",
    },
  ],
});
