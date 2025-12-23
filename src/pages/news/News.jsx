// src/pages/news/News.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import SEOHead from "../../components/SEOHead";
import LoadingSpinner from "../../components/LoadingSpinner";
import apiService from "../../services/api";
import { Newspaper, Search, Filter, Calendar, User, Eye, ArrowRight, Star } from "lucide-react";

function SmartImage({ src, alt, isDark, heightClass = "h-48", roundedClass = "rounded-2xl" }) {
  const [broken, setBroken] = useState(false);

  return (
    <div className={`relative w-full ${heightClass} overflow-hidden ${roundedClass} ${isDark ? "bg-gray-900" : "bg-slate-100"}`}>
      {src && !broken ? (
        <>
          <img src={src} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-55" />
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

export default function News() {
  const { isDark } = useTheme();

  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([{ id: "all", name: "Yote" }]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);

  const formatDate = (value) => {
    if (!value) return "";
    const d = new Date(value);
    return d.toLocaleDateString("sw-TZ", { year: "numeric", month: "long", day: "numeric" });
  };

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch((searchTerm || "").trim()), 350);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // load categories
  useEffect(() => {
    let mounted = true;

    const loadCats = async () => {
      try {
        const data = await apiService.getNewsCategories();
        const list = Array.isArray(data) ? data : data?.results || [];

        const normalized = [
          { id: "all", name: "Yote" },
          ...list.map((c) => ({ id: c.slug || c.id, name: c.name })),
        ];

        if (!mounted) return;
        setCategories(normalized);
      } catch {
        if (!mounted) return;
        setCategories([{ id: "all", name: "Yote" }]);
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
        };

        const data = await apiService.getNewsPosts(params);

        // support pagination or plain list
        const list = Array.isArray(data) ? data : data?.results || [];
        const count = Number(data?.count || list.length || 0);

        const perPage = Number(data?.results ? list.length : 0) || 6; // fallback
        const computedPages = data?.count && perPage ? Math.max(1, Math.ceil(count / perPage)) : 1;

        if (!mounted) return;

        setPosts(list);
        setPageCount(computedPages);
      } catch (err) {
        if (!mounted) return;
        setError(err?.message || "Hitilafu katika kupakia habari.");
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
  }, [debouncedSearch, selectedCategory, page]);

  // featured (top 2) kutoka page ya kwanza tu
  const featured = useMemo(() => {
    if (page !== 1) return [];
    return (posts || []).filter((p) => p.featured).slice(0, 2);
  }, [posts, page]);

  const normalPosts = useMemo(() => {
    if (!featured.length) return posts || [];
    const featuredIds = new Set(featured.map((x) => x.id));
    return (posts || []).filter((p) => !featuredIds.has(p.id));
  }, [posts, featured]);

  if (loading) {
    return (
      <>
        <SEOHead title="Habari & Vipengele" description="Soma makala za kiroho, habari za jamii, na vipengele vya kujenga imani." />
        <div
          className={`min-h-screen py-12 transition-colors ${
            isDark ? "bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950" : "bg-gradient-to-b from-slate-50 via-white to-emerald-50"
          }`}
        >
          <div className="container mx-auto px-4 md:px-6 flex items-center justify-center min-h-[420px]">
            <LoadingSpinner text="Inapakia habari..." size="lg" />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead title="Habari & Vipengele" description="Soma makala za kiroho, habari za jamii, na vipengele vya kujenga imani." />

      <div
        className={`min-h-screen py-10 md:py-12 transition-colors ${
          isDark ? "bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950" : "bg-gradient-to-b from-slate-50 via-white to-emerald-50"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          {/* Header */}
          <header className="text-center mb-8 md:mb-10">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 via-sky-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md shadow-emerald-400/40">
              <Newspaper className="text-white" size={32} />
            </div>

            <h1 className={`text-2xl md:text-3xl font-extrabold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
              Habari & Vipengele
            </h1>

            <p className={`text-sm md:text-base max-w-2xl mx-auto ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              Soma makala za kiroho, habari za jamii na vipengele vya kujenga imani na maisha ya kila siku.
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
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? "text-gray-400" : "text-gray-500"}`} size={18} />
              <input
                type="text"
                placeholder="Tafuta habari au makala..."
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

            {/* Category */}
            <div className="relative w-full md:w-64">
              <Filter className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? "text-gray-400" : "text-gray-500"}`} size={18} />
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setPage(1);
                }}
                className={`w-full pl-10 pr-8 py-2.5 rounded-full border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  isDark ? "bg-gray-900/80 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900"
                }`}
              >
                {categories.map((c) => (
                  <option key={String(c.id)} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Featured */}
          {page === 1 && featured.length > 0 ? (
            <section className="mb-10 md:mb-12">
              <h2 className={`text-lg md:text-2xl font-bold mb-5 flex items-center ${isDark ? "text-white" : "text-gray-900"}`}>
                <Star className="mr-2 text-yellow-400" size={20} />
                Habari Maalum
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
                    <div className="p-4">
                      <SmartImage src={post.featured_image} alt={post.title} isDark={isDark} heightClass="h-56 md:h-64" />
                      <div className="absolute top-6 left-6 bg-yellow-400 text-gray-900 text-[10px] font-semibold px-2.5 py-1 rounded-full">
                        Maalum
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {normalPosts.map((post) => (
                  <Link
                    key={post.id}
                    to={`/habari/${post.slug}`}
                    className={`overflow-hidden rounded-2xl border shadow-sm group transition-all hover:-translate-y-1 hover:shadow-md ${
                      isDark ? "bg-gray-900/85 border-gray-800" : "bg-white/95 border-gray-100"
                    }`}
                  >
                    <div className="p-4">
                      <SmartImage src={post.featured_image} alt={post.title} isDark={isDark} heightClass="h-44 md:h-48" />
                      <div className="absolute top-6 left-6 bg-emerald-600 text-white text-[10px] px-2.5 py-1 rounded-full">
                        {post.category?.name || "Bila Kundi"}
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
                          {post.read_time ? <span>{post.read_time} min</span> : null}
                        </div>
                      </div>

                      <div className="mt-3 flex items-center text-emerald-600 group-hover:text-emerald-700">
                        <span className="text-xs md:text-sm font-medium">Soma zaidi</span>
                        <ArrowRight size={14} className="ml-1" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {pageCount > 1 ? (
                <div className="flex justify-center mt-10 md:mt-12 gap-2 flex-wrap">
                  {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        p === page
                          ? "bg-emerald-600 text-white"
                          : isDark
                          ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              ) : null}
            </section>
          ) : (
            <div className={`mt-8 text-center rounded-2xl border px-6 py-10 ${isDark ? "bg-gray-900/85 border-gray-800" : "bg-white/95 border-gray-100"}`}>
              <Newspaper className={`mx-auto mb-4 ${isDark ? "text-gray-500" : "text-gray-400"}`} size={40} />
              <p className={`text-sm md:text-base ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                Hakuna habari zilizopatikana kwa vigezo ulivyoweka.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
