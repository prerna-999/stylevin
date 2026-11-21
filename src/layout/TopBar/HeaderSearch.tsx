"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Search, X, Loader2 } from "lucide-react";
import type { SearchSuggestion } from "@/lib/products/search";

type Props = { open: boolean; onClose: () => void };

const rupee = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const MIN_CHARS = 2;

export default function HeaderSearch({ open, onClose }: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchSuggestion[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [searched, setSearched] = useState(""); // the query the shown results belong to
  const [active, setActive] = useState(-1);

  const q = query.trim();
  const ready = q.length >= MIN_CHARS;

  // focus the field whenever the panel opens
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 30);
  }, [open]);

  // live search: debounced, and stale requests are cancelled
  useEffect(() => {
    if (!open || !ready) {
      setResults([]); setTotal(0); setLoading(false); setFailed(false); setSearched("");
      return;
    }
    const ctrl = new AbortController();
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=6`, { signal: ctrl.signal });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setResults(data.products ?? []);
        setTotal(data.total ?? 0);
        setSearched(q);
        setFailed(false);
        setActive(-1);
      } catch (e: any) {
        if (e?.name !== "AbortError") { setFailed(true); setResults([]); }
      } finally {
        if (!ctrl.signal.aborted) setLoading(false);
      }
    }, 200);
    return () => { clearTimeout(t); ctrl.abort(); };
  }, [q, ready, open]);

  const close = useCallback(() => { onClose(); setActive(-1); }, [onClose]);

  // close on outside click / route change
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent | TouchEvent) => {
      const t = e.target as Node;
      if (panelRef.current?.contains(t)) return;
      if ((t as HTMLElement).closest?.("[data-search-toggle]")) return; // the header icon handles itself
      close();
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    router.events.on("routeChangeStart", close);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
      router.events.off("routeChangeStart", close);
    };
  }, [open, close, router.events]);

  const goAll = () => {
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") return close();
    if (e.key === "ArrowDown" && results.length) {
      e.preventDefault();
      setActive((a) => (a + 1) % results.length);
    } else if (e.key === "ArrowUp" && results.length) {
      e.preventDefault();
      setActive((a) => (a <= 0 ? results.length - 1 : a - 1));
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (active >= 0 && results[active]) router.push(`/product/${results[active].slug}`);
    else goAll();
  };

  if (!open) return null;

  const showNone = ready && !loading && !failed && searched === q && results.length === 0;

  return (
    <div className="hs-panel" role="search" ref={panelRef}>
      <div className="hs-inner">
        <form className="hs-form" onSubmit={onSubmit}>
          <button type="submit" className="hs-go" aria-label="Search">
            <Search size={20} />
          </button>
          <input
            ref={inputRef}
            type="search"
            className="hs-input"
            placeholder="Search products, categories, brands…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            autoComplete="off"
            enterKeyHint="search"
            aria-label="Search products"
            aria-autocomplete="list"
            aria-controls="hs-list"
            aria-activedescendant={active >= 0 ? `hs-opt-${active}` : undefined}
          />
          {loading && <Loader2 size={18} className="hs-spin" aria-hidden="true" />}
          <button type="button" className="hs-close" aria-label="Close search" onClick={close}>
            <X size={20} />
          </button>
        </form>

        {ready && (
          <div className="hs-results" id="hs-list" role="listbox" aria-live="polite">
            {failed && <p className="hs-msg">Search is unavailable right now. Please try again.</p>}
            {showNone && <p className="hs-msg hs-msg--none">No products found!</p>}

            {results.map((p, i) => (
              <Link
                key={p.id}
                id={`hs-opt-${i}`}
                href={`/product/${p.slug}`}
                role="option"
                aria-selected={i === active}
                className={`hs-item ${i === active ? "is-active" : ""}`}
                onClick={close}
                onMouseEnter={() => setActive(i)}
              >
                {p.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image} alt="" className="hs-item__img" loading="lazy" />
                ) : (
                  <span className="hs-item__img" />
                )}
                <span className="hs-item__text">
                  <b>{p.name}</b>
                  <small>{p.category}{p.subcategory ? ` · ${p.subcategory}` : ""}</small>
                </span>
                <span className="hs-item__price">{rupee(p.price)}</span>
              </Link>
            ))}

            {results.length > 0 && (
              <Link href={`/search?q=${encodeURIComponent(q)}`} className="hs-all" onClick={close}>
                View all {total} {total === 1 ? "result" : "results"} for “{q}”
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
