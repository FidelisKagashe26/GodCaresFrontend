// src/pages/media/MediaDetail.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import SEOHead from "../../components/SEOHead";
import LoadingSpinner from "../../components/LoadingSpinner";
import apiService from "../../services/api";
import { Image, Play, FileText, Download, ArrowLeft, Eye, AlertCircle, Folder, Tag } from "lucide-react";

function SmartImage({ src, alt, isDark, heightClass = "h-[420px]", roundedClass = "rounded-2xl" }) {
  const [broken, setBroken] = useState(false);

  return (
    <div className={`relative w-full ${heightClass} overflow-hidden ${roundedClass} ${isDark ? "bg-gray-900" : "bg-slate-100"}`}>
      {src && !broken ? (
        <>
          <img src={src} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-55" />
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
          <Image className={isDark ? "text-gray-600" : "text-gray-400"} size={40} />
        </div>
      )}
    </div>
  );
}

export default function MediaDetail() {
  const { id } = useParams();
  const { isDark } = useTheme();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = (value) => {
    if (!value) return "";
    const d = new Date(value);
    return d.toLocaleDateString("sw-TZ", { year: "numeric", month: "long", day: "numeric" });
  };

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      setItem(null);

      try {
        const data = await apiService.getMediaItem(id);
        if (!mounted) return;
        setItem(data);
      } catch (err) {
        if (!mounted) return;
        setError(err?.message || "Hitilafu katika kupakia media.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (id) load();
    return () => {
      mounted = false;
    };
  }, [id]);

  const mediaType = item?.media_type || "";
  const isVideo = mediaType === "video";
  const isAudio = mediaType === "audio";
  const isDocument = mediaType === "document";
  const isImage = mediaType === "image";

  const youtubeId = useMemo(() => {
    if (!isVideo || !item?.url) return null;
    try {
      const u = new URL(item.url);
      if (u.hostname.includes("youtube.com")) return u.searchParams.get("v");
      if (u.hostname.includes("youtu.be")) return u.pathname.replace("/", "") || null;
      return null;
    } catch {
      return null;
    }
  }, [isVideo, item]);

  if (loading) {
    return (
      <>
        <SEOHead title="Media | Maktaba ya Media" description="Taarifa za media kutoka GOD CARES 365." />
        <div
          className={`min-h-screen py-12 transition-colors ${
            isDark ? "bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950" : "bg-gradient-to-b from-slate-50 via-white to-emerald-50"
          }`}
        >
          <div className="container mx-auto px-4 md:px-6 flex items-center justify-center min-h-[420px]">
            <LoadingSpinner text="Inapakia media..." size="lg" />
          </div>
        </div>
      </>
    );
  }

  if (error || !item) {
    return (
      <>
        <SEOHead title="Media Haijapatikana" description="Taarifa za media hazikupatikana." />
        <div
          className={`min-h-screen py-12 transition-colors ${
            isDark ? "bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950" : "bg-gradient-to-b from-slate-50 via-white to-emerald-50"
          }`}
        >
          <div className="container mx-auto px-4 md:px-6">
            <div className={`text-center rounded-2xl border px-6 py-10 ${isDark ? "bg-gray-900/85 border-gray-800" : "bg-white/95 border-gray-100"}`}>
              <AlertCircle className={isDark ? "text-rose-300 mx-auto mb-3" : "text-rose-600 mx-auto mb-3"} size={40} />
              <p className={`text-sm md:text-base ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                {error || "Media haijapatikana."}
              </p>
              <Link
                to="/media"
                className="inline-flex items-center mt-4 text-emerald-600 hover:text-emerald-700 dark:text-emerald-300 text-sm font-semibold"
              >
                <ArrowLeft size={16} className="mr-1" />
                Rudi kwenye Maktaba ya Media
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  const previewSrc = item.file || item.thumbnail || "";

  return (
    <>
      <SEOHead title={`${item.title} | Media`} description={(item.description || "").slice(0, 150)} />

      <div
        className={`min-h-screen py-10 md:py-12 transition-colors ${
          isDark ? "bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950" : "bg-gradient-to-b from-slate-50 via-white to-emerald-50"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          {/* Back */}
          <Link
            to="/media"
            className="inline-flex items-center mb-6 md:mb-8 text-emerald-600 hover:text-emerald-700 dark:text-emerald-300 text-xs md:text-sm font-semibold"
          >
            <ArrowLeft size={16} className="mr-1" />
            Rudi kwenye Maktaba ya Media
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
            {/* Main */}
            <div className="lg:col-span-3">
              <div className={`rounded-2xl border shadow-sm p-5 md:p-7 ${isDark ? "bg-gray-900/85 border-gray-800" : "bg-white/95 border-gray-100"}`}>
                {/* Header */}
                <header className="mb-6 md:mb-8">
                  <div className="flex items-center flex-wrap gap-3 mb-3">
                    {isVideo && <Play className="text-sky-500" size={24} />}
                    {isAudio && <FileText className="text-emerald-500" size={24} />}
                    {isDocument && <Download className="text-blue-600" size={24} />}
                    {isImage && <Image className="text-yellow-400" size={24} />}

                    <h1 className={`text-xl md:text-2xl lg:text-3xl font-extrabold ${isDark ? "text-white" : "text-gray-900"}`}>
                      {item.title}
                    </h1>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] md:text-xs">
                    <div className="flex flex-wrap gap-3 items-center">
                      {item.category_name ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-gray-800 px-2.5 py-1 rounded-full text-[11px] text-emerald-700 dark:text-emerald-200">
                          <Folder size={12} />
                          {item.category_name}
                        </span>
                      ) : null}

                      {item.created_at ? (
                        <span className={isDark ? "text-gray-300" : "text-gray-600"}>Imeongezwa: {formatDate(item.created_at)}</span>
                      ) : null}

                      <span className={`flex items-center ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                        <Eye size={14} className="mr-1" />
                        {Number(item.views || 0)} mara
                      </span>

                      {item.tags ? (
                        <span className={`flex items-center ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                          <Tag size={14} className="mr-1" />
                          {item.tags}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </header>

                {/* Preview */}
                <div className="mb-6">
                  {isVideo && youtubeId ? (
                    <div className="aspect-video mb-2">
                      <iframe
                        src={`https://www.youtube.com/embed/${youtubeId}`}
                        title={item.title}
                        className="w-full h-full rounded-2xl"
                        allowFullScreen
                      />
                    </div>
                  ) : null}

                  {isVideo && !youtubeId && item.url ? (
                    <div className={`rounded-2xl border p-4 ${isDark ? "border-gray-800 bg-gray-950/50" : "border-gray-200 bg-slate-50"}`}>
                      <p className={isDark ? "text-gray-200" : "text-gray-700"}>
                        Hii ni video. Fungua kupitia link hii:{" "}
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-sky-600 underline">
                          Tazama Video
                        </a>
                      </p>
                    </div>
                  ) : null}

                  {isAudio && item.file ? <audio controls src={item.file} className="w-full" /> : null}

                  {isDocument && item.file ? (
                    <iframe src={item.file} title={item.title} className="w-full h-[520px] rounded-2xl" />
                  ) : null}

                  {isImage ? (
                    <SmartImage src={previewSrc} alt={item.title} isDark={isDark} heightClass="h-[480px]" />
                  ) : null}

                  {!isVideo && !isAudio && !isDocument && !isImage ? (
                    <SmartImage src={previewSrc} alt={item.title} isDark={isDark} heightClass="h-[480px]" />
                  ) : null}
                </div>

                {/* Description */}
                {item.description ? (
                  <p className={`text-sm md:text-base ${isDark ? "text-gray-200" : "text-gray-700"}`}>{item.description}</p>
                ) : null}

                {/* Actions */}
                <div className="mt-6 flex flex-wrap gap-3">
                  {item.file ? (
                    <a
                      href={item.file}
                      download
                      className="inline-flex items-center bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-full text-xs md:text-sm font-semibold transition-colors"
                    >
                      <Download size={16} className="mr-2" />
                      Pakua Faili
                    </a>
                  ) : null}

                  {item.url && !isVideo ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-full text-xs md:text-sm font-semibold transition-colors"
                    >
                      Fungua Link
                    </a>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className={`rounded-2xl border p-5 md:p-6 ${isDark ? "bg-gray-900/85 border-gray-800" : "bg-white/95 border-gray-100"}`}>
                <h3 className={`text-sm md:text-base font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
                  Maelezo ya Media
                </h3>

                <div className="space-y-3 text-[12px] md:text-xs">
                  <div>
                    <span className={`font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>Aina:</span>
                    <p className={isDark ? "text-gray-100" : "text-gray-800"}>{item.media_type}</p>
                  </div>

                  {item.category_name ? (
                    <div>
                      <span className={`font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>Kundi:</span>
                      <p className={isDark ? "text-gray-100" : "text-gray-800"}>{item.category_name}</p>
                    </div>
                  ) : null}

                  {item.created_at ? (
                    <div>
                      <span className={`font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>Imeongezwa:</span>
                      <p className={isDark ? "text-gray-100" : "text-gray-800"}>{formatDate(item.created_at)}</p>
                    </div>
                  ) : null}

                  {item.updated_at ? (
                    <div>
                      <span className={`font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>Imehaririwa mwisho:</span>
                      <p className={isDark ? "text-gray-100" : "text-gray-800"}>{formatDate(item.updated_at)}</p>
                    </div>
                  ) : null}

                  <div>
                    <span className={`font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>Idadi ya watazamaji:</span>
                    <p className={isDark ? "text-gray-100" : "text-gray-800"}>{Number(item.views || 0)} mara</p>
                  </div>

                  {item.tags ? (
                    <div>
                      <span className={`font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>Tags:</span>
                      <p className={isDark ? "text-gray-100" : "text-gray-800"}>{item.tags}</p>
                    </div>
                  ) : null}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
