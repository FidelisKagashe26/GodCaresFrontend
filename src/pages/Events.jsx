import { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { Calendar, MapPin, Clock, Users, ExternalLink } from 'lucide-react';

export default function Events() {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  // Sample data for demo
  const sampleEvents = [
    {
      id: 1,
      title: 'Semina ya Maombi ya Kina',
      slug: 'semina-maombi-kina',
      description: 'Jiunge nasi katika semina ya siku tatu ya kujifunza jinsi ya kuomba kwa kina na kupata majibu ya maombi yako.',
      location: 'Kanisa la Kimataifa, Dar es Salaam',
      date: '2024-02-15T09:00:00Z',
      end_date: '2024-02-17T17:00:00Z',
      image: 'https://images.pexels.com/photos/8468/pray-hands-bible-christian.jpg?auto=compress&cs=tinysrgb&w=800',
      registration_url: '#',
      is_featured: true,
      max_attendees: 200,
      created_at: '2024-01-15T10:00:00Z'
    },
    {
      id: 2,
      title: 'Mkutano wa Vijana wa Imani',
      slug: 'mkutano-vijana-imani',
      description: 'Mkutano maalum wa vijana kujadili changamoto za kisasa na jinsi ya kuishi maisha ya kikristo.',
      location: 'Uwanja wa Michezo, Mwanza',
      date: '2024-02-20T14:00:00Z',
      end_date: '2024-02-20T18:00:00Z',
      image: 'https://images.pexels.com/photos/1708936/pexels-photo-1708936.jpeg?auto=compress&cs=tinysrgb&w=800',
      registration_url: '#',
      is_featured: false,
      max_attendees: 500,
      created_at: '2024-01-20T10:00:00Z'
    },
    {
      id: 3,
      title: 'Crusade ya Uponyaji',
      slug: 'crusade-uponyaji',
      description: 'Mkutano mkuu wa uponyaji na miujiza. Leteni wagonjwa na walemavu - Mungu yu tayari kuwaponyesha.',
      location: 'Uwanja wa Jangwani, Dodoma',
      date: '2024-03-01T16:00:00Z',
      end_date: '2024-03-03T20:00:00Z',
      image: 'https://images.pexels.com/photos/8468/pray-hands-bible-christian.jpg?auto=compress&cs=tinysrgb&w=800',
      registration_url: '#',
      is_featured: true,
      max_attendees: 1000,
      created_at: '2024-01-25T10:00:00Z'
    }
  ];

  useEffect(() => {
    // Simulate API call
    const fetchEvents = async () => {
      try {
        setLoading(true);
        // In production, this would be: const response = await fetch('/api/events/');
        await new Promise(resolve => setTimeout(resolve, 1000));
        setEvents(sampleEvents);
      } catch (err) {
        setError('Hitilafu katika kupakia matukio');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = events.filter(event => {
    if (filter === 'featured') return event.is_featured;
    if (filter === 'upcoming') {
      const eventDate = new Date(event.date);
      return eventDate > new Date();
    }
    return true;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('sw-TZ', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('sw-TZ', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className={`min-h-screen py-12 transition-colors ${
        isDark ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="container mx-auto px-6 flex items-center justify-center min-h-[400px]">
          <LoadingSpinner text="Inapakia matukio..." size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen py-12 transition-colors ${
        isDark ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="container mx-auto px-6">
          <div className={`text-center card p-8 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <p className="text-red-600 text-lg">{error}</p>
          </div>
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
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="text-white" size={32} />
          </div>
          <h1 className={`text-4xl font-bold mb-4 ${
            isDark ? 'text-white' : 'text-gray-800'
          }`}>Matukio Maalum</h1>
          <p className={`text-lg max-w-2xl mx-auto ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Jiunge nasi katika matukio ya kiroho yanayoleta ukuaji na umoja katika jamii yetu
          </p>
        </header>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {[
            { key: 'all', label: 'Yote' },
            { key: 'featured', label: 'Maalum' },
            { key: 'upcoming', label: 'Zijazo' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                filter === key
                  ? 'bg-purple-600 text-white'
                  : isDark
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className={`card overflow-hidden group hover:scale-105 transition-transform ${
                isDark ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <div className="relative">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {event.is_featured && (
                  <div className="absolute top-4 left-4 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                    Maalum
                  </div>
                )}
              </div>

              <div className="p-6">
                <h3 className={`text-xl font-bold mb-3 ${
                  isDark ? 'text-white' : 'text-gray-800'
                }`}>{event.title}</h3>

                <p className={`text-sm mb-4 ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>{event.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm">
                    <Calendar className="text-purple-600 mr-2" size={16} />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                      {formatDate(event.date)}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="text-purple-600 mr-2" size={16} />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                      {formatTime(event.date)}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="text-purple-600 mr-2" size={16} />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                      {event.location}
                    </span>
                  </div>
                  {event.max_attendees && (
                    <div className="flex items-center text-sm">
                      <Users className="text-purple-600 mr-2" size={16} />
                      <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                        Hadi watu {event.max_attendees}
                      </span>
                    </div>
                  )}
                </div>

                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center">
                  <ExternalLink className="mr-2" size={16} />
                  Jisajili Sasa
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className={`text-center card p-8 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <Calendar className={`mx-auto mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} size={48} />
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Hakuna matukio yaliyopatikana kwa sasa
            </p>
          </div>
        )}
      </div>
    </div>
  );
}