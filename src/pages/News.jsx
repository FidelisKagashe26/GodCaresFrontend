import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useApi } from '../hooks/useApi';
import { formatDate } from '../utils/helpers';
import SEOHead from '../components/SEOHead';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Newspaper, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Eye,
  ArrowRight,
  Star
} from 'lucide-react';

export default function News() {
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  // Fetch posts and categories from API
  const apiParams = {};
  if (searchTerm) apiParams.search = searchTerm;
  if (selectedCategory !== 'all') apiParams.category = selectedCategory;
  if (currentPage > 1) apiParams.page = currentPage;
  
  const { data: postsData, loading, error } = useApi('posts', apiParams);
  const { data: categoriesData } = useApi('categories');
  
  const posts = postsData?.results || [];
  const categories = [
    { id: 'all', name: 'Yote' },
    ...(categoriesData || []).map(cat => ({ id: cat.slug, name: cat.name }))
  ];

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           post.category.slug === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

  if (loading) {
    return (
      <>
        <SEOHead 
          title="Habari & Vipengele"
          description="Soma makala za kiroho, habari za jamii, na vipengele vya kujenga imani"
          keywords="habari, makala, kiroho, imani, jamii, Tanzania"
        />
        <div className={`min-h-screen py-12 transition-colors ${
          isDark ? 'bg-gray-900' : 'bg-gray-50'
        }`}>
          <div className="container mx-auto px-6 flex items-center justify-center min-h-[400px]">
            <LoadingSpinner text="Inapakia habari..." size="lg" />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead 
        title="Habari & Vipengele"
        description="Soma makala za kiroho, habari za jamii, na vipengele vya kujenga imani"
        keywords="habari, makala, kiroho, imani, jamii, Tanzania"
      />
      <div className={`min-h-screen py-12 transition-colors ${
        isDark ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="container mx-auto px-6">
          {/* Header */}
          <header className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Newspaper className="text-white" size={32} />
            </div>
            <h1 className={`text-4xl font-bold mb-4 ${
              isDark ? 'text-white' : 'text-gray-800'
            }`}>Habari & Vipengele</h1>
            <p className={`text-lg max-w-2xl mx-auto ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Soma makala za kiroho, habari za jamii, na vipengele vya kujenga imani
            </p>
          </header>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`} size={20} />
              <input
                type="text"
                placeholder="Tafuta habari..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark 
                    ? 'bg-gray-800 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
            <div className="relative">
              <Filter className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`} size={20} />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`pl-10 pr-8 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark 
                    ? 'bg-gray-800 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Featured Posts */}
          {currentPage === 1 && filteredPosts.some(post => post.featured) && (
            <section className="mb-12">
              <h2 className={`text-2xl font-bold mb-6 ${
                isDark ? 'text-white' : 'text-gray-800'
              }`}>
                <Star className="inline mr-2 text-yellow-500" size={24} />
                Habari Maalum
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {filteredPosts.filter(post => post.featured).slice(0, 2).map(post => (
                  <Link
                    key={post.id}
                    to={`/habari/${post.slug}`}
                    className={`card overflow-hidden group hover:scale-105 transition-transform ${
                      isDark ? 'bg-gray-800' : 'bg-white'
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                        Maalum
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className={`text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors ${
                        isDark ? 'text-white' : 'text-gray-800'
                      }`}>{post.title}</h3>
                      <p className={`text-sm mb-4 ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                      }`}>{post.excerpt}</p>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center">
                            <User size={12} className="mr-1" />
                            {post.author_name}
                          </span>
                          <span className="flex items-center">
                            <Calendar size={12} className="mr-1" />
                            {formatDate(post.published_at)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="flex items-center">
                            <Eye size={12} className="mr-1" />
                            {post.views}
                          </span>
                          <span>{post.read_time} min</span>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentPosts.filter(post => !post.featured || currentPage > 1).map(post => (
                <Link
                  key={post.id}
                  to={`/habari/${post.slug}`}
                  className={`card overflow-hidden group hover:scale-105 transition-transform ${
                    isDark ? 'bg-gray-800' : 'bg-white'
                  }`}
                >
                  <div className="relative">
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                      {post.category.name}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className={`text-lg font-bold mb-3 group-hover:text-blue-600 transition-colors ${
                      isDark ? 'text-white' : 'text-gray-800'
                    }`}>{post.title}</h3>
                    <p className={`text-sm mb-4 ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>{post.excerpt}</p>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <User size={12} className="mr-1" />
                          {post.author_name}
                        </span>
                        <span className="flex items-center">
                          <Calendar size={12} className="mr-1" />
                          {formatDate(post.published_at)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="flex items-center">
                          <Eye size={12} className="mr-1" />
                          {post.views}
                        </span>
                        <span>{post.read_time} min</span>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-blue-600 group-hover:text-blue-700">
                      <span className="text-sm font-medium">Soma zaidi</span>
                      <ArrowRight size={16} className="ml-1" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12 space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      page === currentPage
                        ? 'bg-blue-600 text-white'
                        : isDark
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}

            {filteredPosts.length === 0 && (
              <div className={`text-center card p-8 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                <Newspaper className={`mx-auto mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} size={48} />
                <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Hakuna habari zilizopatikana
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}