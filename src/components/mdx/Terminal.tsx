import type { ReactNode } from "react";

/**
 * Program output, not source. It deliberately looks unlike a Listing: no
 * number, no caption, a quiet surface instead of rules — because "Listing 4:
 * error message" would be a lie about what the reader is looking at.
 */
export function Terminal({ children }: { children: ReactNode }) {
  return (
    <div className="bg-paper-raised my-8 rounded-lg px-4 py-3.5">
      <p
        className="text-ink-faint mb-2 font-mono text-[0.6875rem] tracking-wide"
        aria-hidden="true"
      >
        terminal
      </p>
      <div className="text-ink-muted overflow-x-auto font-mono text-[0.78125rem] leading-relaxed">
        {children}
      </div>
    </div>
  );
}
