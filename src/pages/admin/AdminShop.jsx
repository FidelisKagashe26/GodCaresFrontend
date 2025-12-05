// src/pages/admin/AdminShop.jsx
import { useEffect, useState } from 'react';
import {
  ShoppingBag,
  AlertCircle,
  CheckCircle2,
  Edit2,
  Package,
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import SEOHead from '../../components/SEOHead';
import LoadingSpinner from '../../components/LoadingSpinner';
import apiService from '../../services/api';

// fallback sample kama API haipo bado
const fallbackProducts = [
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
];

export default function AdminShop() {
  const { isDark } = useTheme();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        let data = null;
        if (typeof apiService.getProducts === 'function') {
          data = await apiService.getProducts();
        } else {
          console.warn('apiService.getProducts haijasanidiwa, natumia fallback.');
          data = fallbackProducts;
        }
        const list = Array.isArray(data) ? data : data?.results || [];
        setProducts(list);
      } catch (err) {
        console.error('AdminShop load error:', err);
        setError(
          err?.message ||
            'Imeshindikana kupakia bidhaa. Tunaonyesha mfano wa data tu.'
        );
        setProducts(fallbackProducts);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const toggleStock = async (product) => {
    const newValue = !product.in_stock;
    // optimistic
    setProducts((prev) =>
      prev.map((p) =>
        p.id === product.id ? { ...p, in_stock: newValue } : p
      )
    );

    try {
      if (typeof apiService.updateProductStock === 'function') {
        await apiService.updateProductStock(product.id, { in_stock: newValue });
      } else {
        console.warn(
          'updateProductStock haijasanidiwa; inafanya work local tu kwa sasa.'
        );
      }
    } catch (err) {
      console.error('toggleStock error:', err);
      setError(
        err?.message ||
          'Imeshindikana kubadili stock ya bidhaa. Jaribu tena baadaye.'
      );
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat('sw-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(price || 0);

  return (
    <>
      <SEOHead
        title="Admin – Shop Products"
        description="Panel ya admin kusimamia bidhaa za duka la GOD CARES 365."
      />

      <section
        className={`min-h-[calc(100vh-200px)] py-8 md:py-10 transition-colors ${
          isDark
            ? 'bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950'
            : 'bg-gradient-to-b from-slate-50 via-white to-orange-50'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-400/40">
                <ShoppingBag size={22} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">
                  Admin – Duka la Kiroho
                </h1>
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                  Pitia bidhaa, angalia nini kiko stock, na andaa duka lako
                  la kiroho mtandaoni.
                </p>
              </div>
            </div>
          </header>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-500/40 dark:bg-red-900/40 dark:text-red-100 flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div
            className={`rounded-2xl border shadow-sm min-h-[260px] ${
              isDark
                ? 'bg-gray-900/90 border-gray-800'
                : 'bg-white/95 border-gray-100'
            }`}
          >
            {loading ? (
              <div className="py-10 flex justify-center">
                <LoadingSpinner text="Inapakia bidhaa..." />
              </div>
            ) : products.length === 0 ? (
              <div className="py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                Hakuna bidhaa zilizopatikana.
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {products.map((p) => (
                  <div
                    key={p.id}
                    className="px-4 py-3 flex flex-col md:flex-row gap-3 text-xs md:text-sm"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-800">
                        {p.image && (
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {p.name}
                          </span>
                          {p.category && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] bg-orange-50 text-orange-700 dark:bg-orange-900/40 dark:text-orange-200">
                              {p.category}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-[11px] line-clamp-2">
                          {p.description}
                        </p>
                        <div className="mt-1 flex flex-wrap gap-3 text-[10px] text-gray-500 dark:text-gray-400">
                          <span>
                            Rating:{' '}
                            <strong>{p.rating || 0}</strong> ({p.reviews || 0}{' '}
                            maoni)
                          </span>
                          <span>Mauzo: haijafungwa bado (API)</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col items-end justify-between gap-2 md:w-48">
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                          {formatPrice(p.price)}
                        </p>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center justify-end gap-1">
                          <Package size={12} />
                          {p.in_stock ? 'Kwenye stock' : 'Haipo stock'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleStock(p)}
                          className={`px-3 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 ${
                            p.in_stock
                              ? 'bg-red-600 text-white hover:bg-red-700'
                              : 'bg-green-600 text-white hover:bg-green-700'
                          }`}
                        >
                          <CheckCircle2 size={12} />
                          {p.in_stock ? 'Weka Out of Stock' : 'Rudisha Stock'}
                        </button>
                        <button
                          type="button"
                          className="px-3 py-1 rounded-lg text-[11px] font-semibold bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200 flex items-center gap-1"
                        >
                          <Edit2 size={12} />
                          Hariri (baadaye)
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
