// src/pages/lessons/BibleStudies.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useApi } from '../../hooks/useApi';
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
  Star,
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

  const { data: lessonsData, loading: lessonsLoading } = useApi('lessons', lessonParams);

  const lessons = lessonsData?.results || [];
  const loading = seasonsLoading || lessonsLoading;

  const filteredLessons = lessons.filter((lesson) => {
    const matchesSearch =
      lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeason =
      selectedSeason === 'all' ||
      lesson.season_name.toLowerCase().includes(selectedSeason.toLowerCase());
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
            isDark ? 'bg-gray-900' : 'bg-gray-50'
          }`}
        >
          <div className="container mx-auto px-6 flex items-center justify-center min-h-[400px]">
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
        className={`min-h-screen py-12 transition-colors ${
          isDark ? 'bg-gray-900' : 'bg-gray-50'
        }`}
      >
        <div className="container mx-auto px-6">
          {/* Header */}
          <header className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="text-white" size={32} />
            </div>
            <h1
              className={`text-4xl font-bold mb-4 ${
                isDark ? 'text-white' : 'text-gray-800'
              }`}
            >
              Masomo ya Biblia
            </h1>
            <p
              className={`text-lg max-w-2xl mx-auto ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              Pata masomo ya kina ya Biblia yaliyopangwa kwa misimu na mfululizo
            </p>
          </header>

          {/* View Toggle */}
          <div className="flex justify-center mb-8">
            <div
              className={`flex rounded-lg p-1 ${
                isDark ? 'bg-gray-800' : 'bg-gray-200'
              }`}
            >
              <button
                onClick={() => setViewMode('seasons')}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  viewMode === 'seasons'
                    ? 'bg-green-600 text-white'
                    : isDark
                    ? 'text-gray-300 hover:text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Misimu
              </button>
              <button
                onClick={() => setViewMode('lessons')}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  viewMode === 'lessons'
                    ? 'bg-green-600 text-white'
                    : isDark
                    ? 'text-gray-300 hover:text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Masomo
              </button>
            </div>
          </div>

          {viewMode === 'seasons' ? (
            /* Seasons View */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {(seasons || []).map((season) => (
                <div
                  key={season.id}
                  className={`card overflow-hidden group hover:scale-105 transition-transform ${
                    isDark ? 'bg-gray-800' : 'bg-white'
                  }`}
                >
                  <div className="relative">
                    <img
                      src={season.image}
                      alt={season.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                      {season.series_count} Mfululizo
                    </div>
                  </div>

                  <div className="p-6">
                    <h3
                      className={`text-xl font-bold mb-3 ${
                        isDark ? 'text-white' : 'text-gray-800'
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

                    <div className="space-y-2 mb-4">
                      {season.series.map((series) => (
                        <div
                          key={series.id}
                          className={`p-3 rounded-lg ${
                            isDark ? 'bg-gray-700' : 'bg-gray-50'
                          }`}
                        >
                          <h4
                            className={`font-semibold ${
                              isDark ? 'text-white' : 'text-gray-800'
                            }`}
                          >
                            {series.name}
                          </h4>
                          <p
                            className={`text-xs ${
                              isDark ? 'text-gray-400' : 'text-gray-600'
                            }`}
                          >
                            {series.description}
                          </p>
                          <span className="text-xs text-green-600">
                            {series.lessons_count} masomo
                          </span>
                        </div>
                      ))}
                    </div>

                    <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors">
                      Anza Kusoma
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
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Tafuta masomo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      isDark
                        ? 'bg-gray-800 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
                <div className="relative">
                  <Filter
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}
                    size={20}
                  />
                  <select
                    value={selectedSeason}
                    onChange={(e) => setSelectedSeason(e.target.value)}
                    className={`pl-10 pr-8 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      isDark
                        ? 'bg-gray-800 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredLessons.map((lesson) => (
                  <Link
                    key={lesson.id}
                    to={`/mafunzo/${lesson.slug}`}
                    className={`card overflow-hidden group hover:scale-105 transition-transform ${
                      isDark ? 'bg-gray-800' : 'bg-white'
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={lesson.featured_image}
                        alt={lesson.title}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                        {lesson.series_name}
                      </div>
                      <div className="absolute bottom-4 right-4 flex space-x-1">
                        {lesson.has_video && (
                          <div className="bg-red-600 text-white p-1 rounded">
                            <Play size={12} />
                          </div>
                        )}
                        {lesson.has_pdf && (
                          <div className="bg-blue-600 text-white p-1 rounded">
                            <Download size={12} />
                          </div>
                        )}
                        {lesson.has_audio && (
                          <div className="bg-purple-600 text-white p-1 rounded">
                            <FileText size={12} />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-6">
                      <h3
                        className={`text-lg font-bold mb-3 group-hover:text-green-600 transition-colors ${
                          isDark ? 'text-white' : 'text-gray-800'
                        }`}
                      >
                        {lesson.title}
                      </h3>
                      <p
                        className={`text-sm mb-4 ${
                          isDark ? 'text-gray-300' : 'text-gray-600'
                        }`}
                      >
                        {lesson.description}
                      </p>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-xs">
                          <BookOpen className="text-green-600 mr-2" size={14} />
                          <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                            {lesson.bible_references}
                          </span>
                        </div>
                        {lesson.duration_minutes && (
                          <div className="flex items-center text-xs">
                            <Clock className="text-green-600 mr-2" size={14} />
                            <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                              {lesson.duration_minutes} dakika
                            </span>
                          </div>
                        )}
                        <div className="flex items-center text-xs">
                          <Eye className="text-green-600 mr-2" size={14} />
                          <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                            {lesson.views} mara
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs ${
                            isDark ? 'text-gray-400' : 'text-gray-500'
                          }`}
                        >
                          Somo #{lesson.order}
                        </span>
                        <div className="flex items-center text-green-600">
                          <span className="text-sm font-medium">Anza Kusoma</span>
                          <BookOpen size={16} className="ml-1" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {filteredLessons.length === 0 && (
                <div
                  className={`text-center card p-8 ${
                    isDark ? 'bg-gray-800' : 'bg-white'
                  }`}
                >
                  <BookOpen
                    className={`mx-auto mb-4 ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}
                    size={48}
                  />
                  <p
                    className={`text-lg ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    Hakuna masomo yaliyopatikana
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
