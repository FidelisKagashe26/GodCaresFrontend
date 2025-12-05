// src/pages/media/MediaLibrary.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import apiService from '../../services/api';
import {
  Image,
  Play,
  FileText,
  Download,
  Search,
  Filter,
  Eye,
} from 'lucide-react';

// Sample fallback data kama backend ikileta 500
const sampleMedia = [
  {
    id: 1,
    title: 'Mahubiri ya Jumapili: Upendo wa Mungu',
    description:
      'Mahubiri kamili kuhusu upendo wa Mungu na jinsi unavyoathiri maisha yetu ya kila siku.',
    media_type: 'video',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail:
      'https://images.pexels.com/photos/8468/pray-hands-bible-christian.jpg?auto=compress&cs=tinysrgb&w=400',
    category_name: 'Mahubiri',
    tags: 'upendo, Mungu, mahubiri',
    views: 2500,
    created_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 2,
    title: 'Nyimbo za Sifa: Mkusanyiko wa Nyimbo',
    description:
      'Mkusanyiko wa nyimbo za sifa na ibada kwa matumizi ya kanisa na familia.',
    media_type: 'audio',
    file: '/media/audio/nyimbo-za-sifa.mp3',
    thumbnail:
      'https://images.pexels.com/photos/1708936/pexels-photo-1708936.jpeg?auto=compress&cs=tinysrgb&w=400',
    category_name: 'Muziki',
    tags: 'nyimbo, sifa, ibada',
    views: 1800,
    created_at: '2024-01-20T10:00:00Z',
  },
  {
    id: 3,
    title: 'Mwongozo wa Kusoma Biblia',
    description:
      'Kitabu cha mwongozo wa jinsi ya kusoma na kuelewa Biblia kwa ufanisi.',
    media_type: 'document',
    file: '/media/documents/mwongozo-biblia.pdf',
    thumbnail:
      'https://images.pexels.com/photos/1112048/pexels-photo-1112048.jpeg?auto=compress&cs=tinysrgb&w=400',
    category_name: 'Vitabu',
    tags: 'mwongozo, biblia, kusoma',
    views: 950,
    created_at: '2024-01-25T10:00:00Z',
  },
];

