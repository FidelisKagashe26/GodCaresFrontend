// src/pages/media/Media.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import SEOHead from "../../components/SEOHead";
import LoadingSpinner from "../../components/LoadingSpinner";
import apiService from "../../services/api";
import { Image, Play, FileText, Download, Search, Eye, Tag, Folder } from "lucide-react";

/**
 * SmartImage (NO CROP):
 * - nyuma: image object-cover + blur (inajaza box)
 * - mbele: image object-contain (true image haikatwi)
 */
function SmartImage({ src, alt, isDark, heightClass = "h-48", roundedClass = "rounded-xl" }) {
  const [broken, setBroken] = useState(false);

  return (
    <div
      className={`relative w-full ${heightClass} overflow-hidden ${roundedClass} ${
        isDark ? "bg-gray-900" : "bg-slate-100"
      }`}
    >
      {src && !broken ? (
        <>
          {/* blurred background */}
          <img
            src={src}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover scale-110 blur-xl opacity-55"
          />
          {/* foreground (no crop) */}
          <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            onError={() => setBroken(true)}
            className="relative z-10 w-full h-full object-contain"
          />
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Image className={isDark ? "text-gray-600" : "text-gray-400"} size={36} />
        </div>
      )}
    </div>
  );
}

const MEDIA_TYPES = [
  { id: "all", name: "Yote", icon: Image },
  { id: "video", name: "Video", icon: Play },
  { id: "audio", name: "Audio", icon: FileText },
  { id: "document", name: "Nyaraka", icon: Download },
  { id: "image", name: "Picha", icon: Image },
];

