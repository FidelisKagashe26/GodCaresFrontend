// src/pages/news/NewsDetail.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import SEOHead from "../../components/SEOHead";
import LoadingSpinner from "../../components/LoadingSpinner";
import apiService from "../../services/api";
import { Calendar, User, Eye, ArrowLeft, Clock, AlertCircle } from "lucide-react";

function SmartImage({ src, alt, isDark, heightClass = "h-56 md:h-72 lg:h-80", roundedClass = "rounded-2xl" }) {
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
          <div className={`text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}>No Image</div>
        </div>
      )}
    </div>
  );
}

export default function NewsDetail() {
  const { slug } = useParams();
  const { isDark } = useTheme();

  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = (value) => {
    if (!value) return "";
    const d = new Date(value);
    return d.toLocaleDateString("sw-TZ", { year: "numeric", month: "long", day: "numeric" });
  };

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      setPost(null);
      setRelated([]);

      try {
        const data = await apiService.getNewsPost(slug);

        if (!mounted) return;
        setPost(data);
        setRelated(Array.isArray(data?.related_posts) ? data.related_posts : []);
      } catch (err) {
        if (!mounted) return;
        setError(err?.message || "Hitilafu katika kupakia makala.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (slug) load();
    return () => {
      mounted = false;
    };
  }, [slug]);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = post ? `${post.title} - GOD CARES 365` : "";

  const safeCategoryName = post?.category?.name || "Bila Kundi";

  const readTime = useMemo(() => {
    const rt = Number(post?.read_time || 0);
    return rt > 0 ? rt : null;
  }, [post]);

  if (loading) {
    return (
      <>
        <SEOHead title="Makala | Habari" description="Inapakia makala..." />
        <div
          className={`min-h-screen py-12 transition-colors ${
            isDark ? "bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950" : "bg-gradient-to-b from-slate-50 via-white to-emerald-50"
          }`}
        >
          <div className="container mx-auto px-4 md:px-6 flex items-center justify-center min-h-[420px]">
            <LoadingSpinner text="Inapakia makala..." size="lg" />
          </div>
        </div>
      </>
    );
  }

  if (error || !post) {
    return (
      <>
        <SEOHead title="Makala Haijapatikana" description="Taarifa za makala hazikupatikana." />
        <div
          className={`min-h-screen py-12 transition-colors ${
            isDark ? "bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950" : "bg-gradient-to-b from-slate-50 via-white to-emerald-50"
          }`}
        >
          <div className="container mx-auto px-4 md:px-6">
            <div className={`text-center rounded-2xl border px-6 py-10 ${isDark ? "bg-gray-900/85 border-gray-800" : "bg-white/95 border-gray-100"}`}>
              <AlertCircle className={isDark ? "text-rose-300 mx-auto mb-3" : "text-rose-600 mx-auto mb-3"} size={40} />
              <p className="text-red-600 text-base md:text-lg">{error || "Makala haijapatikana"}</p>
              <Link
                to="/habari"
                className="inline-flex items-center mt-4 text-emerald-600 hover:text-emerald-700 dark:text-emerald-300 text-sm font-semibold"
              >
                <ArrowLeft size={16} className="mr-1" />
                Rudi kwenye Habari
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead title={`${post.title} | Habari`} description={(post.excerpt || "").slice(0, 150)} />

      <div
        className={`min-h-screen py-10 md:py-12 transition-colors ${
          isDark ? "bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950" : "bg-gradient-to-b from-slate-50 via-white to-emerald-50"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          {/* Back */}
          <Link
            to="/habari"
            className="inline-flex items-center mb-6 md:mb-8 text-emerald-600 hover:text-emerald-700 dark:text-emerald-300 text-xs md:text-sm font-semibold"
          >
            <ArrowLeft size={16} className="mr-1" />
            Rudi kwenye Habari
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
            {/* Main */}
            <article className="lg:col-span-3">
              <div className={`rounded-2xl border shadow-sm p-5 md:p-7 ${isDark ? "bg-gray-900/85 border-gray-800" : "bg-white/95 border-gray-100"}`}>
                {/* Header */}
                <header className="mb-6 md:mb-8">
                  <div className="flex items-center flex-wrap gap-3 mb-4">
                    <span className="bg-emerald-600 text-white text-[10px] px-3 py-1 rounded-full font-semibold">
                      {safeCategoryName}
                    </span>
                    {post.published_at ? (
                      <span className={`text-[11px] ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                        {formatDate(post.published_at)}
                      </span>
                    ) : null}
                  </div>

                  <h1 className={`text-xl md:text-3xl lg:text-4xl font-extrabold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
                    {post.title}
                  </h1>

                  <div className="flex flex-wrap items-center justify-between gap-3 mb-6 text-[11px] md:text-xs">
                    <div className="flex flex-wrap items-center gap-4">
                      <span className="flex items-center">
                        <User size={16} className="mr-1" />
                        {post.author_name}
                      </span>
                      {readTime ? (
                        <span className="flex items-center">
                          <Clock size={16} className="mr-1" />
                          {readTime} min kusoma
                        </span>
                      ) : null}
                      <span className="flex items-center">
                        <Eye size={16} className="mr-1" />
                        {Number(post.views || 0)} mara
                      </span>
                    </div>

                    {/* Share (optional) */}
                    <div className={`text-[11px] ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      Shiriki:{" "}
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sky-500 hover:underline ml-1"
                      >
                        Facebook
                      </a>
                      {" · "}
                      <a
                        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sky-500 hover:underline"
                      >
                        X
                      </a>
                    </div>
                  </div>

                  <SmartImage src={post.featured_image} alt={post.title} isDark={isDark} />
                </header>

                {/* Content */}
                <div
                  className={`prose prose-sm md:prose-base lg:prose-lg max-w-none ${isDark ? "prose-invert" : ""}`}
                  dangerouslySetInnerHTML={{ __html: post.content || "" }}
                />
              </div>
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-1 space-y-6">
              {/* Related */}
              {related.length > 0 ? (
                <div className={`rounded-2xl border p-5 md:p-6 ${isDark ? "bg-gray-900/85 border-gray-800" : "bg-white/95 border-gray-100"}`}>
                  <h3 className={`text-sm md:text-base font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
                    Makala Zinazohusiana
                  </h3>

                  <div className="space-y-4">
                    {related.map((rp) => (
                      <Link key={rp.id} to={`/habari/${rp.slug}`} className="block group">
                        <div className="flex gap-3">
                          <div className="w-16 h-16 shrink-0">
                            <SmartImage
                              src={rp.featured_image}
                              alt={rp.title}
                              isDark={isDark}
                              heightClass="h-16"
                              roundedClass="rounded-xl"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className={`text-xs md:text-sm font-semibold group-hover:text-emerald-600 transition-colors ${isDark ? "text-white" : "text-gray-900"}`}>
                              {rp.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-1 text-[11px]">
                              <span className="bg-slate-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                                {rp.category?.name || "Bila Kundi"}
                              </span>
                              {rp.read_time ? <span className={isDark ? "text-gray-400" : "text-gray-600"}>{rp.read_time} min</span> : null}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Meta card */}
              <div className={`rounded-2xl border p-5 md:p-6 ${isDark ? "bg-gray-900/85 border-gray-800" : "bg-white/95 border-gray-100"}`}>
                <h3 className={`text-sm md:text-base font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
                  Muhtasari
                </h3>

                <div className="space-y-3 text-[12px] md:text-xs">
                  <div className="flex items-center justify-between gap-3">
                    <span className={isDark ? "text-gray-300" : "text-gray-600"}>Kundi</span>
                    <span className={isDark ? "text-gray-100" : "text-gray-900"}>{safeCategoryName}</span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className={isDark ? "text-gray-300" : "text-gray-600"}>Mwandishi</span>
                    <span className={isDark ? "text-gray-100" : "text-gray-900"}>{post.author_name}</span>
                  </div>

                  {post.published_at ? (
                    <div className="flex items-center justify-between gap-3">
                      <span className={isDark ? "text-gray-300" : "text-gray-600"}>Tarehe</span>
                      <span className={isDark ? "text-gray-100" : "text-gray-900"}>{formatDate(post.published_at)}</span>
                    </div>
                  ) : null}

                  <div className="flex items-center justify-between gap-3">
                    <span className={isDark ? "text-gray-300" : "text-gray-600"}>Views</span>
                    <span className={isDark ? "text-gray-100" : "text-gray-900"}>{Number(post.views || 0)}</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
