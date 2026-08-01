"use client";

import MiniSearch, { type SearchResult } from "minisearch";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import type { SearchDocument } from "@/lib/search-index";

type Hit = SearchResult & SearchDocument;

/**
 * The index is fetched on first open, not on page load — nobody should pay for
 * search who does not use it.
 */
function useIndex(locale: string) {
  const [engine, setEngine] = useState<MiniSearch<SearchDocument> | null>(null);
  const [failed, setFailed] = useState(false);
  const started = useRef(false);

  const load = useCallback(async () => {
    if (started.current) return;
    started.current = true;

    try {
      const response = await fetch(`/${locale}/search-index.json`);
      if (!response.ok) throw new Error(String(response.status));
      const documents: SearchDocument[] = await response.json();

      const mini = new MiniSearch<SearchDocument>({
        fields: ["title", "tags", "description", "body"],
        storeFields: ["slug", "title", "description", "tags", "date"],
        searchOptions: {
          prefix: true,
          fuzzy: 0.2,
          // Weighted so a term in the title outranks the same term buried in
          // the body — with few long articles, everything matches the body.
          boost: { title: 4, tags: 3, description: 2 },
        },
      });
      mini.addAll(documents);
      setEngine(mini);
    } catch {
      setFailed(true);
      started.current = false;
    }
  }, [locale]);

  return { engine, failed, load };
}

export function Search() {
  const t = useTranslations("search");
  const locale = useLocale();
  const { engine, failed, load } = useIndex(locale);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);

  const show = useCallback(() => {
    void load();
    setOpen(true);
    dialog.current?.showModal();
    // Native <dialog> gives us focus trapping, Escape and the backdrop for
    // free; only the initial focus needs doing by hand.
    requestAnimationFrame(() => input.current?.focus());
  }, [load]);

  const hide = useCallback(() => {
    setOpen(false);
    setQuery("");
    dialog.current?.close();
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        if (open) {
          hide();
        } else {
          show();
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, show, hide]);

  const hits = (engine && query.trim() ? engine.search(query) : []).slice(
    0,
    8,
  ) as Hit[];

  return (
    <>
      <button
        type="button"
        onClick={show}
        onPointerEnter={() => void load()}
        aria-label={t("open")}
        className="text-ink-muted hover:text-ink font-mono text-xs transition-colors"
      >
        {t("label")}
      </button>

      <dialog
        ref={dialog}
        onClose={hide}
        onClick={(event) => {
          if (event.target === dialog.current) hide();
        }}
        aria-label={t("open")}
        className="bg-paper text-ink border-rule-strong m-0 w-full max-w-xl border p-0 backdrop:bg-black/40 sm:mt-[12vh] sm:mr-auto sm:ml-auto"
      >
        <div className="border-rule flex items-center gap-3 border-b px-5 py-4">
          <span className="text-ink-faint font-mono text-xs" aria-hidden="true">
            /
          </span>
          <input
            ref={input}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("placeholder")}
            aria-label={t("placeholder")}
            className="placeholder:text-ink-faint w-full bg-transparent text-base outline-none"
          />
          <kbd className="text-ink-faint hidden font-mono text-[0.6875rem] sm:block">
            esc
          </kbd>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {failed ? (
            <p className="text-ink-muted px-5 py-8 text-sm">{t("failed")}</p>
          ) : !query.trim() ? (
            <p className="text-ink-faint px-5 py-8 text-sm">{t("hint")}</p>
          ) : hits.length === 0 ? (
            <p className="text-ink-muted px-5 py-8 text-sm">
              {t("noResults", { query })}
            </p>
          ) : (
            <ul>
              {hits.map((hit) => (
                <li key={hit.id} className="border-rule border-b last:border-0">
                  <Link
                    href={`/writing/${hit.slug}`}
                    onClick={hide}
                    className="hover:bg-paper-raised block px-5 py-4 transition-colors"
                  >
                    <div className="text-ink-faint flex items-baseline gap-2 font-mono text-[0.6875rem]">
                      <time dateTime={hit.date}>{hit.date}</time>
                      {hit.tags.length > 0 && (
                        <>
                          <span>·</span>
                          <span>{hit.tags.join(", ")}</span>
                        </>
                      )}
                    </div>
                    <p className="mt-1 leading-snug">{hit.title}</p>
                    <p className="text-ink-muted mt-1 line-clamp-2 text-sm leading-relaxed">
                      {hit.description}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </dialog>
    </>
  );
}
