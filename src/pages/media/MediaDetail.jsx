// src/pages/media/MediaDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import apiService from '../../services/api';
import {
  Image,
  Play,
  FileText,
  Download,
  ArrowLeft,
  Eye,
} from 'lucide-react';

export default function MediaDetail() {
  const { id } = useParams();
  const { isDark } = useTheme();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = (value) => {
    if (!value) return '';
    const d = new Date(value);
    return d.toLocaleDateString('sw-TZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiService.getMediaItem(id);
        setItem(data);
      } catch (err) {
        setError(err.message || 'Hitilafu katika kupakia media.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      load();
    }
  }, [id]);

  if (loading) {
    return (
      <div
        className={`min-h-screen py-12 transition-colors ${
          isDark
            ? 'bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950'
            : 'bg-gradient-to-b from-slate-50 via-white to-emerald-50'
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-center min-h-[400px]">
          <LoadingSpinner text="Inapakia media..." size="lg" />
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
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
              {error || 'Media haijapatikana.'}
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
    );
  }

  const isVideo = item.media_type === 'video';
  const isAudio = item.media_type === 'audio';
  const isDocument = item.media_type === 'document';
  const isImage = item.media_type === 'image';

  const youtubeId =
    isVideo && item.url && item.url.includes('youtube')
      ? new URL(item.url).searchParams.get('v')
      : null;

  return (
    <div
      className={`min-h-screen py-10 md:py-12 transition-colors ${
        isDark
          ? 'bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950'
          : 'bg-gradient-to-b from-slate-50 via-white to-emerald-50'
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
            <div
              className={`rounded-2xl border shadow-sm p-5 md:p-7 ${
                isDark
                  ? 'bg-gray-900/85 border-gray-800'
                  : 'bg-white/95 border-gray-100'
              }`}
            >
              {/* Header */}
              <header className="mb-6 md:mb-8">
                <div className="flex items-center flex-wrap gap-3 mb-3">
                  {isVideo && (
                    <Play className="text-sky-500" size={24} />
                  )}
                  {isAudio && (
                    <FileText className="text-emerald-500" size={24} />
                  )}
                  {isDocument && (
                    <Download className="text-blue-600" size={24} />
                  )}
                  {isImage && (
                    <Image className="text-yellow-400" size={24} />
                  )}
                  <h1
                    className={`text-xl md:text-2xl lg:text-3xl font-extrabold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {item.title}
                  </h1>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] md:text-xs">
                  <div className="flex flex-wrap gap-3 items-center">
                    {item.category_name && (
                      <span className="bg-emerald-50 dark:bg-gray-800 px-2.5 py-1 rounded-full text-[11px] text-emerald-700 dark:text-emerald-200">
                        {item.category_name}
                      </span>
                    )}
                    {item.created_at && (
                      <span
                        className={
                          isDark ? 'text-gray-300' : 'text-gray-600'
                        }
                      >
                        Imeongezwa: {formatDate(item.created_at)}
                      </span>
                    )}
                    <span
                      className={`flex items-center ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    >
                      <Eye size={14} className="mr-1" />
                      {item.views} mara
                    </span>
                  </div>
                </div>
              </header>

              {/* Preview */}
              <div className="mb-6">
                {isVideo && youtubeId && (
                  <div className="aspect-video mb-4">
                    <iframe
                      src={`https://www.youtube.com/embed/${youtubeId}`}
                      title={item.title}
                      className="w-full h-full rounded-xl"
                      allowFullScreen
                    />
                  </div>
                )}

                {isVideo && !youtubeId && item.url && (
                  <p
                    className={
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }
                  >
                    Hii ni video. Fungua kupitia link hii:{' '}
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-600 underline"
                    >
                      Tazama Video
                    </a>
                  </p>
                )}

                {isAudio && item.file && (
                  <div className="mb-4">
                    <audio controls src={item.file} className="w-full" />
                  </div>
                )}

                {isImage && (item.file || item.thumbnail) && (
                  <img
                    src={item.file || item.thumbnail}
                    alt={item.title}
                    className="w-full max-h-[480px] object-contain rounded-xl mb-4"
                  />
                )}

                {isDocument && item.file && (
                  <div className="mb-4">
                    <iframe
                      src={item.file}
                      title={item.title}
                      className="w-full h-[480px] rounded-xl"
                    />
                  </div>
                )}
              </div>

              {/* Description */}
              {item.description && (
                <p
                  className={`text-sm md:text-base mb-4 ${
                    isDark ? 'text-gray-200' : 'text-gray-700'
                  }`}
                >
                  {item.description}
                </p>
              )}

              {/* Tags */}
              {item.tags && (
                <div className="mt-4">
                  <h3
                    className={`text-sm font-semibold mb-2 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    Vitambulisho:
                  </h3>
                  <p
                    className={`text-[12px] md:text-xs ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}
                  >
                    {item.tags}
                  </p>
                </div>
              )}

              {/* Download/Open buttons */}
              <div className="mt-6 flex flex-wrap gap-3">
                {item.file && (
                  <a
                    href={item.file}
                    download
                    className="inline-flex items-center bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-full text-xs md:text-sm font-semibold transition-colors"
                  >
                    <Download size={16} className="mr-2" />
                    Pakua Faili
                  </a>
                )}

                {item.url && !isVideo && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-full text-xs md:text-sm font-semibold transition-colors"
                  >
                    Fungua Link
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div
              className={`rounded-2xl border p-5 md:p-6 ${
                isDark
                  ? 'bg-gray-900/85 border-gray-800'
                  : 'bg-white/95 border-gray-100'
              }`}
            >
              <h3
                className={`text-sm md:text-base font-bold mb-4 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                Maelezo ya Media
              </h3>
              <div className="space-y-3 text-[12px] md:text-xs">
                <div>
                  <span
                    className={`font-medium ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}
                  >
                    Aina:
                  </span>
                  <p
                    className={isDark ? 'text-gray-100' : 'text-gray-800'}
                  >
                    {item.media_type}
                  </p>
                </div>
                {item.category_name && (
                  <div>
                    <span
                      className={`font-medium ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    >
                      Kundi:
                    </span>
                    <p
                      className={
                        isDark ? 'text-gray-100' : 'text-gray-800'
                      }
                    >
                      {item.category_name}
                    </p>
                  </div>
                )}
                {item.created_at && (
                  <div>
                    <span
                      className={`font-medium ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    >
                      Imeongezwa:
                    </span>
                    <p
                      className={
                        isDark ? 'text-gray-100' : 'text-gray-800'
                      }
                    >
                      {formatDate(item.created_at)}
                    </p>
                  </div>
                )}
                {item.updated_at && (
                  <div>
                    <span
                      className={`font-medium ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    >
                      Imehaririwa mwisho:
                    </span>
                    <p
                      className={
                        isDark ? 'text-gray-100' : 'text-gray-800'
                      }
                    >
                      {formatDate(item.updated_at)}
                    </p>
                  </div>
                )}
                <div>
                  <span
                    className={`font-medium ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}
                  >
                    Idadi ya watazamaji:
                  </span>
                  <p
                    className={
                      isDark ? 'text-gray-100' : 'text-gray-800'
                    }
                  >
                    {item.views} mara
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