export default function Media() {
  const { isDark } = useTheme();

  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch((searchTerm || "").trim()), 350);
    return () => clearTimeout(t);
  }, [searchTerm]);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        // params hizi ni "safe" hata backend ikizipuuza
        const params = {
          search: debouncedSearch || undefined,
          media_type: selectedType !== "all" ? selectedType : undefined,
          ordering: "-created_at",
        };

        const data = await apiService.getMediaItems(params);
        const list = Array.isArray(data) ? data : data?.results || [];

        if (!mounted) return;
        setMediaItems(list);
      } catch (err) {
        if (!mounted) return;
        setError(err?.message || "Hitilafu katika kupakia media.");
        setMediaItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [debouncedSearch, selectedType]);

  const filteredMedia = useMemo(() => {
    const term = (debouncedSearch || "").toLowerCase();

    return (mediaItems || []).filter((item) => {
      const matchesType = selectedType === "all" || item.media_type === selectedType;

      const matchesSearch =
        !term ||
        (item.title && item.title.toLowerCase().includes(term)) ||
        (item.description && item.description.toLowerCase().includes(term)) ||
        (item.tags && String(item.tags).toLowerCase().includes(term)) ||
        (item.category_name && String(item.category_name).toLowerCase().includes(term));

      return matchesType && matchesSearch;
    });
  }, [mediaItems, debouncedSearch, selectedType]);

  const getTypeBadge = (type) => {
    const map = {
      video: { label: "video", cls: "bg-sky-600 text-white" },
      audio: { label: "audio", cls: "bg-emerald-600 text-white" },
      document: { label: "document", cls: "bg-blue-600 text-white" },
      image: { label: "image", cls: "bg-yellow-400 text-gray-900" },
    };
    return map[type] || { label: type || "media", cls: "bg-gray-600 text-white" };
  };

  if (loading) {
    return (
      <>
        <SEOHead
          title="Maktaba ya Media"
          description="Pata rasilimali za video, audio, nyaraka, na picha za kiroho."
          keywords="media, video, audio, nyaraka, picha, kiroho"
        />
        <div
          className={`min-h-screen py-12 transition-colors ${
            isDark
              ? "bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950"
              : "bg-gradient-to-b from-slate-50 via-white to-emerald-50"
          }`}
        >
          <div className="container mx-auto px-4 md:px-6 flex items-center justify-center min-h-[420px]">
            <LoadingSpinner text="Inapakia media..." size="lg" />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead
        title="Maktaba ya Media"
        description="Pata rasilimali za video, audio, nyaraka, na picha za kiroho."
        keywords="media, video, audio, nyaraka, picha, kiroho"
      />

      <div
        className={`min-h-screen py-10 md:py-12 transition-colors ${
          isDark
            ? "bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950"
            : "bg-gradient-to-b from-slate-50 via-white to-emerald-50"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          {/* Header */}
          <header className="text-center mb-8 md:mb-10">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 via-sky-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md shadow-emerald-400/40">
              <Image className="text-white" size={32} />
            </div>

            <h1 className={`text-2xl md:text-3xl font-extrabold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
              Maktaba ya Media
            </h1>

            <p className={`text-sm md:text-base max-w-2xl mx-auto ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              Pata rasilimali za video, sauti, nyaraka na picha za kiroho – zikiwa zimepangwa kwa urahisi.
            </p>

            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] md:text-xs border border-emerald-500/40 bg-emerald-50/70 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{filteredMedia.length} media</span>
            </div>
          </header>

          {error && (
            <div
              className={`mb-6 rounded-2xl border px-4 py-3 text-center text-xs md:text-sm ${
                isDark ? "bg-red-900/40 border-red-800 text-red-100" : "bg-red-50 border-red-200 text-red-700"
              }`}
            >
              {error}
            </div>
          )}

          {/* Search & Type */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? "text-gray-400" : "text-gray-500"}`}
                size={18}
              />
              <input
                type="text"
                placeholder="Tafuta kwa kichwa, maelezo, tag au kundi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-full border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  isDark
                    ? "bg-gray-900/80 border-gray-700 text-white placeholder:text-gray-500"
                    : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-500"
                }`}
              />
            </div>

            {/* Type chips */}
            <div className="flex items-center justify-center md:justify-end">
              <div className={`inline-flex rounded-full p-1 border ${isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}>
                {MEDIA_TYPES.map(({ id, name, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setSelectedType(id)}
                    className={`flex items-center px-3 md:px-4 py-1 rounded-full text-[11px] md:text-xs font-semibold transition-colors ${
                      selectedType === id
                        ? "bg-emerald-600 text-white shadow-sm shadow-emerald-400/40"
                        : isDark
                        ? "text-gray-300 hover:text-white"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <Icon size={14} className="mr-1" />
                    {name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grid */}
          {filteredMedia.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredMedia.map((item) => {
                const badge = getTypeBadge(item.media_type);

                return (
                  <Link
                    key={item.id}
                    to={`/media/${item.id}`}
                    className={`overflow-hidden rounded-2xl border shadow-sm group transition-all hover:-translate-y-1 hover:shadow-md ${
                      isDark ? "bg-gray-900/85 border-gray-800" : "bg-white/95 border-gray-100"
                    }`}
                  >
                    <div className="p-4">
                      <SmartImage
                        src={item.thumbnail || item.file || ""}
                        alt={item.title}
                        isDark={isDark}
                        heightClass="h-44 md:h-48"
                        roundedClass="rounded-2xl"
                      />
                    </div>

                    <div className="px-5 pb-5">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold ${badge.cls}`}>
                          {badge.label}
                        </span>

                        {item.category_name ? (
                          <span className="inline-flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200">
                            <Folder size={12} />
                            {item.category_name}
                          </span>
                        ) : null}
                      </div>

                      <h3 className={`text-base md:text-lg font-bold mb-2 line-clamp-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                        {item.title}
                      </h3>

                      {item.description ? (
                        <p className={`text-xs md:text-sm mb-4 line-clamp-3 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                          {item.description}
                        </p>
                      ) : (
                        <div className="mb-4" />
                      )}

                      <div className="flex items-center justify-between text-[11px] md:text-xs">
                        <span className={`${isDark ? "text-gray-400" : "text-gray-500"} inline-flex items-center gap-1`}>
                          <Eye size={12} />
                          {Number(item.views || 0)} mara
                        </span>

                        {item.tags ? (
                          <span className={`${isDark ? "text-gray-400" : "text-gray-500"} inline-flex items-center gap-1 line-clamp-1`}>
                            <Tag size={12} />
                            {item.tags}
                          </span>
                        ) : (
                          <span className={`${isDark ? "text-gray-500" : "text-gray-400"}`}>—</span>
                        )}
                      </div>

                      <div className="mt-4">
                        <span className="inline-flex items-center text-emerald-600 group-hover:text-emerald-700 font-semibold text-xs md:text-sm">
                          Angalia zaidi
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className={`mt-8 text-center rounded-2xl border px-6 py-10 ${isDark ? "bg-gray-900/85 border-gray-800" : "bg-white/95 border-gray-100"}`}>
              <Image className={`mx-auto mb-4 ${isDark ? "text-gray-500" : "text-gray-400"}`} size={40} />
              <p className={`text-sm md:text-base ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                Hakuna media iliyopatikana kwa vigezo ulivyoweka.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
