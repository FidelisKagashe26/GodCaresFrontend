// src/pages/news/News.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useApi } from '../../hooks/useApi';
import { formatDate } from '../../utils/helpers';
import SEOHead from '../../components/SEOHead';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  Newspaper,
  Search,
  Filter,
  Calendar,
  User,
  Eye,
  ArrowRight,
  Star,
} from 'lucide-react';

export default function News() {
  const { isDark } = useTheme();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  // =================== API CALLS ===================
  const apiParams = {};
  if (searchTerm) apiParams.search = searchTerm;
  if (selectedCategory !== 'all') apiParams.category = selectedCategory;
  if (currentPage > 1) apiParams.page = currentPage;

  const {
    data: postsData,
    loading,
    error,
  } = useApi('posts', apiParams);
  const { data: categoriesData } = useApi('categories');

  // error object => string (ili kuepuka "Objects are not valid as a React child")
  const errorMessage =
    typeof error === 'string'
      ? error
      : error?.message || 'Hitilafu katika kupakia habari.';

  const posts = Array.isArray(postsData?.results)
    ? postsData.results
    : Array.isArray(postsData)
    ? postsData
    : [];

  const categories = [
    { id: 'all', name: 'Yote' },
    ...(categoriesData || []).map((cat) => ({
      id: cat.slug,
      name: cat.name,
    })),
  ];

  // =================== FILTERING & PAGINATION ===================
  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredPosts = posts.filter((post) => {
    const s = normalizedSearch;
    const matchesSearch =
      !s ||
      post.title.toLowerCase().includes(s) ||
      post.excerpt.toLowerCase().includes(s);

    const matchesCategory =
      selectedCategory === 'all' ||
      post.category?.slug === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPosts.length / postsPerPage) || 1,
  );
  const safePage = Math.min(Math.max(currentPage, 1), totalPages);
  const startIndex = (safePage - 1) * postsPerPage;
  const currentPosts = filteredPosts.slice(
    startIndex,
    startIndex + postsPerPage,
  );

  const featured = filteredPosts.filter((p) => p.featured).slice(0, 2);

  // =================== LOADING STATE ===================
  if (loading) {
    return (
      <>
        <SEOHead
          title="Habari & Vipengele"
          description="Soma makala za kiroho, habari za jamii, na vipengele vya kujenga imani"
          keywords="habari, makala, kiroho, imani, jamii, Tanzania"
        />
        <div
          className={`min-h-screen py-12 transition-colors ${
            isDark
              ? 'bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950'
              : 'bg-gradient-to-b from-slate-50 via-white to-emerald-50'
          }`}
        >
          <div className="container mx-auto px-4 md:px-6 flex items-center justify-center min-h-[400px]">
            <LoadingSpinner text="Inapakia habari..." size="lg" />
          </div>
        </div>
      </>
    );
  }

  // =================== ERROR STATE ===================
  if (error) {
    return (
      <>
        <SEOHead
          title="Habari & Vipengele"
          description="Soma makala za kiroho, habari za jamii, na vipengele vya kujenga imani"
          keywords="habari, makala, kiroho, imani, jamii, Tanzania"
        />
        <div
          className={`min-h-screen py-12 transition-colors ${
            isDark
              ? 'bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950'
              : 'bg-gradient-to-b from-slate-50 via-white to-emerald-50'
          }`}
        >
          <div className="container mx-auto px-4 md:px-6">
            <div
              className={`text-center rounded-2xl border px-6 py-10 ${
                isDark
                  ? 'bg-gray-900/85 border-gray-800'
                  : 'bg-white/95 border-gray-100'
              }`}
            >
              <p className="text-red-600 text-base md:text-lg">
                {errorMessage}
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // =================== NORMAL VIEW ===================
  return (
    <>
      <SEOHead
        title="Habari & Vipengele"
        description="Soma makala za kiroho, habari za jamii, na vipengele vya kujenga imani"
        keywords="habari, makala, kiroho, imani, jamii, Tanzania"
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
              <Newspaper className="text-white" size={32} />
            </div>
            <h1
              className={`text-2xl md:text-3xl font-extrabold mb-3 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              Habari & Vipengele
            </h1>
            <p
              className={`text-sm md:text-base max-w-2xl mx-auto ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              Soma makala za kiroho, habari za jamii na vipengele vya
              kujenga imani na maisha ya kila siku.
            </p>

            {/* Result meta info */}
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] md:text-xs border border-emerald-500/40 bg-emerald-50/70 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>
                {filteredPosts.length} makala
                {normalizedSearch && ` kwa "${searchTerm}"`}
              </span>
            </div>
          </header>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Search input */}
            <div className="relative flex-1">
              <Search
                className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}
                size={18}
              />
              <input
                type="text"
                placeholder="Tafuta habari au makala..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className={`w-full pl-10 pr-4 py-2.5 rounded-full border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  isDark
                    ? 'bg-gray-900/80 border-gray-700 text-white placeholder:text-gray-500'
                    : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-500'
                }`}
              />
            </div>

            {/* Category filter */}
            <div className="relative w-full md:w-64">
              <Filter
                className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}
                size={18}
              />
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className={`w-full pl-10 pr-8 py-2.5 rounded-full border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  isDark
                    ? 'bg-gray-900/80 border-gray-700 text-white'
                    : 'bg-white border-gray-200 text-gray-900'
                }`}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Featured Posts (Habari Maalum) */}
          {safePage === 1 && featured.length > 0 && (
            <section className="mb-10 md:mb-12">
              <h2
                className={`text-lg md:text-2xl font-bold mb-5 flex items-center ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                <Star className="mr-2 text-yellow-400" size={20} />
                Habari Maalum
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                {featured.map((post) => (
                  <Link
                    key={post.id}
                    to={`/habari/${post.slug}`}
                    className={`overflow-hidden rounded-2xl border shadow-sm group transition-all hover:-translate-y-1 hover:shadow-md ${
                      isDark
                        ? 'bg-gray-900/85 border-gray-800'
                        : 'bg-white/95 border-gray-100'
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-full h-56 md:h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-yellow-400 text-gray-900 text-[10px] font-semibold px-2.5 py-1 rounded-full">
                        Maalum
                      </div>
                    </div>
                    <div className="p-5 md:p-6">
                      <h3
                        className={`text-base md:text-xl font-bold mb-2 group-hover:text-emerald-600 transition-colors ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {post.title}
                      </h3>
                      <p
                        className={`text-xs md:text-sm mb-4 line-clamp-3 ${
                          isDark ? 'text-gray-300' : 'text-gray-600'
                        }`}
                      >
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
                            {post.views}
                          </span>
                          {post.read_time && <span>{post.read_time} min</span>}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Regular Posts Grid */}
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {currentPosts
                .filter((post) => !post.featured || safePage > 1)
                .map((post) => (
                  <Link
                    key={post.id}
                    to={`/habari/${post.slug}`}
                    className={`overflow-hidden rounded-2xl border shadow-sm group transition-all hover:-translate-y-1 hover:shadow-md ${
                      isDark
                        ? 'bg-gray-900/85 border-gray-800'
                        : 'bg-white/95 border-gray-100'
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-full h-44 md:h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] px-2.5 py-1 rounded-full">
                        {post.category?.name || 'Bila Kundi'}
                      </div>
                    </div>
                    <div className="p-5 md:p-6">
                      <h3
                        className={`text-base md:text-lg font-bold mb-2 group-hover:text-emerald-600 transition-colors ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {post.title}
                      </h3>
                      <p
                        className={`text-xs md:text-sm mb-4 line-clamp-3 ${
                          isDark ? 'text-gray-300' : 'text-gray-600'
                        }`}
                      >
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
                            {post.views}
                          </span>
                          {post.read_time && <span>{post.read_time} min</span>}
                        </div>
                      </div>
                      <div className="mt-3 flex items-center text-emerald-600 group-hover:text-emerald-700">
                        <span className="text-xs md:text-sm font-medium">
                          Soma zaidi
                        </span>
                        <ArrowRight size={14} className="ml-1" />
                      </div>
                    </div>
                  </Link>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-10 md:mt-12 space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        page === safePage
                          ? 'bg-emerald-600 text-white'
                          : isDark
                          ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}
              </div>
            )}

            {/* Empty state */}
            {filteredPosts.length === 0 && (
              <div
                className={`mt-8 text-center rounded-2xl border px-6 py-10 ${
                  isDark
                    ? 'bg-gray-900/85 border-gray-800'
                    : 'bg-white/95 border-gray-100'
                }`}
              >
                <Newspaper
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
                  Hakuna habari zilizopatikana kwa vigezo ulivyoweka.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
