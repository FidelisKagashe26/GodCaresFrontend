// src/pages/shop/Shop.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import SEOHead from '../../components/SEOHead';
import LoadingSpinner from '../../components/LoadingSpinner';
import apiService from '../../services/api';
import {
  ShoppingCart,
  Search,
  Filter,
  Star,
  Heart,
  Eye,
} from 'lucide-react';

// fallback kama API haijawa tayari
const sampleProducts = [
  {
    id: 1,
    name: 'Biblia ya Kiswahili (Toleo Jipya)',
    description:
      'Biblia kamili ya Kiswahili na maelezo ya kina, tafsiri mpya ya kisasa.',
    price: 25000,
    image:
      'https://images.pexels.com/photos/1112048/pexels-photo-1112048.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Vitabu',
    rating: 4.8,
    reviews: 156,
    in_stock: true,
  },
  {
    id: 2,
    name: 'T-Shirt: "God Cares 365"',
    description:
      'T-shirt ya ubora wa hali ya juu yenye ujumbe wa imani. Rangi mbalimbali zinapatikana.',
    price: 15000,
    image:
      'https://images.pexels.com/photos/1708936/pexels-photo-1708936.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Mavazi',
    rating: 4.5,
    reviews: 89,
    in_stock: true,
  },
  {
    id: 3,
    name: 'Kitabu: Maombi ya Nguvu',
    description:
      'Mwongozo wa kina wa jinsi ya kuomba maombi yenye nguvu na kupata majibu.',
    price: 12000,
    image:
      'https://images.pexels.com/photos/8468/pray-hands-bible-christian.jpg?auto=compress&cs=tinysrgb&w=400',
    category: 'Vitabu',
    rating: 4.9,
    reviews: 203,
    in_stock: true,
  },
  {
    id: 4,
    name: 'CD: Nyimbo za Rohoni',
    description:
      'Mkusanyiko wa nyimbo za kiroho zenye kujenga imani na kutoa faraja.',
    price: 8000,
    image:
      'https://images.pexels.com/photos/1708936/pexels-photo-1708936.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Muziki',
    rating: 4.6,
    reviews: 67,
    in_stock: false,
  },
];

const categories = [
  { id: 'all', name: 'Yote' },
  { id: 'vitabu', name: 'Vitabu' },
  { id: 'mavazi', name: 'Mavazi' },
  { id: 'muziki', name: 'Muziki' },
  { id: 'vifaa', name: 'Vifaa' },
];

