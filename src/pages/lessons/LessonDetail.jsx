// src/pages/lessons/LessonDetail.jsx
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import useApi from "../../hooks/useApi";
import SEOHead from "../../components/SEOHead";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
  BookOpen,
  Play,
  Download,
  FileText,
  ArrowLeft,
  Clock,
  Eye,
  Share2,
  ExternalLink,
  RefreshCw,
} from "lucide-react";

function getYouTubeId(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.replace("/", "") || null;
    if (u.hostname.includes("youtube.com")) return u.searchParams.get("v");
    return null;
  } catch {
    // basic fallback
    const m1 = String(url).match(/v=([a-zA-Z0-9_-]{6,})/);
    if (m1?.[1]) return m1[1];
    const m2 = String(url).match(/youtu\.be\/([a-zA-Z0-9_-]{6,})/);
    if (m2?.[1]) return m2[1];
    return null;
  }
}

export default function LessonDetail() {
  const { slug } = useParams();
  const { isDark } = useTheme();

  const { data: lesson, loading, error, refetch } = useApi(`/lessons/${slug}/`);

  const [activeTab, setActiveTab] = useState("content");
  const [toast, setToast] = useState("");

  const ytId = useMemo(() => getYouTubeId(lesson?.video_url), [lesson?.video_url]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("sw-TZ", { year: "numeric", month: "long", day: "numeric" });
  };

  const resourceTabs = useMemo(() => {
    const tabs = [{ key: "content", label: "Maudhui", icon: FileText }];

    if (lesson?.has_video) tabs.push({ key: "video", label: "Video", icon: Play });
    if (lesson?.has_pdf) tabs.push({ key: "pdf", label: "PDF", icon: Download });
    if (lesson?.has_audio) tabs.push({ key: "audio", label: "Audio", icon: FileText });

    return tabs;
  }, [lesson?.has_audio, lesson?.has_pdf, lesson?.has_video]);

  const showToast = (msg) => {
    setToast(msg);
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(""), 2200);
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const title = lesson?.title || "Somo";
    try {
      if (navigator.share) {
        await navigator.share({ title, url: shareUrl });
        return;
      }
    } catch {
      // ignore
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast("Link imenakiliwa.");
    } catch {
      showToast("Imeshindikana kunakili link.");
    }
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen py-12 transition-colors ${
          isDark
            ? "bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950"
            : "bg-gradient-to-b from-slate-50 via-white to-emerald-50"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-center min-h-[420px]">
          <LoadingSpinner text="Inapakia somo..." size="lg" />
        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div
        className={`min-h-screen py-12 transition-colors ${
          isDark
            ? "bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950"
            : "bg-gradient-to-b from-slate-50 via-white to-emerald-50"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div
            className={`text-center rounded-2xl border px-6 py-10 ${
              isDark ? "bg-gray-900/85 border-gray-800" : "bg-white/95 border-gray-100"
            }`}
          >
            <p className="text-red-500 text-sm md:text-base mb-4">
              {error?.message || "Somo halijapatikana"}
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link
                to="/mafunzo"
                className="inline-flex items-center text-sm font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-300"
              >
                <ArrowLeft size={16} className="mr-1.5" />
                Rudi kwenye Mafunzo
              </Link>
              <button
                onClick={refetch}
                className="inline-flex items-center rounded-full bg-emerald-600 px-4 py-2 text-xs md:text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
              >
                <RefreshCw size={14} className="mr-1.5" />
                Jaribu tena
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const cover = lesson.featured_image || "/images/MasomoYaBiblia.jpg";

  return (
    <>
      <SEOHead title={`${lesson.title} | Masomo ya Biblia`} description={lesson.description || lesson.title} />

      <div
        className={`min-h-screen py-10 md:py-12 transition-colors ${
          isDark
            ? "bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950"
            : "bg-gradient-to-b from-slate-50 via-white to-emerald-50"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between gap-3 mb-6 md:mb-8">
            <Link
              to="/mafunzo"
              className="inline-flex items-center text-emerald-600 hover:text-emerald-700 dark:text-emerald-300 text-xs md:text-sm transition-colors"
            >
              <ArrowLeft size={16} className="mr-1.5" />
              Rudi kwenye Mafunzo
            </Link>

            <button
              onClick={handleShare}
              className="inline-flex items-center rounded-full border px-3 py-2 text-xs md:text-sm font-semibold transition-colors
                         border-emerald-200 text-emerald-700 hover:bg-emerald-50
                         dark:border-gray-700 dark:text-emerald-200 dark:hover:bg-gray-900"
            >
              <Share2 size={16} className="mr-1.5" />
              Shiriki
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
            {/* Main */}
            <div className="lg:col-span-3">
              <div
                className={`rounded-2xl border shadow-sm overflow-hidden ${
                  isDark ? "bg-gray-900/85 border-gray-800" : "bg-white/95 border-gray-100"
                }`}
              >
                {/* Hero */}
                <div className="relative">
                  <img
                    src={cover}
                    alt={lesson.title}
                    className="w-full h-56 md:h-72 object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {lesson?.series?.name ? (
                        <span className="inline-flex items-center rounded-full bg-emerald-600 text-white text-[10px] font-semibold px-2.5 py-1">
                          {lesson.series.name}
                        </span>
                      ) : null}

                      <span className="inline-flex items-center rounded-full bg-black/60 text-gray-100 text-[10px] font-medium px-2.5 py-1">
                        Somo #{lesson.order ?? "-"}
                      </span>
                    </div>

                    <h1 className="text-white text-xl md:text-2xl lg:text-3xl font-extrabold leading-snug">
                      {lesson.title}
                    </h1>
                  </div>
                </div>

                <div className="p-5 md:p-7">
                  {/* Meta */}
                  <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] md:text-xs mb-5">
                    <div className="flex flex-wrap items-center gap-3">
                      {lesson.bible_references ? (
                        <span className="flex items-center">
                          <BookOpen size={16} className="mr-1 text-emerald-500" />
                          <span className={isDark ? "text-gray-300" : "text-gray-700"}>{lesson.bible_references}</span>
                        </span>
                      ) : null}

                      {lesson.duration_minutes ? (
                        <span className="flex items-center">
                          <Clock size={16} className="mr-1 text-sky-500" />
                          <span className={isDark ? "text-gray-300" : "text-gray-700"}>{lesson.duration_minutes} dakika</span>
                        </span>
                      ) : null}

                      <span className="flex items-center">
                        <Eye size={16} className="mr-1 text-yellow-400" />
                        <span className={isDark ? "text-gray-300" : "text-gray-700"}>{lesson.views ?? 0} mara</span>
                      </span>
                    </div>

                    <div className={isDark ? "text-gray-400" : "text-gray-500"}>
                      Imewekwa: {formatDate(lesson.created_at)}
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className={`flex border-b text-xs md:text-sm ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                    {resourceTabs.map(({ key, label, icon: Icon }) => (
                      <button
                        key={key}
                        onClick={() => setActiveTab(key)}
                        className={`flex items-center px-4 md:px-5 py-2 font-semibold transition-colors ${
                          activeTab === key
                            ? "border-b-2 border-emerald-600 text-emerald-600"
                            : isDark
                            ? "text-gray-400 hover:text-white"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        <Icon size={16} className="mr-1.5" />
                        {label}
                      </button>
                    ))}
                  </div>

                  {/* Content */}
                  <div className="min-h-[320px] pt-5">
                    {activeTab === "content" && (
                      <>
                        {lesson.description ? (
                          <p className={`text-sm md:text-base mb-4 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                            {lesson.description}
                          </p>
                        ) : null}

                        {lesson.content ? (
                          <div
                            className={`prose prose-sm md:prose-base max-w-none ${isDark ? "prose-invert" : ""}`}
                            dangerouslySetInnerHTML={{ __html: lesson.content }}
                          />
                        ) : (
                          <div className={`rounded-xl border p-4 ${isDark ? "border-gray-800 text-gray-300" : "border-gray-200 text-gray-600"}`}>
                            Hakuna maudhui ya somo yaliyoandikwa bado.
                          </div>
                        )}
                      </>
                    )}

                    {activeTab === "video" && lesson.has_video && (
                      <div className="space-y-3">
                        {ytId ? (
                          <div className="aspect-video">
                            <iframe
                              src={`https://www.youtube.com/embed/${ytId}`}
                              title={lesson.title}
                              className="w-full h-full rounded-xl"
                              allowFullScreen
                            />
                          </div>
                        ) : lesson.video_url ? (
                          <a
                            href={lesson.video_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center rounded-lg border px-4 py-2.5 text-sm font-semibold
                                       border-emerald-200 text-emerald-700 hover:bg-emerald-50
                                       dark:border-gray-700 dark:text-emerald-200 dark:hover:bg-gray-900"
                          >
                            <ExternalLink size={16} className="mr-2" />
                            Fungua Video
                          </a>
                        ) : (
                          <div className={`rounded-xl border p-4 ${isDark ? "border-gray-800 text-gray-300" : "border-gray-200 text-gray-600"}`}>
                            Hakuna video kwa somo hili.
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === "pdf" && lesson.has_pdf && (
                      <div className="text-center py-10">
                        <Download className="mx-auto mb-4 text-sky-600" size={48} />
                        <h3 className={`text-lg md:text-xl font-bold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
                          PDF ya Somo
                        </h3>
                        <p className={`text-xs md:text-sm mb-4 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                          Fungua au pakua PDF na kuisoma hata ukiwa offline.
                        </p>
                        {lesson.pdf_file ? (
                          <a
                            href={lesson.pdf_file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 text-sm font-semibold transition-colors"
                          >
                            <Download size={16} className="mr-2" />
                            Fungua / Pakua PDF
                          </a>
                        ) : null}
                      </div>
                    )}

                    {activeTab === "audio" && lesson.has_audio && (
                      <div className="text-center py-10">
                        <FileText className="mx-auto mb-4 text-yellow-500" size={48} />
                        <h3 className={`text-lg md:text-xl font-bold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
                          Audio ya Somo
                        </h3>
                        <p className={`text-xs md:text-sm mb-4 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                          Sikiliza au pakua audio ya somo.
                        </p>
                        {lesson.audio_file ? (
                          <a
                            href={lesson.audio_file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center rounded-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-6 py-2.5 text-sm font-semibold transition-colors"
                          >
                            <Download size={16} className="mr-2" />
                            Fungua / Pakua Audio
                          </a>
                        ) : null}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-1 space-y-5 md:space-y-6">
              <div className={`rounded-2xl border p-5 ${isDark ? "bg-gray-900/85 border-gray-800" : "bg-white/95 border-gray-100"}`}>
                <h3 className={`text-sm md:text-base font-bold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
                  Maelezo ya Somo
                </h3>

                <div className="space-y-3 text-[12px] md:text-xs">
                  <div>
                    <p className={`font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>Mfululizo:</p>
                    <p className={isDark ? "text-gray-100" : "text-gray-800"}>{lesson?.series?.name || "-"}</p>
                  </div>

                  <div>
                    <p className={`font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>Msimu:</p>
                    <p className={isDark ? "text-gray-100" : "text-gray-800"}>{lesson?.series?.season_name || "-"}</p>
                  </div>

                  <div>
                    <p className={`font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>Maandiko:</p>
                    <p className={isDark ? "text-gray-100" : "text-gray-800"}>{lesson.bible_references || "-"}</p>
                  </div>

                  {lesson.duration_minutes ? (
                    <div>
                      <p className={`font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>Muda:</p>
                      <p className={isDark ? "text-gray-100" : "text-gray-800"}>{lesson.duration_minutes} dakika</p>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className={`rounded-2xl border p-5 ${isDark ? "bg-gray-900/85 border-gray-800" : "bg-white/95 border-gray-100"}`}>
                <h3 className={`text-sm md:text-base font-bold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
                  Rasilimali
                </h3>

                <div className="space-y-3 text-sm">
                  {lesson.has_video && (
                    <button
                      onClick={() => setActiveTab("video")}
                      className="w-full flex items-center justify-center rounded-lg bg-sky-600 hover:bg-sky-700 text-white py-2.5 transition-colors"
                    >
                      <Play size={16} className="mr-2" />
                      Tazama Video
                    </button>
                  )}

                  {lesson.has_pdf && lesson.pdf_file && (
                    <a
                      href={lesson.pdf_file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 transition-colors"
                    >
                      <Download size={16} className="mr-2" />
                      Fungua / Pakua PDF
                    </a>
                  )}

                  {lesson.has_audio && lesson.audio_file && (
                    <a
                      href={lesson.audio_file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center rounded-lg bg-yellow-400 hover:bg-yellow-500 text-gray-900 py-2.5 font-semibold transition-colors"
                    >
                      <Download size={16} className="mr-2" />
                      Fungua / Pakua Audio
                    </a>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* Toast */}
        {toast ? (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <div className="rounded-full bg-gray-900 text-white px-4 py-2 text-xs shadow-lg border border-gray-800">
              {toast}
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