export default function MediaLibrary() {
  const { isDark } = useTheme();
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all'); // all, video, audio, document, image

  const mediaTypes = [
    { id: 'all', name: 'Yote', icon: Image },
    { id: 'video', name: 'Video', icon: Play },
    { id: 'audio', name: 'Audio', icon: FileText },
    { id: 'document', name: 'Nyaraka', icon: Download },
    { id: 'image', name: 'Picha', icon: Image },
  ];

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      setUsingFallback(false);
      try {
        const data = await apiService.getMediaItems();
        if (!isMounted) return;

        const list = Array.isArray(data) ? data : data?.results || [];
        setMediaItems(list);
      } catch (err) {
        console.error('Media API error:', err);
        if (!isMounted) return;

        // tunahakikisha tunahifadhi string, si object
        const msg =
          err?.message && typeof err.message === 'string'
            ? err.message
            : 'Hitilafu katika kupakia media kutoka kwenye seva. Tunaonyesha data za mfano.';

        setError(msg);
        setUsingFallback(true);
        setMediaItems(sampleMedia);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredMedia = mediaItems.filter((item) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      !term ||
      (item.title && item.title.toLowerCase().includes(term)) ||
      (item.description &&
        item.description.toLowerCase().includes(term)) ||
      (item.tags && item.tags.toLowerCase().includes(term));

    const matchesType =
      selectedType === 'all' || item.media_type === selectedType;

    return matchesSearch && matchesType;
  });

  const getMediaIcon = (type) => {
    switch (type) {
      case 'video':
        return Play;
      case 'audio':
        return FileText;
      case 'document':
        return Download;
      case 'image':
        return Image;
      default:
        return FileText;
    }
  };

  // brand colors: kijani, blue, njano
  const getMediaColor = (type) => {
    switch (type) {
      case 'video':
        return 'text-sky-600';
      case 'audio':
        return 'text-emerald-600';
      case 'document':
        return 'text-blue-600';
      case 'image':
        return 'text-yellow-400';
      default:
        return 'text-gray-600';
    }
  };

  // Loading
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

  const errorMessage =
    typeof error === 'string'
      ? error
      : error?.message || null;

  return (
    <div
      className={`min-h-screen py-10 md:py-12 transition-colors ${
        isDark
          ? 'bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950'
          : 'bg-gradient-to-b from-slate-50 via-white to-emerald-50'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <header className="text-center mb-8 md:mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 via-sky-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md shadow-emerald-400/40">
            <Image className="text-white" size={32} />
          </div>
          <h1
            className={`text-2xl md:text-3xl font-extrabold mb-3 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            Maktaba ya Media
          </h1>
          <p
            className={`text-sm md:text-base max-w-2xl mx-auto ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            Pata rasilimali za video, sauti, nyaraka na picha za kiroho – zikiwa
            zimepangwa kwa urahisi.
          </p>

          {/* Info badge — kama tuko kwenye fallback */}
          {usingFallback && (
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] md:text-xs border border-yellow-400/60 bg-yellow-50/80 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-200">
              <span className="w-2 h-2 rounded-full bg-yellow-400" />
              <span>
                Seva imerudisha hitilafu (500). Unaona data za mfano kwa sasa.
              </span>
            </div>
          )}
        </header>

        {/* Kama kuna error, tuioneshe juu kidogo (lakini siyo kuua page) */}
        {errorMessage && (
          <div
            className={`mb-6 rounded-2xl border px-4 py-3 text-center text-xs md:text-sm ${
              isDark
                ? 'bg-red-900/40 border-red-800 text-red-100'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}
          >
            {errorMessage}
          </div>
        )}

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}
              size={18}
            />
            <input
              type="text"
              placeholder="Tafuta kwa kichwa, maelezo au tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 rounded-full border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                isDark
                  ? 'bg-gray-900/80 border-gray-700 text-white placeholder:text-gray-500'
                  : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-500'
              }`}
            />
          </div>

          {/* Type chips */}
          <div className="flex items-center justify-center md:justify-end">
            <div
              className={`inline-flex rounded-full p-1 border ${
                isDark
                  ? 'bg-gray-900 border-gray-700'
                  : 'bg-white border-gray-200'
              }`}
            >
              {mediaTypes.map(({ id, name, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setSelectedType(id)}
                  className={`flex items-center px-3 md:px-4 py-1 rounded-full text-[11px] md:text-xs font-semibold transition-colors ${
                    selectedType === id
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-400/40'
                      : isDark
                      ? 'text-gray-300 hover:text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon size={14} className="mr-1" />
                  {name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Media grid / empty state */}
        {filteredMedia.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredMedia.map((item) => {
              const MediaIcon = getMediaIcon(item.media_type);
              const iconColor = getMediaColor(item.media_type);

              return (
                <Link
                  key={item.id}
                  to={`/media/${item.id}`}
                  className={`overflow-hidden rounded-2xl border shadow-sm group transition-all hover:-translate-y-1 hover:shadow-md ${
                    isDark
                      ? 'bg-gray-900/85 border-gray-800'
                      : 'bg-white/95 border-gray-100'
                  }`}
                >
                  <div className="relative">
                    {item.thumbnail && (
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-44 md:h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                    <div className="absolute top-3 left-3 bg-black/70 text-white p-2 rounded-xl flex items-center">
                      <MediaIcon size={18} className="mr-1" />
                      <span className="text-[11px] capitalize">
                        {item.media_type}
                      </span>
                    </div>
                    {item.category_name && (
                      <div className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] px-2.5 py-1 rounded-full">
                        {item.category_name}
                      </div>
                    )}
                  </div>

                  <div className="p-5 md:p-6">
                    <h3
                      className={`text-base md:text-lg font-bold mb-2 group-hover:text-emerald-600 transition-colors ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {item.title}
                    </h3>
                    {item.description && (
                      <p
                        className={`text-xs md:text-sm mb-4 line-clamp-3 ${
                          isDark ? 'text-gray-300' : 'text-gray-600'
                        }`}
                      >
                        {item.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-[11px] md:text-xs mb-1.5">
                      <span
                        className={`flex items-center ${
                          isDark ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        <Eye size={12} className="mr-1" />
                        {item.views} mara
                      </span>
                      <span className={`capitalize font-semibold ${iconColor}`}>
                        {item.media_type}
                      </span>
                    </div>

                    {item.tags && (
                      <p
                        className={`text-[11px] mt-1 line-clamp-1 ${
                          isDark ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        {item.tags}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div
            className={`mt-8 text-center rounded-2xl border px-6 py-10 ${
              isDark
                ? 'bg-gray-900/85 border-gray-800'
                : 'bg-white/95 border-gray-100'
            }`}
          >
            <Image
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
              Hakuna media iliyopatikana kwa vigezo ulivyotafuta.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
