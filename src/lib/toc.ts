import GithubSlugger from "github-slugger";

export interface TocEntry {
  depth: 2 | 3;
  text: string;
  id: string;
}

/**
 * Pulls h2/h3 out of the raw source. Fenced code is skipped so that a shell
 * prompt like `## not a heading` inside a listing never reaches the sidebar.
 */
export function extractToc(source: string): TocEntry[] {
  const slugger = new GithubSlugger();
  const entries: TocEntry[] = [];
  let inFence = false;

  for (const line of source.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) continue;

    const text = match[2]
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\*\*?([^*]+)\*\*?/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .trim();

    entries.push({
      depth: match[1].length as 2 | 3,
      text,
      id: slugger.slug(text),
    });
  }

  return entries;
}