import type { compileMDX } from "next-mdx-remote/rsc";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode, {
  type Options as PrettyCodeOptions,
} from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { bitrootDark, bitrootLight } from "@/styles/shiki-theme";
import { remarkListings } from "./remark-listings";

const prettyCode: PrettyCodeOptions = {
  theme: { light: bitrootLight, dark: bitrootDark },
  // The LaTeX look has no box around the code; the surrounding component
  // supplies the rules instead.
  keepBackground: false,
  // Fenced blocks only. Inline code stays with the prose component, where it
  // gets a quiet pill rather than a full syntax theme.
  defaultLang: { block: "text" },
};

export const mdxOptions: NonNullable<
  NonNullable<Parameters<typeof compileMDX>[0]["options"]>["mdxOptions"]
> = {
  remarkPlugins: [remarkGfm, remarkMath, remarkListings],
  rehypePlugins: [rehypeSlug, [rehypePrettyCode, prettyCode], rehypeKatex],
};