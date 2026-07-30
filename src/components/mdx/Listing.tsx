import type { ReactNode } from "react";

interface ListingProps {
  /** Stable handle for <Ref to="..." />. */
  id?: string;
  caption: string;
  /** Injected by remarkListings — never write this by hand. */
  number?: string;
  children: ReactNode;
}

/**
 * A numbered source listing in the shape LaTeX's `minted` gives you: hairlines
 * instead of a box, caption set in the body face underneath, numbering handled
 * by the build rather than the author.
 */
export function Listing({ id, caption, number, children }: ListingProps) {
  const label = `Listing ${number ?? "?"}`;

  return (
    <div
      id={id ? `listing-${id}` : undefined}
      role="figure"
      aria-label={`${label}: ${caption}`}
      className="my-10 scroll-mt-24"
    >
      <div className="border-rule-strong overflow-x-auto border-t border-b py-3 font-mono text-[0.8125rem] leading-relaxed">
        {children}
      </div>
      <p className="text-ink-muted mt-2.5 text-center text-sm">
        <span className="text-ink-faint">{label}:</span> {caption}
      </p>
    </div>
  );
}
