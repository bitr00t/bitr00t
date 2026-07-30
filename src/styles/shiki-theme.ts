import type { ThemeRegistrationRaw } from "shiki";
import { dark, light, type Palette } from "./palette";

/**
 * A deliberately small theme. LaTeX's `minted` gets by on four colours plus
 * italic comments, and dense technical prose is easier to read when the code
 * beside it is not a fruit salad.
 */
function build(
  name: string,
  type: "light" | "dark",
  p: Palette,
): ThemeRegistrationRaw {
  return {
    name,
    type,
    colors: {
      "editor.background": "#00000000",
      "editor.foreground": p.ink,
    },
    settings: [
      {
        scope: ["comment", "punctuation.definition.comment"],
        settings: { foreground: p.synComment, fontStyle: "italic" },
      },
      {
        scope: [
          "keyword",
          "storage",
          "storage.type",
          "keyword.control",
          "keyword.operator.word",
        ],
        settings: { foreground: p.synKeyword },
      },
      {
        scope: [
          "entity.name.function",
          "support.function",
          "meta.function-call",
        ],
        settings: { foreground: p.synEntity },
      },
      {
        scope: [
          "entity.name.type",
          "support.type",
          "support.class",
          "entity.name.class",
        ],
        settings: { foreground: p.synEntity },
      },
      {
        scope: ["string", "string.quoted", "constant.character"],
        settings: { foreground: p.synLiteral },
      },
      {
        scope: ["constant.numeric", "constant.language", "constant.other"],
        settings: { foreground: p.synLiteral },
      },
      {
        scope: ["punctuation", "meta.brace", "keyword.operator"],
        settings: { foreground: p.synPunct },
      },
      {
        scope: ["variable", "meta.definition.variable"],
        settings: { foreground: p.ink },
      },
      {
        scope: ["invalid", "message.error"],
        settings: { foreground: p.synRemoved },
      },
    ],
  };
}

export const bitrootLight = build("bitroot-light", "light", light);
export const bitrootDark = build("bitroot-dark", "dark", dark);