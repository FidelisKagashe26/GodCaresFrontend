// src/pages/shop/ShopProduct.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  ShoppingCart,
  ArrowLeft,
  Star,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import SEOHead from '../../components/SEOHead';
import LoadingSpinner from '../../components/LoadingSpinner';
import apiService from '../../services/api';

const sampleProduct = {
  id: 1,
  name: 'Biblia ya Kiswahili (Toleo Jipya)',
  description:
    'Biblia kamili ya Kiswahili na maelezo ya kina, tafsiri mpya ya kisasa. Inafaa kwa utafiti wa kibinafsi, kusoma kwa pamoja na matumizi ya kanisani.',
  price: 25000,
  image:
    'https://images.pexels.com/photos/1112048/pexels-photo-1112048.jpeg?auto=compress&cs=tinysrgb&w=600',
  category: 'Vitabu',
  rating: 4.8,
  reviews: 156,
  in_stock: true,
};

export default function ShopProduct() {
  const { id } = useParams();
  const { isDark } = useTheme();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [orderForm, setOrderForm] = useState({
    full_name: '',
    phone: '',
    quantity: 1,
    notes: '',
  });
  const [ordering, setOrdering] = useState(false);
  const [orderMessage, setOrderMessage] = useState(null);
  const [orderError, setOrderError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        let data = null;

        if (typeof apiService.getShopProduct === 'function') {
          data = await apiService.getShopProduct(id);
        } else if (typeof apiService.getProductById === 'function') {
          data = await apiService.getProductById(id);
        } else {
          console.warn(
            'getShopProduct/getProductById haijasanidiwa, natumia sampleProduct.'
          );
          data = sampleProduct;
        }

        setProduct(data || sampleProduct);
      } catch (err) {
        console.error('ShopProduct load error:', err);
        setError(
          err?.message ||
            'Imeshindikana kupakia taarifa za bidhaa. Jaribu tena baadaye.'
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const formatPrice = (price) =>
    new Intl.NumberFormat('sw-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(price || 0);

  const handleOrderChange = (e) => {
    const { name, value } = e.target;
    setOrderForm((prev) => ({
      ...prev,
      [name]:
        name === 'quantity'
          ? Math.max(1, Number(value) || 1)
          : value,
    }));
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setOrderError(null);
    setOrderMessage(null);

    if (!orderForm.full_name.trim() || !orderForm.phone.trim()) {
      setOrderError('Jina kamili na namba ya simu ni lazima.');
      return;
    }

    if (!product) return;

    setOrdering(true);
    try {
      if (typeof apiService.createShopOrder === 'function') {
        await apiService.createShopOrder({
          product_id: product.id,
          quantity: orderForm.quantity,
          full_name: orderForm.full_name,
          phone: orderForm.phone,
          notes: orderForm.notes,
        });
      } else {
        console.warn(
          'createShopOrder haijasanidiwa; order inafanyika kama simulation tu.'
        );
        await new Promise((res) => setTimeout(res, 800));
      }

      setOrderMessage(
        'Ombi la oda limepokelewa. Tutakupigia au kukutumia ujumbe ndani ya muda mfupi kuthibitisha oda yako.'
      );
      setOrderForm({
        full_name: '',
        phone: '',
        quantity: 1,
        notes: '',
      });
    } catch (err) {
      console.error('Order error:', err);
      setOrderError(
        err?.message ||
          'Imeshindikana kutuma oda. Tafadhali jaribu tena baadaye.'
      );
    } finally {
      setOrdering(false);
    }
  };

  if (loading) {
    return (
      <>
        <SEOHead
          title="Bidhaa | Duka la Kiroho"
          description="Taarifa za bidhaa kutoka duka la GOD CARES 365."
        />
        <div
          className={`min-h-screen py-12 flex items-center justify-center transition-colors ${
            isDark
              ? 'bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950'
              : 'bg-gradient-to-b from-slate-50 via-white to-orange-50'
          }`}
        >
          <LoadingSpinner text="Inapakia bidhaa..." />
        </div>
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <SEOHead
          title="Bidhaa Haipatikani"
          description="Taarifa za bidhaa hazikupatikana."
        />
        <div
          className={`min-h-screen py-12 flex items-center justify-center transition-colors ${
            isDark
              ? 'bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950'
              : 'bg-gradient-to-b from-slate-50 via-white to-orange-50'
          }`}
        >
          <div
            className={`max-w-md mx-auto text-center rounded-2xl border px-6 py-10 ${
              isDark
                ? 'bg-gray-900/90 border-gray-800'
                : 'bg-white/95 border-gray-100'
            }`}
          >
            <AlertCircle
              className={isDark ? 'text-red-400 mx-auto mb-3' : 'text-red-500 mx-auto mb-3'}
              size={40}
            />
            <p
              className={isDark ? 'text-gray-300 mb-4' : 'text-gray-600 mb-4'}
            >
              {error ||
                'Bidhaa husika haipatikani kwa sasa au imeondolewa kwenye mfumo.'}
            </p>
            <a
              href="/shop"
              className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700"
            >
              <ArrowLeft size={16} />
              Rudi kwenye duka
            </a>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead
        title={`${product.name} | Duka la Kiroho`}
        description={product.description?.slice(0, 150)}
      />

      <div
        className={`min-h-screen py-10 md:py-12 transition-colors ${
          isDark
            ? 'bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950'
            : 'bg-gradient-to-b from-slate-50 via-white to-orange-50'
        }`}
      >
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          {/* Back link */}
          <div className="mb-4">
            <a
              href="/shop"
              className="inline-flex items-center gap-1 text-xs md:text-sm text-gray-500 hover:text-orange-600 dark:text-gray-400 dark:hover:text-orange-400"
            >
              <ArrowLeft size={16} />
              Rudi kwenye duka
            </a>
          </div>

          <div
            className={`rounded-2xl border shadow-sm p-5 md:p-7 lg:p-8 grid gap-6 lg:grid-cols-[1.2fr,1fr] ${
              isDark
                ? 'bg-gray-900/90 border-gray-800'
                : 'bg-white/95 border-gray-100'
            }`}
          >
            {/* Product info */}
            <div>
              <div className="rounded-xl overflow-hidden mb-5 bg-gray-100 dark:bg-gray-800">
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-72 md:h-80 object-cover"
                  />
                )}
              </div>

              <h1
                className={`text-xl md:text-2xl font-bold mb-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                {product.name}
              </h1>

              {product.category && (
                <div className="mb-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold bg-orange-50 text-orange-700 dark:bg-orange-900/40 dark:text-orange-200">
                    {product.category}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-4 mb-4 text-xs md:text-sm">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={15}
                      className={
                        i < Math.floor(product.rating || 0)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }
                    />
                  ))}
                  <span
                    className={`ml-1 ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}
                  >
                    {product.rating?.toFixed(1) || '0.0'}
                  </span>
                </div>
                <span
                  className={isDark ? 'text-gray-400' : 'text-gray-500'}
                >
                  ({product.reviews || 0} maoni)
                </span>
              </div>

              <p
                className={`text-sm md:text-base ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                {product.description}
              </p>
            </div>

            {/* Order card */}
            <div
              className={`rounded-xl border p-5 md:p-6 flex flex-col justify-between ${
                isDark
                  ? 'bg-gray-950/90 border-gray-800'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div>
                <p
                  className={`text-sm font-medium mb-1 ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  Bei ya bidhaa
                </p>
                <p
                  className={`text-2xl font-extrabold mb-3 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {formatPrice(product.price)}
                </p>
                <p
                  className={`text-[11px] mb-4 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  Bei inaweza kubadilika kulingana na usafiri na idadi ya
                  bidhaa utakazoagiza. Tutakuthibitishia kabla ya malipo.
                </p>

                {product.in_stock ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-200 mb-4">
                    <CheckCircle2 size={12} />
                    Bidhaa ipo stock
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200 mb-4">
                    Bidhaa haipo stock kwa sasa
                  </span>
                )}

                {orderError && (
                  <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[11px] text-red-700 dark:border-red-500/40 dark:bg-red-900/40 dark:text-red-100 flex items-center gap-2">
                    <AlertCircle size={14} />
                    <span>{orderError}</span>
                  </div>
                )}

                {orderMessage && (
                  <div className="mb-3 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-[11px] text-green-700 dark:border-green-500/40 dark:bg-green-900/40 dark:text-green-100 flex items-center gap-2">
                    <CheckCircle2 size={14} />
                    <span>{orderMessage}</span>
                  </div>
                )}

                <form onSubmit={handleOrderSubmit} className="space-y-3 mt-1">
                  <div>
                    <label className="block text-[11px] font-medium mb-1 text-gray-700 dark:text-gray-200">
                      Jina Kamili
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      value={orderForm.full_name}
                      onChange={handleOrderChange}
                      className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                        isDark
                          ? 'bg-gray-900 border-gray-700 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="Mfano: Adili Shabani"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium mb-1 text-gray-700 dark:text-gray-200">
                      Namba ya Simu
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={orderForm.phone}
                      onChange={handleOrderChange}
                      className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                        isDark
                          ? 'bg-gray-900 border-gray-700 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="+255 xxx xxx xxx"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium mb-1 text-gray-700 dark:text-gray-200">
                      Idadi ya nakala
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      min={1}
                      value={orderForm.quantity}
                      onChange={handleOrderChange}
                      className={`w-24 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                        isDark
                          ? 'bg-gray-900 border-gray-700 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium mb-1 text-gray-700 dark:text-gray-200">
                      Maelezo ya ziada (hiari)
                    </label>
                    <textarea
                      name="notes"
                      rows={3}
                      value={orderForm.notes}
                      onChange={handleOrderChange}
                      className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                        isDark
                          ? 'bg-gray-900 border-gray-700 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="Andika mahali ulipo, namna unavyotaka kusafirishiwa, n.k."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={ordering || !product.in_stock}
                    className={`w-full mt-1 rounded-lg font-semibold py-2.5 text-sm flex items-center justify-center gap-2 ${
                      !product.in_stock
                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                        : 'bg-orange-600 hover:bg-orange-700 text-white'
                    } disabled:opacity-60 disabled:cursor-not-allowed`}
                  >
                    {ordering ? (
                      <>
                        <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Inatuma oda...
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={16} />
                        Tuma Ombi la Oda
                      </>
                    )}
                  </button>
                </form>

                <p
                  className={`text-[11px] mt-3 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  Baada ya kutuma ombi, tutawasiliana na wewe kuthibitisha
                  bei ya mwisho na utaratibu wa malipo/usafiri.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
