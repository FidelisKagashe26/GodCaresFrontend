// src/pages/media/Media.jsx
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
  Eye,
} from 'lucide-react';

export default function Media() {
  const { isDark } = useTheme();
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        // /media/ kupitia apiService
        const data = await apiService.getMediaItems();
        const list = Array.isArray(data) ? data : data.results || [];
        setMediaItems(list);
      } catch (err) {
        setError(err.message || 'Hitilafu katika kupakia media.');
      } finally {
        setLoading(false);
      }
    };

    load();
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

  const getMediaColor = (type) => {
    switch (type) {
      case 'video':
        return 'text-red-600';
      case 'audio':
        return 'text-purple-600';
      case 'document':
        return 'text-blue-600';
      case 'image':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen py-12 transition-colors ${
          isDark ? 'bg-gray-900' : 'bg-gray-50'
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-center min-h-[400px]">
          <LoadingSpinner text="Inapakia media..." size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`min-h-screen py-12 transition-colors ${
          isDark ? 'bg-gray-900' : 'bg-gray-50'
        }`}
      >
        <div className="container mx-auto px-6">
          <div
            className={`text-center card p-8 ${
              isDark ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <p className="text-red-600 text-lg">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen py-12 transition-colors ${
        isDark ? 'bg-gray-900' : 'bg-gray-50'
      }`}
    >
      <div className="container mx-auto px-6">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Image className="text-white" size={32} />
          </div>
          <h1
            className={`text-4xl font-bold mb-4 ${
              isDark ? 'text-white' : 'text-gray-800'
            }`}
          >
            Maktaba ya Media
          </h1>
          <p
            className={`text-lg max-w-2xl mx-auto ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            Pata rasilimali za video, audio, nyaraka, na picha za kiroho.
          </p>
        </header>

        {/* Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}
              size={20}
            />
            <input
              type="text"
              placeholder="Tafuta media..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                isDark
                  ? 'bg-gray-800 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>
        </div>

        {/* Type filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {mediaTypes.map(({ id, name, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setSelectedType(id)}
              className={`flex items-center px-6 py-2 rounded-full font-medium transition-colors ${
                selectedType === id
                  ? 'bg-purple-600 text-white'
                  : isDark
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Icon size={16} className="mr-2" />
              {name}
            </button>
          ))}
        </div>

        {/* Media grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMedia.map((item) => {
            const MediaIcon = getMediaIcon(item.media_type);
            const iconColor = getMediaColor(item.media_type);

            return (
              <Link
                key={item.id}
                to={`/media/${item.id}`}
                className={`card overflow-hidden group hover:scale-105 transition-transform ${
                  isDark ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                <div className="relative">
                  {item.thumbnail && (
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  )}
                  <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white p-2 rounded-lg">
                    <MediaIcon size={20} />
                  </div>
                  {item.category_name && (
                    <div className="absolute top-4 right-4 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                      {item.category_name}
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3
                    className={`text-lg font-bold mb-3 ${
                      isDark ? 'text-white' : 'text-gray-800'
                    }`}
                  >
                    {item.title}
                  </h3>
                  {item.description && (
                    <p
                      className={`text-sm mb-4 ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    >
                      {item.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="flex items-center">
                      <Eye size={12} className="mr-1" />
                      {item.views} mara
                    </span>
                    <span className={`capitalize ${iconColor}`}>
                      {item.media_type}
                    </span>
                  </div>
                  {item.tags && (
                    <p
                      className={`text-[11px] mt-1 ${
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

        {filteredMedia.length === 0 && (
          <div
            className={`text-center card p-8 ${
              isDark ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <Image
              className={`mx-auto mb-4 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}
              size={48}
            />
            <p
              className={`text-lg ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              Hakuna media iliyopatikana.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
