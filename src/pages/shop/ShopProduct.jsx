// src/pages/shop/ShopProduct.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ShoppingCart, ArrowLeft, CheckCircle2, AlertCircle, Package } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import SEOHead from "../../components/SEOHead";
import LoadingSpinner from "../../components/LoadingSpinner";
import apiService from "../../services/api";

// Image component (NO CROP) + fallback
function ProductDetailImage({ src, alt, isDark }) {
  const [broken, setBroken] = useState(false);

  return (
    <div className="rounded-xl overflow-hidden mb-5 bg-slate-100 dark:bg-slate-800">
      <div className="w-full h-72 md:h-80 flex items-center justify-center">
        {src && !broken ? (
          <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            onError={() => setBroken(true)}
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <div className={`w-full h-72 md:h-80 flex items-center justify-center ${isDark ? "bg-slate-800" : "bg-slate-100"}`}>
            <Package className={isDark ? "text-slate-500" : "text-slate-400"} size={34} />
          </div>
        )}
      </div>
    </div>
  );
}

export default function ShopProduct() {
  const { id } = useParams();
  const { isDark } = useTheme();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [orderForm, setOrderForm] = useState({
    full_name: "",
    phone: "",
    quantity: 1,
    notes: "",
  });

  const [ordering, setOrdering] = useState(false);
  const [orderMessage, setOrderMessage] = useState(null);
  const [orderError, setOrderError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      setProduct(null);

      try {
        const data = await apiService.getShopProduct(id);
        setProduct(data);
      } catch (err) {
        setError(err?.message || "Bidhaa haipatikani kwa sasa.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const formatPrice = (price) =>
    new Intl.NumberFormat("sw-TZ", {
      style: "currency",
      currency: "TZS",
      minimumFractionDigits: 0,
    }).format(Number(price || 0));

  const categoryLabel = product?.category_name || product?.category?.name || "";

  const qtyMax = useMemo(() => {
    const q = Number(product?.stock_quantity || 0);
    return q > 0 ? q : null; // kama backend haitumii strict stock => null
  }, [product]);

  const maxQtyHint = useMemo(() => {
    if (!product) return null;
    if (!product.in_stock) return "Bidhaa haipo stock kwa sasa.";
    if (qtyMax) return `Stock iliyopo: ${qtyMax}`;
    return null;
  }, [product, qtyMax]);

  const handleOrderChange = (e) => {
    const { name, value } = e.target;

    if (name === "quantity") {
      let v = Math.max(1, Number(value) || 1);
      if (qtyMax) v = Math.min(v, qtyMax);
      setOrderForm((prev) => ({ ...prev, quantity: v }));
      return;
    }

    setOrderForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setOrderError(null);
    setOrderMessage(null);

    if (!orderForm.full_name.trim() || !orderForm.phone.trim()) {
      setOrderError("Jina kamili na namba ya simu ni lazima.");
      return;
    }

    if (!product) return;

    if (!product.in_stock) {
      setOrderError("Bidhaa haipo stock kwa sasa.");
      return;
    }

    if (qtyMax && Number(orderForm.quantity) > qtyMax) {
      setOrderError("Idadi uliyochagua imezidi stock iliyopo.");
      return;
    }

    setOrdering(true);
    try {
      const created = await apiService.createShopOrder({
        product_id: product.id,
        quantity: orderForm.quantity,
        full_name: orderForm.full_name,
        phone: orderForm.phone,
        notes: orderForm.notes,
      });

      const orderId = created?.id ? ` (Oda #${created.id})` : "";
      setOrderMessage(
        `Ombi la oda limepokelewa${orderId}. Tutakupigia au kukutumia ujumbe ndani ya muda mfupi kuthibitisha oda yako.`
      );

      setOrderForm({ full_name: "", phone: "", quantity: 1, notes: "" });
    } catch (err) {
      setOrderError(err?.message || "Imeshindikana kutuma oda. Tafadhali jaribu tena baadaye.");
    } finally {
      setOrdering(false);
    }
  };

  if (loading) {
    return (
      <>
        <SEOHead title="Bidhaa | Duka la Kiroho" description="Taarifa za bidhaa kutoka duka la GOD CARES 365." />
        <div
          className={`min-h-screen py-12 flex items-center justify-center transition-colors ${
            isDark
              ? "bg-gradient-to-b from-gray-950 via-slate-900 to-gray-950"
              : "bg-gradient-to-b from-slate-50 via-white to-indigo-50"
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
        <SEOHead title="Bidhaa Haipatikani" description="Taarifa za bidhaa hazikupatikana." />
        <div
          className={`min-h-screen py-12 flex items-center justify-center transition-colors ${
            isDark
              ? "bg-gradient-to-b from-gray-950 via-slate-900 to-gray-950"
              : "bg-gradient-to-b from-slate-50 via-white to-indigo-50"
          }`}
        >
          <div
            className={`max-w-md mx-auto text-center rounded-2xl border px-6 py-10 ${
              isDark ? "bg-slate-900/90 border-slate-800" : "bg-white/95 border-slate-100"
            }`}
          >
            <AlertCircle className={isDark ? "text-rose-400 mx-auto mb-3" : "text-rose-600 mx-auto mb-3"} size={40} />
            <p className={isDark ? "text-slate-300 mb-4" : "text-slate-600 mb-4"}>
              {error || "Bidhaa husika haipatikani kwa sasa au imeondolewa kwenye mfumo."}
            </p>

            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              <ArrowLeft size={16} />
              Rudi kwenye duka
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead title={`${product.name} | Duka la Kiroho`} description={(product.description || "").slice(0, 150)} />

      <div
        className={`min-h-screen py-10 md:py-12 transition-colors ${
          isDark
            ? "bg-gradient-to-b from-gray-950 via-slate-900 to-gray-950"
            : "bg-gradient-to-b from-slate-50 via-white to-indigo-50"
        }`}
      >
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          {/* Back */}
          <div className="mb-4">
            <Link
              to="/shop"
              className="inline-flex items-center gap-1 text-xs md:text-sm text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-300"
            >
              <ArrowLeft size={16} />
              Rudi kwenye duka
            </Link>
          </div>

          <div
            className={`rounded-2xl border shadow-sm p-5 md:p-7 lg:p-8 grid gap-6 lg:grid-cols-[1.2fr,1fr] ${
              isDark ? "bg-slate-900/90 border-slate-800" : "bg-white/95 border-slate-100"
            }`}
          >
            {/* Info */}
            <div>
              <ProductDetailImage src={product.image} alt={product.name} isDark={isDark} />

              <h1 className={`text-xl md:text-2xl font-extrabold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                {product.name}
              </h1>

              {categoryLabel ? (
                <div className="mb-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200">
                    {categoryLabel}
                  </span>
                </div>
              ) : null}

              <p className={`text-sm md:text-base ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                {product.description}
              </p>
            </div>

            {/* Order */}
            <div
              className={`rounded-xl border p-5 md:p-6 flex flex-col justify-between ${
                isDark ? "bg-gray-950/60 border-slate-800" : "bg-slate-50 border-slate-200"
              }`}
            >
              <div>
                <p className={`text-sm font-medium mb-1 ${isDark ? "text-slate-300" : "text-slate-600"}`}>Bei ya bidhaa</p>
                <p className={`text-2xl font-extrabold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                  {formatPrice(product.price)}
                </p>

                <p className={`text-[11px] mb-4 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  Bei inaweza kubadilika kulingana na usafiri na idadi ya bidhaa utakazoagiza. Tutakuthibitishia kabla ya malipo.
                </p>

                {product.in_stock ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200 mb-2">
                    <CheckCircle2 size={12} />
                    Bidhaa ipo stock
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200 mb-2">
                    Bidhaa haipo stock kwa sasa
                  </span>
                )}

                {maxQtyHint ? (
                  <p className={`text-[11px] mb-3 ${isDark ? "text-slate-400" : "text-slate-500"}`}>{maxQtyHint}</p>
                ) : (
                  <div className="mb-3" />
                )}

                {orderError && (
                  <div className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[11px] text-rose-700 dark:border-rose-500/40 dark:bg-rose-900/40 dark:text-rose-100 flex items-center gap-2">
                    <AlertCircle size={14} />
                    <span>{orderError}</span>
                  </div>
                )}

                {orderMessage && (
                  <div className="mb-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-[11px] text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-900/40 dark:text-emerald-100 flex items-center gap-2">
                    <CheckCircle2 size={14} />
                    <span>{orderMessage}</span>
                  </div>
                )}

                <form onSubmit={handleOrderSubmit} className="space-y-3 mt-1">
                  <div>
                    <label className="block text-[11px] font-medium mb-1 text-slate-700 dark:text-slate-200">
                      Jina Kamili
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      value={orderForm.full_name}
                      onChange={handleOrderChange}
                      className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        isDark ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"
                      }`}
                      placeholder="Mfano: Adili Shabani"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium mb-1 text-slate-700 dark:text-slate-200">
                      Namba ya Simu
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={orderForm.phone}
                      onChange={handleOrderChange}
                      className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        isDark ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"
                      }`}
                      placeholder="+255 xxx xxx xxx"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium mb-1 text-slate-700 dark:text-slate-200">
                      Idadi ya nakala
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      min={1}
                      max={qtyMax || undefined}
                      value={orderForm.quantity}
                      onChange={handleOrderChange}
                      className={`w-28 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        isDark ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium mb-1 text-slate-700 dark:text-slate-200">
                      Maelezo ya ziada (hiari)
                    </label>
                    <textarea
                      name="notes"
                      rows={3}
                      value={orderForm.notes}
                      onChange={handleOrderChange}
                      className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        isDark ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"
                      }`}
                      placeholder="Andika mahali ulipo, namna unavyotaka kusafirishiwa, n.k."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={ordering || !product.in_stock}
                    className={`w-full mt-1 rounded-lg font-semibold py-2.5 text-sm flex items-center justify-center gap-2 ${
                      !product.in_stock
                        ? "bg-slate-400 text-slate-200 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white"
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

                <p className={`text-[11px] mt-3 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  Baada ya kutuma ombi, tutawasiliana na wewe kuthibitisha bei ya mwisho na utaratibu wa malipo/usafiri.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
