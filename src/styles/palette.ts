/**
 * The single place where raw colour values live.
 *
 * Everything here is a PLACEHOLDER: a neutral greyscale plus four muted hues
 * chosen only so that nothing shouts. Swap the values, leave the names alone,
 * and the whole site follows — including the code listings, because the Shiki
 * themes below are generated from this file rather than from a theme package.
 */

export interface Palette {
  paper: string;
  paperRaised: string;
  ink: string;
  inkMuted: string;
  inkFaint: string;
  rule: string;
  ruleStrong: string;
  accent: string;

  synComment: string;
  synKeyword: string;
  synEntity: string;
  synLiteral: string;
  synPunct: string;
  synRemoved: string;
}

export const light: Palette = {
  paper: "#fcfcfb",
  paperRaised: "#f4f3f0",
  ink: "#191918",
  inkMuted: "#5c5c56",
  inkFaint: "#8a8a82",
  rule: "#e2e1dc",
  ruleStrong: "#c9c8c1",
  accent: "#2f5d8a",

  synComment: "#8c8c84",
  synKeyword: "#2f5d8a",
  synEntity: "#2f7a6a",
  synLiteral: "#8a5a24",
  synPunct: "#6a6a63",
  synRemoved: "#a33f3f",
};

export const dark: Palette = {
  paper: "#131313",
  paperRaised: "#1c1c1b",
  ink: "#e9e8e3",
  inkMuted: "#a3a29b",
  inkFaint: "#75746e",
  rule: "#2b2b29",
  ruleStrong: "#3d3d3a",
  accent: "#8ab4dc",

  synComment: "#787770",
  synKeyword: "#8ab4dc",
  synEntity: "#7cc3ae",
  synLiteral: "#d0a26a",
  synPunct: "#96958e",
  synRemoved: "#e08c8c",
};
