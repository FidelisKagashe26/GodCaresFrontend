// src/pages/news/News.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";
import SEOHead from "../../components/SEOHead";
import LoadingSpinner from "../../components/LoadingSpinner";
import apiService from "../../services/api";
import {
  Newspaper,
  Search,
  Filter,
  Calendar,
  User,
  Eye,
  ArrowRight,
  Star,
  ChevronDown,
} from "lucide-react";

function SmartImage({ src, alt, isDark, heightClass = "h-48", roundedClass = "rounded-2xl" }) {
  const [broken, setBroken] = useState(false);

  return (
    <div
      className={`relative w-full ${heightClass} overflow-hidden ${roundedClass} ${
        isDark ? "bg-gray-900" : "bg-slate-100"
      }`}
    >
      {src && !broken ? (
        <>
          <img
            src={src}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-55"
          />
          <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            onError={() => setBroken(true)}
            className="relative z-10 w-full h-full object-contain"
          />
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Newspaper className={isDark ? "text-gray-600" : "text-gray-400"} size={36} />
        </div>
      )}
    </div>
  );
}

/**
 * Cards per page kwa breakpoints:
 * - simu:  1 col x 4 rows = 4
 * - md:    2 col x 3 rows = 6
 * - xl:    3 col x 3 rows = 9
 * - 2xl:   4 col x 3 rows = 12
 */
function useCardsPerPage() {
  const [perPage, setPerPage] = useState(4);

  useEffect(() => {
    const mMd = window.matchMedia("(min-width: 768px)");
    const mXl = window.matchMedia("(min-width: 1280px)");
    const m2xl = window.matchMedia("(min-width: 1536px)");

    const compute = () => {
      if (m2xl.matches) return 12;
      if (mXl.matches) return 9;
      if (mMd.matches) return 6;
      return 4;
    };

    const apply = () => setPerPage(compute());
    apply();

    const handler = () => apply();
    mMd.addEventListener?.("change", handler);
    mXl.addEventListener?.("change", handler);
    m2xl.addEventListener?.("change", handler);

    return () => {
      mMd.removeEventListener?.("change", handler);
      mXl.removeEventListener?.("change", handler);
      m2xl.removeEventListener?.("change", handler);
    };
  }, []);

  return perPage;
}

function buildPages(current, total) {
  const pages = [];
  const push = (x) => pages.push(x);

  if (total <= 7) {
    for (let i = 1; i <= total; i++) push(i);
    return pages;
  }

  push(1);

  const left = Math.max(2, current - 1);
  const right = Math.min(total - 1, current + 1);

  if (left > 2) push("…");
  for (let i = left; i <= right; i++) push(i);
  if (right < total - 1) push("…");

  push(total);
  return pages;
}

