# bitr00t

Personal technical writing. Long-form accounts of things I built, in English and
German, with the code set the way a paper sets it.

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind 4 · MDX · next-intl

## Running it

```bash
yarn install
yarn dev        # http://localhost:3000 → redirects to /en
yarn build      # static export of every article, both languages
yarn lint
```

Node 20+. No database, no external services: articles are files in `content/`,
fonts are vendored, and the whole site prerenders.

## How it is put together

```
content/posts/<slug>.<locale>.mdx   articles — the source of truth
messages/<locale>.json              interface strings
src/
  app/[locale]/                     routes; every page is statically generated
  components/mdx/                   Listing, Ref, Terminal + prose elements
  i18n/                             routing, navigation, request config
  lib/
    content.ts                      frontmatter parsing (zod), post queries
    mdx.ts                          the MDX pipeline in one place
    remark-listings.ts              numbers listings, resolves cross-references
    toc.ts                          table of contents from the source
  styles/
    palette.ts                      every raw colour value
    shiki-theme.ts                  code themes, generated from palette.ts
    fonts.ts                        self-hosted IBM Plex
```

## Writing an article

Create `content/posts/my-piece.en.mdx`:

```mdx
---
title: "A title"
description: "One sentence. Used on cards, in search results and in previews."
date: 2026-08-01
tags: ["compilers", "rust"]
translationKey: my-piece
draft: true
---
```

`translationKey` is what links language versions together. The slugs may differ —
a German URL should read as German — and the language switcher follows the key,
falling back to the index only when no translation exists. `draft: true` hides a
piece in production while leaving it visible in `yarn dev`.

Frontmatter is validated at build time. A missing date fails the build rather
than shipping an article dated `Invalid Date`.

### Listings, output, and maths

Source listings are numbered and captioned; program output is not, because
"Listing 4: error message" would misdescribe what the reader is looking at.

````mdx
<Listing id="iszero" caption="is_zero, with both assertions in place">

```rust
gadget is_zero(x: field) -> (out: field) { … }
```
````

</Listing>

As <Ref to="iszero" /> shows, …

<Terminal>

```console
$ zkc build root.zkc
error: 'root' is under-constrained
```

</Terminal>
```

Numbering happens at build time in document order, so listings can be moved
without renumbering anything. `<Ref>` resolves to whatever number its target
ended up with.

Maths is KaTeX: `$p = 2^{64} - 2^{32} + 1$` inline, `$$ … $$` for display.

### Languages

`.zkc` has no Shiki grammar, so those blocks are tagged `rust` — the syntax is
close enough that it highlights correctly. A proper TextMate grammar is a later
job.

## Colour

Every raw value lives in two places, and only two: `src/styles/palette.ts`
(which also generates the code themes) and the token block at the top of
`src/app/globals.css`. Both are currently a neutral greyscale plus four muted
hues — placeholders chosen so that nothing shouts. Changing the palette means
editing those values; nothing else refers to a colour directly.

The code themes are deliberately small. LaTeX's `minted` gets by on four colours
plus italic comments, and dense prose is easier to read when the code beside it
is not a fruit salad.

## Not here yet

RSS, sitemap, OG images, search (Pagefind), comments (Giscus), the legal pages,
CI/CD and the container build. Each is a separate step; none of them changes
anything above.
