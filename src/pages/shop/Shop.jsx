import { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  Star,
  Heart,
  Eye
} from 'lucide-react';

export default function Shop() {
  const { isDark } = useTheme();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Sample data for demo
  const sampleProducts = [
    {
      id: 1,
      name: 'Biblia ya Kiswahili (Toleo Jipya)',
      description: 'Biblia kamili ya Kiswahili na maelezo ya kina, tafsiri mpya ya kisasa.',
      price: 25000,
      image: 'https://images.pexels.com/photos/1112048/pexels-photo-1112048.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Vitabu',
      rating: 4.8,
      reviews: 156,
      in_stock: true
    },
    {
      id: 2,
      name: 'T-Shirt: "God Cares 365"',
      description: 'T-shirt ya ubora wa hali ya juu yenye ujumbe wa imani. Rangi mbalimbali zinapatikana.',
      price: 15000,
      image: 'https://images.pexels.com/photos/1708936/pexels-photo-1708936.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Mavazi',
      rating: 4.5,
      reviews: 89,
      in_stock: true
    },
    {
      id: 3,
      name: 'Kitabu: Maombi ya Nguvu',
      description: 'Mwongozo wa kina wa jinsi ya kuomba maombi yenye nguvu na kupata majibu.',
      price: 12000,
      image: 'https://images.pexels.com/photos/8468/pray-hands-bible-christian.jpg?auto=compress&cs=tinysrgb&w=400',
      category: 'Vitabu',
      rating: 4.9,
      reviews: 203,
      in_stock: true
    },
    {
      id: 4,
      name: 'CD: Nyimbo za Rohoni',
      description: 'Mkusanyiko wa nyimbo za kiroho zenye kujenga imani na kutoa faraja.',
      price: 8000,
      image: 'https://images.pexels.com/photos/1708936/pexels-photo-1708936.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Muziki',
      rating: 4.6,
      reviews: 67,
      in_stock: false
    }
  ];

  const categories = [
    { id: 'all', name: 'Yote' },
    { id: 'vitabu', name: 'Vitabu' },
    { id: 'mavazi', name: 'Mavazi' },
    { id: 'muziki', name: 'Muziki' },
    { id: 'vifaa', name: 'Vifaa' }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // In production: const response = await fetch('/api/products/');
        await new Promise(resolve => setTimeout(resolve, 1000));
        setProducts(sampleProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           product.category.toLowerCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('sw-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className={`min-h-screen py-12 transition-colors ${
        isDark ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="container mx-auto px-6 flex items-center justify-center min-h-[400px]">
          <LoadingSpinner text="Inapakia bidhaa..." size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-12 transition-colors ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="container mx-auto px-6">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="text-white" size={32} />
          </div>
          <h1 className={`text-4xl font-bold mb-4 ${
            isDark ? 'text-white' : 'text-gray-800'
          }`}>Duka la Kiroho</h1>
          <p className={`text-lg max-w-2xl mx-auto ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Nunua vitabu vya kiroho, mavazi yenye ujumbe wa imani, na vifaa vingine vya kujenga roho
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
              placeholder="Tafuta bidhaa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
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
              className={`pl-10 pr-8 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
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

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              className={`card overflow-hidden group hover:scale-105 transition-transform ${
                isDark ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {!product.in_stock && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Haijapatikana
                    </span>
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-orange-600 text-white text-xs px-2 py-1 rounded-full">
                  {product.category}
                </div>
                <button className="absolute top-4 right-4 p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-colors">
                  <Heart size={16} className="text-gray-600" />
                </button>
              </div>

              <div className="p-6">
                <h3 className={`text-lg font-bold mb-2 ${
                  isDark ? 'text-white' : 'text-gray-800'
                }`}>{product.name}</h3>
                <p className={`text-sm mb-4 ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>{product.description}</p>

                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={`${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className={`text-xs ml-2 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    ({product.reviews} maoni)
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`text-xl font-bold ${
                    isDark ? 'text-white' : 'text-gray-800'
                  }`}>
                    {formatPrice(product.price)}
                  </span>
                  <button
                    disabled={!product.in_stock}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center ${
                      product.in_stock
                        ? 'bg-orange-600 hover:bg-orange-700 text-white'
                        : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingCart size={16} className="mr-1" />
                    {product.in_stock ? 'Nunua' : 'Haijapatikana'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className={`text-center card p-8 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <ShoppingCart className={`mx-auto mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} size={48} />
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Hakuna bidhaa zilizopatikana
            </p>
          </div>
        )}

        {/* Contact for Orders */}
        <div className={`mt-12 card p-8 text-center ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className={`text-2xl font-bold mb-4 ${
            isDark ? 'text-white' : 'text-gray-800'
          }`}>Oda Bidhaa Zako</h2>
          <p className={`mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Kwa kuoda bidhaa, wasiliana nasi kupitia njia zifuatazo:
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <a
              href="tel:+255767525234"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Piga Simu: +255 767 525 234
            </a>
            <a
              href="mailto:fmklink@gmail.com"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Tuma Barua Pepe
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}