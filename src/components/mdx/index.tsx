import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import { Listing } from "./Listing";
import { Ref } from "./Ref";
import { Terminal } from "./Terminal";

function Anchored({
  as: Tag,
  id,
  children,
  className,
}: {
  as: "h2" | "h3" | "h4";
  id?: string;
  children?: React.ReactNode;
  className: string;
}) {
  return (
    <Tag id={id} className={`group scroll-mt-24 ${className}`}>
      {id ? (
        <a
          href={`#${id}`}
          className="text-ink-faint absolute -ml-5 hidden opacity-0 transition-opacity group-hover:opacity-100 md:inline"
          aria-hidden="true"
          tabIndex={-1}
        >
          #
        </a>
      ) : null}
      {children}
    </Tag>
  );
}

export const mdxComponents: MDXComponents = {
  Listing,
  Ref,
  Terminal,

  h2: (props) => (
    <Anchored as="h2" {...props} className="relative mt-14 mb-4 text-2xl" />
  ),
  h3: (props) => (
    <Anchored as="h3" {...props} className="relative mt-10 mb-3 text-lg" />
  ),
  h4: (props) => (
    <Anchored as="h4" {...props} className="relative mt-8 mb-2 text-base" />
  ),

  p: (props) => <p {...props} className="my-5 leading-[1.75]" />,

  a: ({ href = "", ...props }) =>
    href.startsWith("/") ? (
      <Link
        href={href}
        {...props}
        className="text-accent decoration-rule-strong underline underline-offset-2"
      />
    ) : (
      <a
        href={href}
        {...props}
        className="text-accent decoration-rule-strong underline underline-offset-2"
        rel="noopener noreferrer"
      />
    ),

  ul: (props) => (
    <ul {...props} className="my-5 list-disc space-y-2 pl-6 leading-[1.75]" />
  ),
  ol: (props) => (
    <ol
      {...props}
      className="my-5 list-decimal space-y-2 pl-6 leading-[1.75]"
    />
  ),

  blockquote: (props) => (
    <blockquote
      {...props}
      className="border-rule-strong text-ink-muted my-7 border-l-2 pl-5 italic"
    />
  ),

  hr: () => <hr className="border-rule my-14" />,

  // Inline code only: block code arrives already wrapped by rehype-pretty-code.
  code: ({ children, ...props }) =>
    "data-language" in props ? (
      <code {...props}>{children}</code>
    ) : (
      <code
        {...props}
        className="bg-paper-raised rounded px-[0.3em] py-[0.1em] font-mono text-[0.875em]"
      >
        {children}
      </code>
    ),

  pre: (props) => <pre {...props} className="my-0 bg-transparent" />,

  table: (props) => (
    <div className="my-7 overflow-x-auto">
      <table {...props} className="w-full text-left text-sm" />
    </div>
  ),
  th: (props) => (
    <th
      {...props}
      className="border-rule-strong border-b py-2 pr-4 font-medium"
    />
  ),
  td: (props) => <td {...props} className="border-rule border-b py-2 pr-4" />,
};