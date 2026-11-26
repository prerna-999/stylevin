import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { Search } from "lucide-react";

const SearchBar: React.FC<{ initial: string }> = ({ initial }) => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [term, setTerm] = useState(initial);

  useEffect(() => setTerm(initial), [initial]);

  useEffect(() => {
    if (!initial) inputRef.current?.focus();
  }, [initial]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = term.trim();
    if (!q) return;
    inputRef.current?.blur();
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <form className="search-page-bar" role="search" onSubmit={submit}>
      <input
        ref={inputRef}
        type="search"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="What are you looking for?"
        enterKeyHint="search"
        autoComplete="off"
        aria-label="Search products"
      />
      <button type="submit" aria-label="Search">
        <Search size={22} strokeWidth={1.8} />
      </button>
    </form>
  );
};

export default SearchBar;
