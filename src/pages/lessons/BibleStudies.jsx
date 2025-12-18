// src/pages/lessons/BibleStudies.jsx
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import useApi from "../../hooks/useApi";
import SEOHead from "../../components/SEOHead";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
  BookOpen,
  Search,
  Filter,
  Play,
  FileText,
  Download,
  Clock,
  Eye,
  Layers,
  RefreshCw,
} from "lucide-react";

function normalizeList(payload) {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.results)) return payload.results;
  return [];
}

function safeText(v) {
  return (v || "").toString();
}

export default function BibleStudies() {
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeasonName, setSelectedSeasonName] = useState("all");
  const [viewMode, setViewMode] = useState("seasons"); // 'seasons' | 'lessons'

  // Public endpoints (no auth)
  const {
    data: seasonsRaw,
    loading: seasonsLoading,
    error: seasonsError,
    refetch: refetchSeasons,
  } = useApi("seasons");

  const {
    data: lessonsRaw,
    loading: lessonsLoading,
    error: lessonsError,
    refetch: refetchLessons,
  } = useApi("lessons");

  const seasons = useMemo(() => normalizeList(seasonsRaw), [seasonsRaw]);
  const lessons = useMemo(() => normalizeList(lessonsRaw), [lessonsRaw]);

  const loading = seasonsLoading || lessonsLoading;
  const error = seasonsError || lessonsError;

  const search = searchTerm.toLowerCase().trim();

  const filteredLessons = useMemo(() => {
    return lessons
      .filter((lesson) => {
        const title = safeText(lesson.title).toLowerCase();
        const desc = safeText(lesson.description).toLowerCase();
        const series = safeText(lesson.series_name).toLowerCase();
        const refs = safeText(lesson.bible_references).toLowerCase();
        const seasonName = safeText(lesson.season_name);

        const matchesSearch =
          !search || title.includes(search) || desc.includes(search) || series.includes(search) || refs.includes(search);

        const matchesSeason =
          selectedSeasonName === "all" ||
          seasonName.toLowerCase().includes(String(selectedSeasonName).toLowerCase());

        return matchesSearch && matchesSeason;
      })
      .sort((a, b) => {
        const oa = Number(a.order || 0);
        const ob = Number(b.order || 0);
        return oa - ob;
      });
  }, [lessons, search, selectedSeasonName]);

  if (loading) {
    return (
      <>
        <SEOHead
          title="Masomo ya Biblia"
          description="Pata masomo ya kina ya Biblia yaliyopangwa kwa misimu na mfululizo"
          keywords="biblia, masomo, mafunzo, kiroho, agano, injili"
        />
        <div
          className={`min-h-screen py-12 transition-colors ${
            isDark
              ? "bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950"
              : "bg-gradient-to-b from-slate-50 via-white to-emerald-50"
          }`}
        >
          <div className="container mx-auto px-4 md:px-6 flex items-center justify-center min-h-[420px]">
            <LoadingSpinner text="Inapakia mafunzo..." size="lg" />
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <SEOHead title="Masomo ya Biblia" description="Masomo ya Biblia" />
        <div
          className={`min-h-screen py-12 transition-colors ${
            isDark
              ? "bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950"
              : "bg-gradient-to-b from-slate-50 via-white to-emerald-50"
          }`}
        >
          <div className="container mx-auto px-4 md:px-6">
            <div
              className={`rounded-2xl border p-6 md:p-8 text-center ${
                isDark ? "bg-gray-900/85 border-gray-800" : "bg-white/95 border-gray-100"
              }`}
            >
              <p className="text-red-500 text-sm md:text-base mb-4">Imeshindikana kupakia masomo/misimu.</p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    refetchSeasons();
                    refetchLessons();
                  }}
                  className="inline-flex items-center justify-center rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 text-sm font-semibold transition-colors"
                >
                  <RefreshCw size={16} className="mr-2" />
                  Pakia Upya
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead
        title="Masomo ya Biblia"
        description="Pata masomo ya kina ya Biblia yaliyopangwa kwa misimu (seasons) na mfululizo"
        keywords="biblia, masomo, mafunzo, kiroho, agano, injili"
      />
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
              <BookOpen className="text-white" size={32} />
            </div>
            <h1 className={`text-2xl md:text-3xl font-extrabold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
              Masomo ya Biblia
            </h1>
            <p className={`text-sm md:text-base max-w-2xl mx-auto ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              Masomo ya kina ya Biblia yaliyopangwa kwa misimu (seasons), mfululizo na masomo binafsi kwa ajili ya safari yako ya imani.
            </p>
          </header>

          {/* View Toggle */}
          <div className="flex justify-center mb-8">
            <div className={`flex rounded-full p-1 border ${isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}>
              <button
                onClick={() => setViewMode("seasons")}
                className={`px-6 py-1.5 rounded-full text-xs md:text-sm font-semibold transition-colors ${
                  viewMode === "seasons"
                    ? "bg-emerald-600 text-white shadow-sm shadow-emerald-400/40"
                    : isDark
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Misimu
              </button>
              <button
                onClick={() => setViewMode("lessons")}
                className={`px-6 py-1.5 rounded-full text-xs md:text-sm font-semibold transition-colors ${
                  viewMode === "lessons"
                    ? "bg-emerald-600 text-white shadow-sm shadow-emerald-400/40"
                    : isDark
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Masomo
              </button>
            </div>
          </div>

          {viewMode === "seasons" ? (
            // Seasons View
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {seasons.map((season) => {
                const seasonKey = season.slug || season.name;
                const cover = season.image || "/images/MasomoYaBiblia.jpg";

                return (
                  <div
                    key={seasonKey}
                    className={`overflow-hidden rounded-2xl border shadow-sm group transition-all hover:-translate-y-1 hover:shadow-md ${
                      isDark ? "bg-gray-900/85 border-gray-800" : "bg-white/95 border-gray-100"
                    }`}
                  >
                    <div className="relative">
                      {cover ? (
                        <img
                          src={cover}
                          alt={season.name}
                          className="w-full h-44 md:h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="h-44 md:h-48 bg-gradient-to-br from-emerald-200 via-sky-200 to-emerald-100 dark:from-emerald-900/25 dark:via-sky-900/25 dark:to-emerald-900/25" />
                      )}

                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        <span className="inline-flex items-center rounded-full bg-yellow-400 text-gray-900 text-[10px] font-semibold px-2.5 py-1">
                          <Layers size={12} className="mr-1" />
                          {season.series_count ?? 0} Mfululizo
                        </span>
                      </div>
                    </div>

                    <div className="p-5 md:p-6">
                      <h3 className={`text-lg font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                        {season.name}
                      </h3>

                      {season.description ? (
                        <p className={`text-sm mb-4 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                          {season.description}
                        </p>
                      ) : null}

                      <div className="space-y-2 mb-4 max-h-44 overflow-y-auto pr-1">
                        {(season.series || []).map((series) => (
                          <div
                            key={series.slug || series.name}
                            className={`p-3 rounded-xl border text-xs md:text-sm ${
                              isDark ? "bg-gray-900 border-gray-700" : "bg-slate-50 border-slate-200"
                            }`}
                          >
                            <h4 className={`font-semibold mb-0.5 ${isDark ? "text-white" : "text-gray-900"}`}>
                              {series.name}
                            </h4>

                            {series.description ? (
                              <p className={`text-[11px] mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                                {series.description}
                              </p>
                            ) : null}

                            <span className="text-[11px] text-emerald-600 dark:text-emerald-300">
                              {series.lessons_count ?? 0} masomo
                            </span>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setViewMode("lessons");
                          setSelectedSeasonName(season.name);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="w-full inline-flex items-center justify-center rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-2.5 transition-colors"
                      >
                        Anza Kusoma Masomo ya Msimu Huu
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // Lessons View
            <div>
              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                  <Search
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDark ? "text-gray-400" : "text-gray-500"}`}
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Tafuta masomo kwa kichwa, mfululizo au maandiko..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-full border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                      isDark
                        ? "bg-gray-900/80 border-gray-700 text-white placeholder:text-gray-500"
                        : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-500"
                    }`}
                  />
                </div>

                <div className="relative w-full md:w-64">
                  <Filter
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDark ? "text-gray-400" : "text-gray-500"}`}
                    size={18}
                  />
                  <select
                    value={selectedSeasonName}
                    onChange={(e) => setSelectedSeasonName(e.target.value)}
                    className={`w-full pl-10 pr-8 py-2.5 rounded-full border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                      isDark ? "bg-gray-900/80 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900"
                    }`}
                  >
                    <option value="all">Misimu Yote</option>
                    {seasons.map((season) => (
                      <option key={season.slug || season.name} value={season.name}>
                        {season.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Lessons Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {filteredLessons.map((lesson) => {
                  const cardKey = lesson.slug || lesson.title;
                  const cover = lesson.featured_image || "/images/MasomoYaBiblia.jpg";

                  return (
                    <Link
                      key={cardKey}
                      to={`/mafunzo/${lesson.slug}`}
                      className={`overflow-hidden rounded-2xl border shadow-sm group transition-all hover:-translate-y-1 hover:shadow-md ${
                        isDark ? "bg-gray-900/85 border-gray-800" : "bg-white/95 border-gray-100"
                      }`}
                    >
                      <div className="relative">
                        {cover ? (
                          <img
                            src={cover}
                            alt={lesson.title}
                            className="w-full h-44 md:h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        ) : (
                          <div className="h-44 md:h-48 bg-gradient-to-br from-emerald-200 via-sky-200 to-emerald-100 dark:from-emerald-900/25 dark:via-sky-900/25 dark:to-emerald-900/25" />
                        )}

                        {lesson.series_name ? (
                          <div className="absolute top-3 left-3 inline-flex items-center rounded-full bg-emerald-600 text-white text-[10px] font-semibold px-2.5 py-1">
                            {lesson.series_name}
                          </div>
                        ) : null}

                        <div className="absolute bottom-3 right-3 flex space-x-1.5">
                          {lesson.has_video && (
                            <div className="bg-sky-600 text-white p-1.5 rounded-full">
                              <Play size={12} />
                            </div>
                          )}
                          {lesson.has_pdf && (
                            <div className="bg-emerald-600 text-white p-1.5 rounded-full">
                              <Download size={12} />
                            </div>
                          )}
                          {lesson.has_audio && (
                            <div className="bg-yellow-400 text-gray-900 p-1.5 rounded-full">
                              <FileText size={12} />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="p-5 md:p-6">
                        <h3
                          className={`text-base md:text-lg font-bold mb-2 group-hover:text-emerald-600 transition-colors ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {lesson.title}
                        </h3>

                        {lesson.description ? (
                          <p className={`text-xs md:text-sm mb-4 line-clamp-3 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                            {lesson.description}
                          </p>
                        ) : null}

                        <div className="space-y-1.5 mb-4 text-[11px] md:text-xs">
                          {lesson.bible_references ? (
                            <div className="flex items-center">
                              <BookOpen className="text-emerald-500 mr-2" size={14} />
                              <span className={isDark ? "text-gray-400" : "text-gray-500"}>{lesson.bible_references}</span>
                            </div>
                          ) : null}

                          {lesson.duration_minutes ? (
                            <div className="flex items-center">
                              <Clock className="text-sky-500 mr-2" size={14} />
                              <span className={isDark ? "text-gray-400" : "text-gray-500"}>{lesson.duration_minutes} dakika</span>
                            </div>
                          ) : null}

                          <div className="flex items-center">
                            <Eye className="text-yellow-400 mr-2" size={14} />
                            <span className={isDark ? "text-gray-400" : "text-gray-500"}>{lesson.views ?? 0} mara</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[11px] md:text-xs">
                          <span className={isDark ? "text-gray-400" : "text-gray-500"}>Somo #{lesson.order ?? "-"}</span>
                          <div className="flex items-center text-emerald-600 dark:text-emerald-300">
                            <span className="font-medium">Anza Kusoma</span>
                            <BookOpen size={14} className="ml-1" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {filteredLessons.length === 0 && (
                <div
                  className={`mt-8 text-center rounded-2xl border px-6 py-10 ${
                    isDark ? "bg-gray-900/85 border-gray-800" : "bg-white/95 border-gray-100"
                  }`}
                >
                  <BookOpen className={`mx-auto mb-4 ${isDark ? "text-gray-500" : "text-gray-400"}`} size={40} />
                  <p className={`text-sm md:text-base ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                    Hakuna masomo yaliyopatikana kwa vigezo ulivyotafuta.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