export default function Shop() {
  const { isDark } = useTheme();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        let data = null;
        if (typeof apiService.getShopProducts === 'function') {
          data = await apiService.getShopProducts();
        } else if (typeof apiService.getProducts === 'function') {
          data = await apiService.getProducts();
        } else {
          console.warn('Hakuna getShopProducts/getProducts kwenye apiService, natumia sample.');
          data = sampleProducts;
        }

        const list = Array.isArray(data) ? data : data?.results || [];
        setProducts(list.length ? list : sampleProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(
          err?.message ||
            'Imeshindikana kupakia bidhaa. Tunaonyesha bidhaa za mfano.'
        );
        setProducts(sampleProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const s = searchTerm.toLowerCase();
    const matchesSearch =
      !s ||
      product.name?.toLowerCase().includes(s) ||
      product.description?.toLowerCase().includes(s);

    const cat = (product.category || '').toLowerCase();
    const matchesCategory =
      selectedCategory === 'all' ||
      cat === selectedCategory ||
      // kama backend anarudisha category kama "Vitabu", tufanye normalization
      cat ===
        selectedCategory.replace(/_/g, ' ').toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const formatPrice = (price) =>
    new Intl.NumberFormat('sw-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(price || 0);

  if (loading) {
    return (
      <>
        <SEOHead
          title="Duka la Kiroho"
          description="Nunua vitabu, mavazi na bidhaa za kiroho kutoka GOD CARES 365."
          keywords="duka, shop, vitabu, mavazi, nyimbo, kiroho"
        />
        <div
          className={`min-h-screen py-12 transition-colors ${
            isDark
              ? 'bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950'
              : 'bg-gradient-to-b from-slate-50 via-white to-orange-50'
          }`}
        >
          <div className="container mx-auto px-4 md:px-6 flex items-center justify-center min-h-[400px]">
            <LoadingSpinner text="Inapakia bidhaa..." size="lg" />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead
        title="Duka la Kiroho"
        description="Nunua vitabu vya kiroho, mavazi yenye ujumbe wa imani na bidhaa nyingine kutoka GOD CARES 365."
        keywords="duka la kiroho, god cares 365 shop, vitabu vya kiroho, t-shirt za imani"
      />

      <div
        className={`min-h-screen py-10 md:py-12 transition-colors ${
          isDark
            ? 'bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950'
            : 'bg-gradient-to-b from-slate-50 via-white to-orange-50'
        }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          {/* Header */}
          <header className="text-center mb-8 md:mb-10">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md shadow-orange-400/40">
              <ShoppingCart className="text-white" size={32} />
            </div>
            <h1
              className={`text-2xl md:text-4xl font-extrabold mb-3 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              Duka la Kiroho
            </h1>
            <p
              className={`text-sm md:text-lg max-w-2xl mx-auto ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              Nunua vitabu vya kiroho, mavazi yenye ujumbe wa imani, nyimbo na
              vifaa vingine vinavyojenga roho.
            </p>
          </header>

          {error && (
            <div className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 px-3 py-2 text-xs md:text-sm text-yellow-800 dark:border-yellow-500/40 dark:bg-yellow-900/40 dark:text-yellow-100">
              {error}
            </div>
          )}

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search
                className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}
                size={18}
              />
              <input
                type="text"
                placeholder="Tafuta bidhaa kwa jina au maelezo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-full border text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                  isDark
                    ? 'bg-gray-900/80 border-gray-700 text-white placeholder:text-gray-500'
                    : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-500'
                }`}
              />
            </div>
            <div className="relative w-full md:w-64">
              <Filter
                className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}
                size={18}
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`w-full pl-10 pr-8 py-2.5 rounded-full border text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
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

          {/* Products grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/shop/${product.id}`}
                  className={`overflow-hidden rounded-2xl border shadow-sm group transition-all hover:-translate-y-1 hover:shadow-md ${
                    isDark
                      ? 'bg-gray-900/85 border-gray-800'
                      : 'bg-white/95 border-gray-100'
                  }`}
                >
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.category && (
                      <div className="absolute top-3 left-3 bg-orange-600 text-white text-[10px] px-2.5 py-1 rounded-full">
                        {product.category}
                      </div>
                    )}
                    {!product.in_stock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          Haipo stock
                        </span>
                      </div>
                    )}
                    <button
                      type="button"
                      className="absolute top-3 right-3 p-1.5 bg-white/80 rounded-full hover:bg-white transition-colors"
                    >
                      <Heart size={16} className="text-gray-600" />
                    </button>
                  </div>

                  <div className="p-5">
                    <h3
                      className={`text-base md:text-lg font-bold mb-1.5 line-clamp-2 ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {product.name}
                    </h3>
                    <p
                      className={`text-xs md:text-sm mb-3 line-clamp-2 ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    >
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={13}
                            className={
                              i < Math.floor(product.rating || 0)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }
                          />
                        ))}
                        <span
                          className={`text-[11px] ml-1 ${
                            isDark ? 'text-gray-400' : 'text-gray-500'
                          }`}
                        >
                          {product.rating?.toFixed(1) || '0.0'}
                        </span>
                      </div>
                      <span
                        className={`text-[11px] flex items-center ${
                          isDark ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        <Eye size={13} className="mr-1" />
                        {product.reviews || 0} maoni
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span
                        className={`text-lg font-bold ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {formatPrice(product.price)}
                      </span>
                      <button
                        type="button"
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                          product.in_stock
                            ? 'bg-orange-600 text-white group-hover:bg-orange-700'
                            : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                        }`}
                      >
                        <ShoppingCart size={14} />
                        {product.in_stock ? 'Angalia zaidi' : 'Haipo stock'}
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div
              className={`mt-8 text-center rounded-2xl border px-6 py-10 ${
                isDark
                  ? 'bg-gray-900/85 border-gray-800'
                  : 'bg-white/95 border-gray-100'
              }`}
            >
              <ShoppingCart
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
                Hakuna bidhaa zilizopatikana kwa vigezo ulivyotafuta.
              </p>
            </div>
          )}

          {/* Contact for orders (global info) */}
          <div
            className={`mt-10 md:mt-12 rounded-2xl border p-6 md:p-8 text-center ${
              isDark
                ? 'bg-gray-900/90 border-gray-800'
                : 'bg-white/95 border-gray-100'
            }`}
          >
            <h2
              className={`text-lg md:text-2xl font-bold mb-3 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              Unahitaji msaada kuagiza bidhaa?
            </h2>
            <p
              className={`text-sm md:text-base mb-5 ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              Unaweza pia kuwasiliana nasi moja kwa moja ili kukusaidia
              kuagiza bidhaa ulizozipenda.
            </p>
            <div className="flex flex-col md:flex-row gap-3 justify-center">
              <a
                href="tel:+255767525234"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold text-sm md:text-base"
              >
                Piga Simu: +255 767 525 234
              </a>
              <a
                href="mailto:fmklink@gmail.com"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold text-sm md:text-base"
              >
                Tuma Barua Pepe
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
