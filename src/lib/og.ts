import fs from "node:fs";
import path from "node:path";
import { light } from "@/styles/palette";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Satori cannot read WOFF2 — the format the site itself uses — so the preview
 * images are drawn with the plain WOFF cuts of the same faces.
 */
const dir = path.join(process.cwd(), "src", "fonts", "og");
const read = (file: string) => fs.readFileSync(path.join(dir, file));

export const fonts = [
  {
    name: "Plex Serif",
    data: read("ibm-plex-serif-latin-600-normal.woff"),
    weight: 600 as const,
    style: "normal" as const,
  },
  {
    name: "Plex Mono",
    data: read("ibm-plex-mono-latin-400-normal.woff"),
    weight: 400 as const,
    style: "normal" as const,
  },
  {
    name: "Plex Mono",
    data: read("ibm-plex-mono-latin-500-normal.woff"),
    weight: 500 as const,
    style: "normal" as const,
  },
];

/**
 * The card is always light. A preview is pasted into someone else's timeline,
 * where the surrounding theme is unknown and usually not ours — a light card
 * reads on every background, a dark one disappears into half of them.
 */
export const colours = light;
