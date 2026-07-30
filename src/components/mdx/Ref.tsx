interface RefProps {
  /** Matches the `id` of a <Listing>. */
  to: string;
  /** Injected by remarkListings. */
  number?: string;
}

/** Cross-reference to a numbered listing — LaTeX's \ref. */
export function Ref({ to, number }: RefProps) {
  return (
    <a
      href={`#listing-${to}`}
      className="decoration-rule-strong text-accent underline underline-offset-2"
    >
      Listing {number ?? "?"}
    </a>
  );
}