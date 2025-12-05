// src/pages/BibleStudies.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import useApi from '../../hooks/useApi';
import SEOHead from '../../components/SEOHead';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  BookOpen,
  Search,
  Filter,
  Play,
  FileText,
  Download,
  Clock,
  Eye,
} from 'lucide-react';

export default function BibleStudies() {
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('all');
  const [viewMode, setViewMode] = useState('seasons'); // 'seasons' or 'lessons'

  // Fetch data from API
  const { data: seasons, loading: seasonsLoading } = useApi('seasons');

  const lessonParams = {};
  if (searchTerm) lessonParams.search = searchTerm;
  if (selectedSeason !== 'all') lessonParams.series__season = selectedSeason;

  const {
    data: lessonsData,
    loading: lessonsLoading,
  } = useApi('lessons', lessonParams);

  const lessons = lessonsData?.results || [];
  const loading = seasonsLoading || lessonsLoading;

  const filteredLessons = lessons.filter((lesson) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      !search ||
      lesson.title.toLowerCase().includes(search) ||
      (lesson.description || '').toLowerCase().includes(search) ||
      (lesson.series_name || '').toLowerCase().includes(search) ||
      (lesson.bible_references || '').toLowerCase().includes(search);

    const matchesSeason =
      selectedSeason === 'all' ||
      (lesson.season_name || '')
        .toLowerCase()
        .includes(selectedSeason.toLowerCase());

    return matchesSearch && matchesSeason;
  });

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
              ? 'bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950'
              : 'bg-gradient-to-b from-slate-50 via-white to-emerald-50'
          }`}
        >
          <div className="container mx-auto px-4 md:px-6 flex items-center justify-center min-h-[400px]">
            <LoadingSpinner text="Inapakia mafunzo..." size="lg" />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead
        title="Masomo ya Biblia"
        description="Pata masomo ya kina ya Biblia yaliyopangwa kwa misimu na mfululizo"
        keywords="biblia, masomo, mafunzo, kiroho, agano, injili"
      />
      <div
        className={`min-h-screen py-10 md:py-12 transition-colors ${
          isDark
            ? 'bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950'
            : 'bg-gradient-to-b from-slate-50 via-white to-emerald-50'
        }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          {/* Header */}
          <header className="text-center mb-8 md:mb-10">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 via-sky-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md shadow-emerald-400/40">
              <BookOpen className="text-white" size={32} />
            </div>
            <h1
              className={`text-2xl md:text-3xl font-extrabold mb-3 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              Masomo ya Biblia
            </h1>
            <p
              className={`text-sm md:text-base max-w-2xl mx-auto ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              Masomo ya kina ya Biblia yaliyopangwa kwa misimu (seasons), mfululizo
              na masomo binafsi kwa ajili ya safari yako ya imani.
            </p>
          </header>

          {/* View Toggle */}
          <div className="flex justify-center mb-8">
            <div
              className={`flex rounded-full p-1 border ${
                isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
              }`}
            >
              <button
                onClick={() => setViewMode('seasons')}
                className={`px-6 py-1.5 rounded-full text-xs md:text-sm font-semibold transition-colors ${
                  viewMode === 'seasons'
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-400/40'
                    : isDark
                    ? 'text-gray-300 hover:text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Misimu
              </button>
              <button
                onClick={() => setViewMode('lessons')}
                className={`px-6 py-1.5 rounded-full text-xs md:text-sm font-semibold transition-colors ${
                  viewMode === 'lessons'
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-400/40'
                    : isDark
                    ? 'text-gray-300 hover:text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Masomo
              </button>
            </div>
          </div>

          {viewMode === 'seasons' ? (
            /* Seasons View */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {(seasons || []).map((season) => (
                <div
                  key={season.id}
                  className={`overflow-hidden rounded-2xl border shadow-sm group transition-all hover:-translate-y-1 hover:shadow-md ${
                    isDark
                      ? 'bg-gray-900/85 border-gray-800'
                      : 'bg-white/95 border-gray-100'
                  }`}
                >
                  <div className="relative">
                    <img
                      src={season.image}
                      alt={season.name}
                      className="w-full h-44 md:h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      <span className="inline-flex items-center rounded-full bg-yellow-400 text-gray-900 text-[10px] font-semibold px-2.5 py-1">
                        {season.series_count} Mfululizo
                      </span>
                    </div>
                  </div>

                  <div className="p-5 md:p-6">
                    <h3
                      className={`text-lg font-bold mb-2 ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {season.name}
                    </h3>
                    <p
                      className={`text-sm mb-4 ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    >
                      {season.description}
                    </p>

                    <div className="space-y-2 mb-4 max-h-40 overflow-y-auto pr-1">
                      {(season.series || []).map((series) => (
                        <div
                          key={series.id}
                          className={`p-3 rounded-xl border text-xs md:text-sm ${
                            isDark
                              ? 'bg-gray-900 border-gray-700'
                              : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          <h4
                            className={`font-semibold mb-0.5 ${
                              isDark ? 'text-white' : 'text-gray-900'
                            }`}
                          >
                            {series.name}
                          </h4>
                          <p
                            className={`text-[11px] mb-1 ${
                              isDark ? 'text-gray-400' : 'text-gray-600'
                            }`}
                          >
                            {series.description}
                          </p>
                          <span className="text-[11px] text-emerald-600 dark:text-emerald-300">
                            {series.lessons_count} masomo
                          </span>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setViewMode('lessons');
                        setSelectedSeason(season.name);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="w-full inline-flex items-center justify-center rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-2.5 transition-colors"
                    >
                      Anza Kusoma Masomo ya Msimu Huu
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Lessons View */
            <div>
              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                  <Search
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Tafuta masomo kwa kichwa, mfululizo au maandiko..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-full border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                      isDark
                        ? 'bg-gray-900/80 border-gray-700 text-white placeholder:text-gray-500'
                        : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-500'
                    }`}
                  />
                </div>
                <div className="relative w-full md:w-60">
                  <Filter
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}
                    size={18}
                  />
                  <select
                    value={selectedSeason}
                    onChange={(e) => setSelectedSeason(e.target.value)}
                    className={`w-full pl-10 pr-8 py-2.5 rounded-full border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                      isDark
                        ? 'bg-gray-900/80 border-gray-700 text-white'
                        : 'bg-white border-gray-200 text-gray-900'
                    }`}
                  >
                    <option value="all">Misimu Yote</option>
                    {(seasons || []).map((season) => (
                      <option key={season.id} value={season.name}>
                        {season.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Lessons Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {filteredLessons.map((lesson) => (
                  <Link
                    key={lesson.id}
                    to={`/mafunzo/${lesson.slug}`}
                    className={`overflow-hidden rounded-2xl border shadow-sm group transition-all hover:-translate-y-1 hover:shadow-md ${
                      isDark
                        ? 'bg-gray-900/85 border-gray-800'
                        : 'bg-white/95 border-gray-100'
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={lesson.featured_image}
                        alt={lesson.title}
                        className="w-full h-44 md:h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 inline-flex items-center rounded-full bg-emerald-600 text-white text-[10px] font-semibold px-2.5 py-1">
                        {lesson.series_name}
                      </div>
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
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {lesson.title}
                      </h3>
                      <p
                        className={`text-xs md:text-sm mb-4 line-clamp-3 ${
                          isDark ? 'text-gray-300' : 'text-gray-600'
                        }`}
                      >
                        {lesson.description}
                      </p>

                      <div className="space-y-1.5 mb-4 text-[11px] md:text-xs">
                        <div className="flex items-center">
                          <BookOpen
                            className="text-emerald-500 mr-2"
                            size={14}
                          />
                          <span
                            className={
                              isDark ? 'text-gray-400' : 'text-gray-500'
                            }
                          >
                            {lesson.bible_references}
                          </span>
                        </div>
                        {lesson.duration_minutes && (
                          <div className="flex items-center">
                            <Clock
                              className="text-sky-500 mr-2"
                              size={14}
                            />
                            <span
                              className={
                                isDark ? 'text-gray-400' : 'text-gray-500'
                              }
                            >
                              {lesson.duration_minutes} dakika
                            </span>
                          </div>
                        )}
                        <div className="flex items-center">
                          <Eye
                            className="text-yellow-400 mr-2"
                            size={14}
                          />
                          <span
                            className={
                              isDark ? 'text-gray-400' : 'text-gray-500'
                            }
                          >
                            {lesson.views} mara
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] md:text-xs">
                        <span
                          className={
                            isDark ? 'text-gray-400' : 'text-gray-500'
                          }
                        >
                          Somo #{lesson.order}
                        </span>
                        <div className="flex items-center text-emerald-600 dark:text-emerald-300">
                          <span className="font-medium">Anza Kusoma</span>
                          <BookOpen size={14} className="ml-1" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {filteredLessons.length === 0 && (
                <div
                  className={`mt-8 text-center rounded-2xl border px-6 py-10 ${
                    isDark
                      ? 'bg-gray-900/85 border-gray-800'
                      : 'bg-white/95 border-gray-100'
                  }`}
                >
                  <BookOpen
                    className={`mx-auto mb-4 ${
                      isDark ? 'text-gray-500' : 'text-gray-400'
                    }`}
                    size={40}
                  />
                  <p
                    className={`text-sm md:text-base ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}
                  >
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
