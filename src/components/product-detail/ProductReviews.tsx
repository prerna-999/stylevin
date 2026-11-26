import React, { useEffect, useMemo, useState } from "react";
import { FiCheckCircle, FiEdit3, FiThumbsUp, FiTrash2, FiX } from "react-icons/fi";
import { Review, ReviewSummary } from "@/types/review";
import { mergeSummary } from "@/lib/products/reviews";
import StarRating from "./StarRating";

interface ProductReviewsProps {
  productId: number;
  sizes: string[];
  reviews: Review[];
  summary: ReviewSummary;
  /** lets the page show the merged rating in the header too */
  onSummaryChange?: (summary: ReviewSummary) => void;
}

type SortKey = "recent" | "high" | "low" | "helpful";
const STORAGE_KEY = "stylevin-reviews";
const PAGE = 4;

const readOwn = (productId: number): Review[] => {
  try {
    const all = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}");
    return Array.isArray(all[productId]) ? all[productId] : [];
  } catch {
    return [];
  }
};

const writeOwn = (productId: number, list: Review[]) => {
  try {
    const all = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}");
    all[productId] = list;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    /* storage blocked — the review still shows for this visit */
  }
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

const LABELS = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];

const ProductReviews: React.FC<ProductReviewsProps> = ({
  productId,
  sizes,
  reviews,
  summary,
  onSummaryChange,
}) => {
  const [own, setOwn] = useState<Review[]>([]);
  const [sort, setSort] = useState<SortKey>("recent");
  const [starFilter, setStarFilter] = useState<number | null>(null);
  const [visible, setVisible] = useState(PAGE);
  const [voted, setVoted] = useState<Record<string, boolean>>({});
  const [formOpen, setFormOpen] = useState(false);

  // form state
  const [fRating, setFRating] = useState(0);
  const [fHover, setFHover] = useState(0);
  const [fName, setFName] = useState("");
  const [fTitle, setFTitle] = useState("");
  const [fComment, setFComment] = useState("");
  const [fSize, setFSize] = useState("");
  const [fError, setFError] = useState("");
  const [thanks, setThanks] = useState(false);

  useEffect(() => {
    setOwn(readOwn(productId));
    setStarFilter(null);
    setVisible(PAGE);
    setFormOpen(false);
    setThanks(false);
  }, [productId]);

  const merged = useMemo(() => mergeSummary(summary, own), [summary, own]);

  useEffect(() => {
    onSummaryChange?.(merged);
  }, [merged, onSummaryChange]);

  const list = useMemo(() => {
    let all = [...own.map((r) => ({ ...r, isOwn: true })), ...reviews];
    if (starFilter) all = all.filter((r) => r.rating === starFilter);
    const sorted = [...all];
    switch (sort) {
      case "high":
        sorted.sort((a, b) => b.rating - a.rating || b.date.localeCompare(a.date));
        break;
      case "low":
        sorted.sort((a, b) => a.rating - b.rating || b.date.localeCompare(a.date));
        break;
      case "helpful":
        sorted.sort((a, b) => (b.helpful ?? 0) - (a.helpful ?? 0));
        break;
      default:
        sorted.sort((a, b) => b.date.localeCompare(a.date));
    }
    // the shopper's own review always stays on top
    return [...sorted.filter((r) => r.isOwn), ...sorted.filter((r) => !r.isOwn)];
  }, [own, reviews, sort, starFilter]);

  const resetForm = () => {
    setFRating(0);
    setFHover(0);
    setFName("");
    setFTitle("");
    setFComment("");
    setFSize("");
    setFError("");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fRating) return setFError("Please choose a star rating.");
    if (fName.trim().length < 2) return setFError("Please enter your name.");
    if (fComment.trim().length < 10) return setFError("Please write at least 10 characters in your review.");

    const review: Review = {
      id: `own-${Date.now()}`,
      productId,
      author: fName.trim(),
      rating: fRating,
      title: fTitle.trim() || LABELS[fRating],
      comment: fComment.trim(),
      date: new Date().toISOString().slice(0, 10),
      size: fSize || undefined,
      helpful: 0,
      isOwn: true,
    };
    const next = [review, ...own];
    setOwn(next);
    writeOwn(productId, next);
    resetForm();
    setFormOpen(false);
    setThanks(true);
    setStarFilter(null);
  };

  const removeOwn = (id: string) => {
    const next = own.filter((r) => r.id !== id);
    setOwn(next);
    writeOwn(productId, next);
  };

  const shownRating = fHover || fRating;

  return (
    <section className="pd-reviews" id="reviews" aria-labelledby="pd-reviews-title">
      <div className="pd-reviews__inner">
        <h2 id="pd-reviews-title" className="pd-reviews__title">
          Ratings &amp; Reviews
        </h2>

        <div className="pd-reviews__grid">
          {/* ---------- summary ---------- */}
          <aside className="pd-reviews__summary">
            {merged.total > 0 ? (
              <>
                <div className="pd-reviews__avg">
                  <span className="pd-reviews__avg-num">{merged.average.toFixed(1)}</span>
                  <div>
                    <StarRating value={merged.average} size={20} />
                    <p>Based on {merged.total} reviews</p>
                  </div>
                </div>

                <ul className="pd-reviews__bars">
                  {([5, 4, 3, 2, 1] as const).map((s) => {
                    const n = merged.breakdown[s];
                    const pct = merged.total ? (n / merged.total) * 100 : 0;
                    return (
                      <li key={s}>
                        <button
                          type="button"
                          className={`pd-reviews__bar ${starFilter === s ? "is-active" : ""}`}
                          onClick={() => {
                            setStarFilter(starFilter === s ? null : s);
                            setVisible(PAGE);
                          }}
                          aria-pressed={starFilter === s}
                          aria-label={`Show ${s} star reviews (${n})`}
                        >
                          <span className="pd-reviews__bar-label">{s} ★</span>
                          <span className="pd-reviews__bar-track">
                            <span className="pd-reviews__bar-fill" style={{ width: `${pct}%` }} />
                          </span>
                          <span className="pd-reviews__bar-count">{n}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </>
            ) : (
              <p className="pd-reviews__empty-sum">No reviews yet. Be the first to review this product.</p>
            )}

            <div className="pd-reviews__cta">
              <p>Bought this product? Share your thoughts with other shoppers.</p>
              <button
                type="button"
                className="pd-reviews__write"
                onClick={() => {
                  setFormOpen((o) => !o);
                  setThanks(false);
                }}
              >
                <FiEdit3 /> {formOpen ? "Cancel" : "Write a Review"}
              </button>
            </div>
          </aside>

          {/* ---------- list ---------- */}
          <div className="pd-reviews__main">
            {thanks && (
              <div className="pd-reviews__thanks" role="status">
                <FiCheckCircle /> Thanks! Your review has been added.
                <button type="button" aria-label="Dismiss" onClick={() => setThanks(false)}>
                  <FiX />
                </button>
              </div>
            )}

            {formOpen && (
              <form className="pd-reviews__form" onSubmit={submit} noValidate>
                <h3>Write a review</h3>

                <div className="pd-reviews__field">
                  <span className="pd-reviews__field-label">Your rating *</span>
                  <div className="pd-reviews__picker" onMouseLeave={() => setFHover(0)}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        aria-label={`${s} star${s > 1 ? "s" : ""}`}
                        aria-pressed={fRating === s}
                        className={s <= shownRating ? "is-on" : ""}
                        onMouseEnter={() => setFHover(s)}
                        onClick={() => setFRating(s)}
                      >
                        ★
                      </button>
                    ))}
                    {shownRating > 0 && <span className="pd-reviews__picker-label">{LABELS[shownRating]}</span>}
                  </div>
                </div>

                <div className="pd-reviews__row">
                  <label className="pd-reviews__field">
                    <span className="pd-reviews__field-label">Name *</span>
                    <input value={fName} onChange={(e) => setFName(e.target.value)} maxLength={40} placeholder="Your name" />
                  </label>
                  {sizes.length > 1 && (
                    <label className="pd-reviews__field">
                      <span className="pd-reviews__field-label">Size purchased</span>
                      <select value={fSize} onChange={(e) => setFSize(e.target.value)}>
                        <option value="">Select</option>
                        {sizes.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}
                </div>

                <label className="pd-reviews__field">
                  <span className="pd-reviews__field-label">Review title</span>
                  <input value={fTitle} onChange={(e) => setFTitle(e.target.value)} maxLength={60} placeholder="Sum it up in a few words" />
                </label>

                <label className="pd-reviews__field">
                  <span className="pd-reviews__field-label">Your review *</span>
                  <textarea
                    value={fComment}
                    onChange={(e) => setFComment(e.target.value)}
                    rows={4}
                    maxLength={600}
                    placeholder="How was the fit, fabric and quality?"
                  />
                </label>

                {fError && <p className="pd-reviews__error">{fError}</p>}

                <div className="pd-reviews__form-actions">
                  <button type="submit" className="pd-reviews__submit">
                    Submit Review
                  </button>
                  <button
                    type="button"
                    className="pd-reviews__cancel"
                    onClick={() => {
                      resetForm();
                      setFormOpen(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {(reviews.length > 0 || own.length > 0) && (
              <div className="pd-reviews__toolbar">
                <p>
                  {starFilter ? (
                    <>
                      Showing {list.length} {starFilter}★ review{list.length === 1 ? "" : "s"}
                      <button type="button" className="pd-reviews__clear" onClick={() => setStarFilter(null)}>
                        Clear <FiX />
                      </button>
                    </>
                  ) : (
                    <>Customer reviews</>
                  )}
                </p>
                <label className="pd-reviews__sort">
                  Sort by
                  <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
                    <option value="recent">Most recent</option>
                    <option value="helpful">Most helpful</option>
                    <option value="high">Highest rated</option>
                    <option value="low">Lowest rated</option>
                  </select>
                </label>
              </div>
            )}

            {list.length === 0 && (reviews.length > 0 || own.length > 0) && (
              <p className="pd-reviews__none">No {starFilter}★ reviews yet.</p>
            )}

            <ul className="pd-reviews__list">
              {list.slice(0, visible).map((r) => {
                const didVote = !!voted[r.id];
                return (
                  <li key={r.id} className={`pd-reviews__item ${r.isOwn ? "is-own" : ""}`}>
                    <div className="pd-reviews__item-head">
                      <span className={`pd-reviews__chip pd-reviews__chip--${r.rating >= 4 ? "good" : r.rating === 3 ? "mid" : "low"}`}>
                        {r.rating} ★
                      </span>
                      <h4>{r.title}</h4>
                      {r.isOwn && <span className="pd-reviews__own-tag">Your review</span>}
                    </div>
                    <p className="pd-reviews__comment">{r.comment}</p>
                    <div className="pd-reviews__meta">
                      <span className="pd-reviews__author">{r.author}</span>
                      {r.verified && (
                        <span className="pd-reviews__verified">
                          <FiCheckCircle /> Verified Buyer
                        </span>
                      )}
                      {r.size && <span>Size: {r.size}</span>}
                      <span>{formatDate(r.date)}</span>
                    </div>
                    <div className="pd-reviews__actions">
                      {r.isOwn ? (
                        <button type="button" onClick={() => removeOwn(r.id)}>
                          <FiTrash2 /> Delete
                        </button>
                      ) : (
                        <button
                          type="button"
                          className={didVote ? "is-active" : ""}
                          aria-pressed={didVote}
                          onClick={() => setVoted((v) => ({ ...v, [r.id]: !v[r.id] }))}
                        >
                          <FiThumbsUp /> Helpful ({(r.helpful ?? 0) + (didVote ? 1 : 0)})
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>

            {visible < list.length && (
              <button type="button" className="pd-reviews__more" onClick={() => setVisible((v) => v + PAGE)}>
                Load more reviews
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductReviews;
