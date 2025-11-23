import { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Image, 
  Play, 
  FileText, 
  Download, 
  Search, 
  Filter,
  Eye
} from 'lucide-react';

export default function MediaLibrary() {
  const { isDark } = useTheme();
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  // Sample data for demo
  const sampleMedia = [
    {
      id: 1,
      title: 'Mahubiri ya Jumapili: Upendo wa Mungu',
      description: 'Mahubiri kamili kuhusu upendo wa Mungu na jinsi unavyoathiri maisha yetu ya kila siku.',
      media_type: 'video',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnail: 'https://images.pexels.com/photos/8468/pray-hands-bible-christian.jpg?auto=compress&cs=tinysrgb&w=400',
      category_name: 'Mahubiri',
      tags: 'upendo, Mungu, mahubiri',
      views: 2500,
      created_at: '2024-01-15T10:00:00Z'
    },
    {
      id: 2,
      title: 'Nyimbo za Sifa: Mkusanyiko wa Nyimbo',
      description: 'Mkusanyiko wa nyimbo za sifa na ibada kwa matumizi ya kanisa na familia.',
      media_type: 'audio',
      file: '/media/audio/nyimbo-za-sifa.mp3',
      thumbnail: 'https://images.pexels.com/photos/1708936/pexels-photo-1708936.jpeg?auto=compress&cs=tinysrgb&w=400',
      category_name: 'Muziki',
      tags: 'nyimbo, sifa, ibada',
      views: 1800,
      created_at: '2024-01-20T10:00:00Z'
    },
    {
      id: 3,
      title: 'Mwongozo wa Kusoma Biblia',
      description: 'Kitabu cha mwongozo wa jinsi ya kusoma na kuelewa Biblia kwa ufanisi.',
      media_type: 'document',
      file: '/media/documents/mwongozo-biblia.pdf',
      thumbnail: 'https://images.pexels.com/photos/1112048/pexels-photo-1112048.jpeg?auto=compress&cs=tinysrgb&w=400',
      category_name: 'Vitabu',
      tags: 'mwongozo, biblia, kusoma',
      views: 950,
      created_at: '2024-01-25T10:00:00Z'
    }
  ];

  const mediaTypes = [
    { id: 'all', name: 'Yote', icon: Image },
    { id: 'video', name: 'Video', icon: Play },
    { id: 'audio', name: 'Audio', icon: FileText },
    { id: 'document', name: 'Nyaraka', icon: Download },
    { id: 'image', name: 'Picha', icon: Image }
  ];

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setLoading(true);
        // In production: const response = await fetch('/api/media/');
        await new Promise(resolve => setTimeout(resolve, 1000));
        setMediaItems(sampleMedia);
      } catch (err) {
        setError('Hitilafu katika kupakia media');
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, []);

  const filteredMedia = mediaItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || item.media_type === selectedType;
    return matchesSearch && matchesType;
  });

  const getMediaIcon = (type) => {
    switch (type) {
      case 'video': return Play;
      case 'audio': return FileText;
      case 'document': return Download;
      case 'image': return Image;
      default: return FileText;
    }
  };

  const getMediaColor = (type) => {
    switch (type) {
      case 'video': return 'text-red-600';
      case 'audio': return 'text-purple-600';
      case 'document': return 'text-blue-600';
      case 'image': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen py-12 transition-colors ${
        isDark ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="container mx-auto px-6 flex items-center justify-center min-h-[400px]">
          <LoadingSpinner text="Inapakia media..." size="lg" />
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
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Image className="text-white" size={32} />
          </div>
          <h1 className={`text-4xl font-bold mb-4 ${
            isDark ? 'text-white' : 'text-gray-800'
          }`}>Maktaba ya Media</h1>
          <p className={`text-lg max-w-2xl mx-auto ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Pata rasilimali za video, audio, nyaraka, na picha za kiroho
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

        {/* Media Type Filters */}
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

        {/* Media Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMedia.map(item => {
            const MediaIcon = getMediaIcon(item.media_type);
            const iconColor = getMediaColor(item.media_type);

            return (
              <div
                key={item.id}
                className={`card overflow-hidden group hover:scale-105 transition-transform ${
                  isDark ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                <div className="relative">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white p-2 rounded-lg">
                    <MediaIcon size={20} />
                  </div>
                  <div className="absolute top-4 right-4 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                    {item.category_name}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className={`text-lg font-bold mb-3 ${
                    isDark ? 'text-white' : 'text-gray-800'
                  }`}>{item.title}</h3>
                  <p className={`text-sm mb-4 ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>{item.description}</p>

                  <div className="flex items-center justify-between text-xs mb-4">
                    <span className="flex items-center">
                      <Eye size={12} className="mr-1" />
                      {item.views} mara
                    </span>
                    <span className={`capitalize ${iconColor}`}>
                      {item.media_type}
                    </span>
                  </div>

                  <div className="flex space-x-2">
                    {item.media_type === 'video' && item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors text-center flex items-center justify-center"
                      >
                        <Play size={16} className="mr-1" />
                        Tazama
                      </a>
                    )}
                    {item.file && (
                      <a
                        href={item.file}
                        download
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors text-center flex items-center justify-center"
                      >
                        <Download size={16} className="mr-1" />
                        Pakua
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredMedia.length === 0 && (
          <div className={`text-center card p-8 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <Image className={`mx-auto mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} size={48} />
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Hakuna media iliyopatikana
            </p>
          </div>
        )}
      </div>
    </div>
  );
}