/** Dropdown ya kisasa + searchable (category filter tu) */
function CategoryDropdown({
  isDark,
  value,
  onChange,
  options, // [{ id, name }]
  placeholder,
  searchPlaceholder,
  noResultsText,
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const rootRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const onMouseDown = (e) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target)) setOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    setQ("");
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  const selectedName = useMemo(() => {
    const found = options.find((x) => String(x.id) === String(value));
    return found?.name || placeholder;
  }, [options, value, placeholder]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return options;
    return options.filter((o) => String(o.name || "").toLowerCase().includes(s));
  }, [q, options]);

  const panel = `rounded-2xl border shadow-xl ${
    isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
  }`;

  return (
    <div ref={rootRef} className="relative w-full md:w-64">
      <Filter
        className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? "text-gray-400" : "text-gray-500"}`}
        size={18}
      />

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full pl-10 pr-10 py-2.5 rounded-full border text-sm text-left font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
          isDark
            ? "bg-gray-900/80 border-gray-700 text-white"
            : "bg-white border-gray-200 text-gray-900"
        }`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="block truncate">{selectedName}</span>
        <ChevronDown
          size={18}
          className={`absolute right-3 top-1/2 -translate-y-1/2 transition-transform ${
            open ? "rotate-180" : ""
          } ${isDark ? "text-gray-300" : "text-gray-600"}`}
        />
      </button>

      {open && (
        <div className={`absolute left-0 top-full mt-2 z-50 w-full ${panel}`} role="listbox">
          <div className={`p-3 border-b ${isDark ? "border-gray-700" : "border-gray-100"}`}>
            <div
              className={`flex items-center gap-2 rounded-xl border px-3 py-2 ${
                isDark ? "border-gray-800 bg-gray-950" : "border-gray-200 bg-white"
              }`}
            >
              <Search size={16} className={isDark ? "text-gray-400" : "text-gray-500"} />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={searchPlaceholder}
                className={`w-full bg-transparent text-[12px] outline-none ${
                  isDark
                    ? "text-gray-200 placeholder:text-gray-500"
                    : "text-gray-800 placeholder:text-gray-400"
                }`}
              />
            </div>
          </div>

          <div className="max-h-64 overflow-auto py-2">
            {filtered.map((c) => {
              const active = String(c.id) === String(value);
              return (
                <button
                  key={String(c.id)}
                  type="button"
                  onClick={() => {
                    onChange(String(c.id));
                    setOpen(false);
                  }}
                  className={`mx-2 my-1 w-[calc(100%-16px)] text-left rounded-lg px-3 py-2 text-[12px] font-semibold transition-colors ${
                    active
                      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-200"
                      : isDark
                      ? "text-gray-200 hover:bg-gray-800"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  role="option"
                  aria-selected={active}
                >
                  {c.name}
                </button>
              );
            })}

            {filtered.length === 0 && (
              <div className={`px-4 py-3 text-[12px] ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                {noResultsText}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function News() {
  const { isDark } = useTheme();
  const { language, t } = useLanguage();
  const perPage = useCardsPerPage();

  const [posts, setPosts] = useState([]);
  const [apiCategories, setApiCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);

  const categories = useMemo(() => {
    return [{ id: "all", name: t("newsCategoryAll") }, ...apiCategories];
  }, [apiCategories, t]);

  const formatDate = (value) => {
    if (!value) return "";
    const d = new Date(value);
    const loc = language === "sw" ? "sw-TZ" : "en-US";
    return d.toLocaleDateString(loc, { year: "numeric", month: "long", day: "numeric" });
  };

  // debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch((searchTerm || "").trim()), 350);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // perPage change => reset page
  useEffect(() => {
    setPage(1);
  }, [perPage]);

  // load categories
  useEffect(() => {
    let mounted = true;

    const loadCats = async () => {
      try {
        const data = await apiService.getNewsCategories();
        const list = Array.isArray(data) ? data : data?.results || [];
        const normalized = list.map((c) => ({ id: c.slug || c.id, name: c.name }));

        if (!mounted) return;
        setApiCategories(normalized);
      } catch {
        if (!mounted) return;
        setApiCategories([]);
      }
    };

    loadCats();
    return () => {
      mounted = false;
    };
  }, []);

  // load posts
  useEffect(() => {
    let mounted = true;

    const loadPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = {
          search: debouncedSearch || undefined,
          category: selectedCategory !== "all" ? selectedCategory : undefined,
          page: page || 1,
          ordering: "-published_at",
          page_size: perPage,
        };

        const data = await apiService.getNewsPosts(params);

        const list = Array.isArray(data) ? data : data?.results || [];
        const count = Number(data?.count || list.length || 0);

        const computedPages = data?.count ? Math.max(1, Math.ceil(count / perPage)) : 1;

        if (!mounted) return;
        setPosts(list);
        setPageCount(computedPages);
      } catch (err) {
        if (!mounted) return;
        setError(err?.message || t("newsError"));
        setPosts([]);
        setPageCount(1);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadPosts();
    return () => {
      mounted = false;
    };
  }, [debouncedSearch, selectedCategory, page, perPage, t]);

  // featured top 2 on page 1
  const featured = useMemo(() => {
    if (page !== 1) return [];
    return (posts || []).filter((p) => p.featured).slice(0, 2);
  }, [posts, page]);

  const normalPosts = useMemo(() => {
    if (!featured.length) return posts || [];
    const featuredIds = new Set(featured.map((x) => x.id));
    return (posts || []).filter((p) => !featuredIds.has(p.id));
  }, [posts, featured]);

  const hasAnyPosts = (posts || []).length > 0;
  const pages = buildPages(page, pageCount);

  if (loading) {
    return (
      <>
        <SEOHead title={t("newsSeoTitle")} description={t("newsSeoDesc")} keywords={t("newsSeoKeywords")} />
        <div
          className={`min-h-screen py-12 transition-colors ${
            isDark
              ? "bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950"
              : "bg-gradient-to-b from-slate-50 via-white to-emerald-50"
          }`}
        >
          <div className="container mx-auto px-4 md:px-6 flex items-center justify-center min-h-[420px]">
            <LoadingSpinner text={t("newsLoading")} size="lg" />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead title={t("newsSeoTitle")} description={t("newsSeoDesc")} keywords={t("newsSeoKeywords")} />

      <div
        className={`min-h-screen py-10 md:py-12 transition-colors ${
          isDark
            ? "bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950"
            : "bg-gradient-to-b from-slate-50 via-white to-emerald-50"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          {/* Header */}
          <header className="text-center mb-8 md:mb-10">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 via-sky-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md shadow-emerald-400/40">
              <Newspaper className="text-white" size={32} />
            </div>

            <h1 className={`text-2xl md:text-3xl font-extrabold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
              {t("newsPageTitle")}
            </h1>

            <p className={`text-sm md:text-base max-w-2xl mx-auto ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              {t("newsPageIntro")}
            </p>
          </header>

          {error && (
            <div
              className={`mb-6 rounded-2xl border px-4 py-3 text-center text-xs md:text-sm ${
                isDark ? "bg-red-900/40 border-red-800 text-red-100" : "bg-red-50 border-red-200 text-red-700"
              }`}
            >
              {error}
            </div>
          )}

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? "text-gray-400" : "text-gray-500"}`}
                size={18}
              />
              <input
                type="text"
                placeholder={t("newsSearchPlaceholder")}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className={`w-full pl-10 pr-4 py-2.5 rounded-full border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  isDark
                    ? "bg-gray-900/80 border-gray-700 text-white placeholder:text-gray-500"
                    : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-500"
                }`}
              />
            </div>

            {/* Category Filter */}
            <CategoryDropdown
              isDark={isDark}
              value={selectedCategory}
              onChange={(val) => {
                setSelectedCategory(val);
                setPage(1);
              }}
              options={categories}
              placeholder={t("newsCategoryPlaceholder")}
              searchPlaceholder={t("newsCategorySearchPlaceholder")}
              noResultsText={t("newsCategoryNoResults")}
            />
          </div>

          {/* Featured */}
          {page === 1 && featured.length > 0 ? (
            <section className="mb-10 md:mb-12">
              <h2 className={`text-lg md:text-2xl font-bold mb-5 flex items-center ${isDark ? "text-white" : "text-gray-900"}`}>
                <Star className="mr-2 text-yellow-400" size={20} />
                {t("newsFeaturedTitle")}
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                {featured.map((post) => (
                  <Link
                    key={post.id}
                    to={`/habari/${post.slug}`}
                    className={`overflow-hidden rounded-2xl border shadow-sm group transition-all hover:-translate-y-1 hover:shadow-md ${
                      isDark ? "bg-gray-900/85 border-gray-800" : "bg-white/95 border-gray-100"
                    }`}
                  >
                    <div className="relative p-4">
                      <SmartImage src={post.featured_image} alt={post.title} isDark={isDark} heightClass="h-56 md:h-64" />
                      <div className="absolute top-6 left-6 bg-yellow-400 text-gray-900 text-[10px] font-semibold px-2.5 py-1 rounded-full">
                        {t("newsFeaturedBadge")}
                      </div>
                    </div>

                    <div className="px-5 pb-5">
                      <h3 className={`text-base md:text-xl font-bold mb-2 group-hover:text-emerald-600 transition-colors ${isDark ? "text-white" : "text-gray-900"}`}>
                        {post.title}
                      </h3>

                      <p className={`text-xs md:text-sm mb-4 line-clamp-3 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                        {post.excerpt}
                      </p>

                      <div className="flex items-center justify-between text-[11px] md:text-xs">
                        <div className="flex items-center flex-wrap gap-3">
                          <span className="flex items-center">
                            <User size={12} className="mr-1" />
                            {post.author_name}
                          </span>
                          <span className="flex items-center">
                            <Calendar size={12} className="mr-1" />
                            {formatDate(post.published_at)}
                          </span>
                        </div>
                        <span className="flex items-center">
                          <Eye size={12} className="mr-1" />
                          {Number(post.views || 0)}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          {/* Posts */}
          {normalPosts.length > 0 ? (
            <section>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 md:gap-8">
                {normalPosts.map((post) => (
                  <Link
                    key={post.id}
                    to={`/habari/${post.slug}`}
                    className={`overflow-hidden rounded-2xl border shadow-sm group transition-all hover:-translate-y-1 hover:shadow-md ${
                      isDark ? "bg-gray-900/85 border-gray-800" : "bg-white/95 border-gray-100"
                    }`}
                  >
                    <div className="relative p-4">
                      <SmartImage src={post.featured_image} alt={post.title} isDark={isDark} heightClass="h-44 md:h-48" />
                      <div className="absolute top-6 left-6 bg-emerald-600 text-white text-[10px] px-2.5 py-1 rounded-full">
                        {post.category?.name || t("newsNoCategory")}
                      </div>
                    </div>

                    <div className="px-5 pb-5">
                      <h3 className={`text-base md:text-lg font-bold mb-2 group-hover:text-emerald-600 transition-colors ${isDark ? "text-white" : "text-gray-900"}`}>
                        {post.title}
                      </h3>

                      <p className={`text-xs md:text-sm mb-4 line-clamp-3 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                        {post.excerpt}
                      </p>

                      <div className="flex items-center justify-between text-[11px] md:text-xs">
                        <div className="flex items-center flex-wrap gap-3">
                          <span className="flex items-center">
                            <User size={12} className="mr-1" />
                            {post.author_name}
                          </span>
                          <span className="flex items-center">
                            <Calendar size={12} className="mr-1" />
                            {formatDate(post.published_at)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="flex items-center">
                            <Eye size={12} className="mr-1" />
                            {Number(post.views || 0)}
                          </span>
                          {post.read_time ? (
                            <span>
                              {post.read_time} {t("newsReadTimeSuffix")}
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <div className="mt-3 inline-flex items-center text-emerald-600 group-hover:text-emerald-700">
                        <span className="text-xs md:text-sm font-medium">{t("newsReadMore")}</span>
                        <ArrowRight size={14} className="ml-1" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          {/* Empty */}
          {!error && !hasAnyPosts ? (
            <div
              className={`mt-8 text-center rounded-2xl border px-6 py-10 ${
                isDark ? "bg-gray-900/85 border-gray-800" : "bg-white/95 border-gray-100"
              }`}
            >
              <Newspaper className={`mx-auto mb-4 ${isDark ? "text-gray-500" : "text-gray-400"}`} size={40} />
              <p className={`text-sm md:text-base ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                {t("newsNoResults")}
              </p>
            </div>
          ) : null}

          {/* Pagination */}
          {pageCount > 1 && hasAnyPosts ? (
            <div className="flex items-center justify-center mt-10 md:mt-12 gap-2 flex-wrap">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  isDark
                    ? "bg-gray-900 border-gray-800 text-gray-200 hover:bg-gray-800"
                    : "bg-white border-gray-200 text-gray-800 hover:bg-gray-50"
                }`}
              >
                {t("paginationPrev")}
              </button>

              {pages.map((p, idx) =>
                p === "…" ? (
                  <span key={`dots-${idx}`} className={`px-2 text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors border ${
                      p === page
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : isDark
                        ? "bg-gray-900 text-gray-200 border-gray-800 hover:bg-gray-800"
                        : "bg-white text-gray-800 border-gray-200 hover:bg-gray-50"
                    }`}
                    aria-current={p === page ? "page" : undefined}
                  >
                    {p}
                  </button>
                )
              )}

              <button
                onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                disabled={page >= pageCount}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  isDark
                    ? "bg-gray-900 border-gray-800 text-gray-200 hover:bg-gray-800"
                    : "bg-white border-gray-200 text-gray-800 hover:bg-gray-50"
                }`}
              >
                {t("paginationNext")}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
