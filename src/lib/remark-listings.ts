import { visit } from "unist-util-visit";
import type { Root } from "mdast";

/**
 * Numbers <Listing> elements in document order and resolves <Ref to="..." />
 * to the number of the listing it points at — LaTeX's \label / \ref, on a blog.
 *
 * Runs on the mdast, where MDX JSX is still `mdxJsxFlowElement`, so listings
 * can be reordered in the source without renumbering anything by hand.
 */

interface JsxAttribute {
  type: string;
  name?: string;
  value?: unknown;
}

interface JsxNode {
  type: string;
  name?: string | null;
  attributes?: JsxAttribute[];
}

function readAttr(node: JsxNode, name: string): string | undefined {
  const attr = node.attributes?.find(
    (a) => a.type === "mdxJsxAttribute" && a.name === name,
  );
  return typeof attr?.value === "string" ? attr.value : undefined;
}

function writeAttr(node: JsxNode, name: string, value: string): void {
  node.attributes ??= [];
  const existing = node.attributes.find(
    (a) => a.type === "mdxJsxAttribute" && a.name === name,
  );
  if (existing) {
    existing.value = value;
  } else {
    node.attributes.push({ type: "mdxJsxAttribute", name, value });
  }
}

function isJsx(node: unknown, name: string): node is JsxNode {
  const n = node as JsxNode;
  return (
    (n?.type === "mdxJsxFlowElement" || n?.type === "mdxJsxTextElement") &&
    n?.name === name
  );
}

export function remarkListings() {
  return (tree: Root) => {
    const numbers = new Map<string, number>();
    let counter = 0;

    visit(tree, (node) => {
      if (!isJsx(node, "Listing")) return;
      counter += 1;
      writeAttr(node, "number", String(counter));
      const id = readAttr(node, "id");
      if (id) numbers.set(id, counter);
    });

    visit(tree, (node) => {
      if (!isJsx(node, "Ref")) return;
      const target = readAttr(node, "to");
      const number = target ? numbers.get(target) : undefined;
      writeAttr(node, "number", number ? String(number) : "?");
    });
  };
}
