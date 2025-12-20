// src/pages/shop/Shop.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  Search,
  Filter,
  Heart,
  Package,
  ArrowUpDown,
  CheckCircle2,
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import SEOHead from "../../components/SEOHead";
import LoadingSpinner from "../../components/LoadingSpinner";
import apiService from "../../services/api";

const DEFAULT_CATEGORIES = [{ id: "all", name: "Yote", slug: "all" }];

const ORDERING_OPTIONS = [
  { value: "-created_at", label: "Mpya kwanza" },
  { value: "created_at", label: "Zamani kwanza" },
  { value: "price", label: "Bei ndogo kwanza" },
  { value: "-price", label: "Bei kubwa kwanza" },
];

// Image component (NO CROP) + fallback ikiwa image imeharibika
function ProductCardImage({ src, alt, isDark }) {
  const [broken, setBroken] = useState(false);

  return (
    <div
      className={`w-full h-48 flex items-center justify-center overflow-hidden ${
        isDark ? "bg-slate-800" : "bg-slate-100"
      }`}
    >
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
        <Package className={isDark ? "text-slate-500" : "text-slate-400"} />
      )}
    </div>
  );
}

export default function Shop() {
  const { isDark } = useTheme();

  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [products, setProducts] = useState([]);

  const [loadingCats, setLoadingCats] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all"); // slug
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [ordering, setOrdering] = useState("-created_at");

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch((searchTerm || "").trim()), 350);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // categories
  useEffect(() => {
    const loadCats = async () => {
      setLoadingCats(true);
      try {
        const cats = await apiService.getShopCategories();
        const list = Array.isArray(cats) ? cats : cats?.results || [];
        const normalized = [
          { id: "all", name: "Yote", slug: "all" },
          ...list.map((c) => ({ id: c.id, name: c.name, slug: c.slug })),
        ];
        setCategories(normalized);
      } catch {
        setCategories(DEFAULT_CATEGORIES);
      } finally {
        setLoadingCats(false);
      }
    };

    loadCats();
  }, []);

  // products (server-side filters)
  useEffect(() => {
    const loadProducts = async () => {
      setLoadingProducts(true);
      setError(null);

      try {
        const params = {
          search: debouncedSearch || undefined,
          category: selectedCategory !== "all" ? selectedCategory : undefined,
          ordering: ordering || undefined,
          in_stock: onlyInStock ? "1" : undefined,
        };

        const data = await apiService.getShopProducts(params);
        const list = Array.isArray(data) ? data : data?.results || [];
        setProducts(list);
      } catch (err) {
        setError(err?.message || "Imeshindikana kupakia bidhaa.");
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    loadProducts();
  }, [debouncedSearch, selectedCategory, ordering, onlyInStock]);

  const viewProducts = useMemo(
    () => (Array.isArray(products) ? products : []),
    [products]
  );

  const formatPrice = (price) =>
    new Intl.NumberFormat("sw-TZ", {
      style: "currency",
      currency: "TZS",
      minimumFractionDigits: 0,
    }).format(Number(price || 0));

  const pageLoading = loadingCats || loadingProducts;

  if (pageLoading) {
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
              ? "bg-gradient-to-b from-gray-950 via-slate-900 to-gray-950"
              : "bg-gradient-to-b from-slate-50 via-white to-indigo-50"
          }`}
        >
          <div className="container mx-auto px-4 md:px-6 flex items-center justify-center min-h-[420px]">
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
            ? "bg-gradient-to-b from-gray-950 via-slate-900 to-gray-950"
            : "bg-gradient-to-b from-slate-50 via-white to-indigo-50"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          {/* Header */}
          <header className="text-center mb-8 md:mb-10">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md shadow-indigo-500/30">
              <ShoppingCart className="text-white" size={32} />
            </div>

            <h1
              className={`text-2xl md:text-4xl font-extrabold mb-3 ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              Duka la Kiroho
            </h1>

            <p
              className={`text-sm md:text-lg max-w-2xl mx-auto ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              Nunua vitabu vya kiroho, mavazi yenye ujumbe wa imani, nyimbo na
              vifaa vingine vinavyojenga roho.
            </p>
          </header>

          {error && (
            <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs md:text-sm text-rose-800 dark:border-rose-500/40 dark:bg-rose-900/40 dark:text-rose-100">
              {error}
            </div>
          )}

          {/* Filters */}
          <div
            className={`rounded-2xl border p-4 md:p-5 mb-8 ${
              isDark
                ? "bg-slate-900/70 border-slate-800"
                : "bg-white/80 border-slate-100"
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {/* Search */}
              <div className="relative md:col-span-6">
                <Search
                  className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Tafuta bidhaa kwa jina au maelezo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-full border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    isDark
                      ? "bg-slate-900/80 border-slate-700 text-white placeholder:text-slate-500"
                      : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-500"
                  }`}
                />
              </div>

              {/* Category */}
              <div className="relative md:col-span-3">
                <Filter
                  className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}
                  size={18}
                />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={`w-full pl-10 pr-8 py-2.5 rounded-full border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    isDark
                      ? "bg-slate-900/80 border-slate-700 text-white"
                      : "bg-white border-slate-200 text-slate-900"
                  }`}
                >
                  {(categories || DEFAULT_CATEGORIES).map((c) => (
                    <option key={String(c.id)} value={c.slug || c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ordering */}
              <div className="relative md:col-span-3">
                <ArrowUpDown
                  className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}
                  size={18}
                />
                <select
                  value={ordering}
                  onChange={(e) => setOrdering(e.target.value)}
                  className={`w-full pl-10 pr-8 py-2.5 rounded-full border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    isDark
                      ? "bg-slate-900/80 border-slate-700 text-white"
                      : "bg-white border-slate-200 text-slate-900"
                  }`}
                >
                  {ORDERING_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* In-stock toggle */}
              <div className="md:col-span-12 flex items-center justify-between gap-3 mt-1">
                <label
                  className={`flex items-center gap-2 text-sm ${
                    isDark ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={onlyInStock}
                    onChange={(e) => setOnlyInStock(e.target.checked)}
                    className="h-4 w-4 accent-indigo-600"
                  />
                  Onyesha zilizo stock tu
                </label>

                <div className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  Jumla:{" "}
                  <span className={`font-semibold ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                    {viewProducts.length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Products grid */}
          {viewProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {viewProducts.map((product) => {
                const categoryLabel = product.category_name || product.category?.name || "";
                const qty = Number(product.stock_quantity || 0);

                return (
                  <Link
                    key={product.id}
                    to={`/shop/${product.id}`}
                    className={`overflow-hidden rounded-2xl border shadow-sm group transition-all hover:-translate-y-1 hover:shadow-md ${
                      isDark ? "bg-slate-900/85 border-slate-800" : "bg-white/95 border-slate-100"
                    }`}
                  >
                    <div className="relative">
                      <ProductCardImage src={product.image} alt={product.name} isDark={isDark} />

                      {categoryLabel ? (
                        <div className="absolute top-3 left-3 bg-indigo-600 text-white text-[10px] px-2.5 py-1 rounded-full">
                          {categoryLabel}
                        </div>
                      ) : null}

                      {!product.in_stock && (
                        <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
                          <span className="bg-rose-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                            Haipo stock
                          </span>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={(e) => e.preventDefault()}
                        className="absolute top-3 right-3 p-1.5 bg-white/80 rounded-full hover:bg-white transition-colors"
                        aria-label="Weka kwenye pendwa"
                        title="Weka kwenye pendwa"
                      >
                        <Heart size={16} className="text-slate-700" />
                      </button>
                    </div>

                    <div className="p-5">
                      <h3
                        className={`text-base md:text-lg font-bold mb-1.5 line-clamp-2 ${
                          isDark ? "text-white" : "text-slate-900"
                        }`}
                      >
                        {product.name}
                      </h3>

                      <p
                        className={`text-xs md:text-sm mb-3 line-clamp-2 ${
                          isDark ? "text-slate-300" : "text-slate-600"
                        }`}
                      >
                        {product.description}
                      </p>

                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-lg font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}>
                          {formatPrice(product.price)}
                        </span>

                        {product.in_stock ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full dark:bg-emerald-900/40 dark:text-emerald-200">
                            <CheckCircle2 size={12} />
                            Ipo stock{qty > 0 ? `: ${qty}` : ""}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full dark:bg-rose-900/40 dark:text-rose-200">
                            <Package size={12} />
                            Haipo stock
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <span
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                            product.in_stock
                              ? "bg-indigo-600 text-white group-hover:bg-indigo-700"
                              : "bg-slate-400 text-slate-200"
                          }`}
                        >
                          {product.in_stock ? "Angalia zaidi" : "Haipo stock"}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div
              className={`mt-8 text-center rounded-2xl border px-6 py-10 ${
                isDark ? "bg-slate-900/85 border-slate-800" : "bg-white/95 border-slate-100"
              }`}
            >
              <ShoppingCart className={`mx-auto mb-4 ${isDark ? "text-slate-500" : "text-slate-400"}`} size={40} />
              <p className={`text-sm md:text-base ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                Hakuna bidhaa kwa sasa.
              </p>
              <p className={`text-[11px] mt-2 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Ukishaongeza bidhaa kwenye backend (admin), zitaonekana hapa.
              </p>
            </div>
          )}

          {/* Contact */}
          <div
            className={`mt-10 md:mt-12 rounded-2xl border p-6 md:p-8 text-center ${
              isDark ? "bg-slate-900/90 border-slate-800" : "bg-white/95 border-slate-100"
            }`}
          >
            <h2 className={`text-lg md:text-2xl font-extrabold mb-3 ${isDark ? "text-white" : "text-slate-900"}`}>
              Unahitaji msaada kuagiza bidhaa?
            </h2>
            <p className={`text-sm md:text-base mb-5 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
              Unaweza kuwasiliana nasi moja kwa moja ili tukusaidie kuagiza bidhaa ulizozipenda.
            </p>

            <div className="flex flex-col md:flex-row gap-3 justify-center">
              <a
                href="tel:+255767525234"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold text-sm md:text-base"
              >
                Piga Simu: +255 767 525 234
              </a>

              <a
                href="mailto:fmklink@gmail.com"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold text-sm md:text-base"
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
