// src/pages/events/Events.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import apiService from '../../services/api';
import { Calendar, MapPin, Clock, Users, ExternalLink } from 'lucide-react';

export default function Events() {
  const { isDark } = useTheme();
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('all'); // all | featured | upcoming
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ================= HELPERS =================
  const formatDate = (value) => {
    if (!value) return '';
    const d = new Date(value);
    return d.toLocaleDateString('sw-TZ', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (value) => {
    if (!value) return '';
    const d = new Date(value);
    return d.toLocaleTimeString('sw-TZ', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStartDate = (ev) => ev.start_date || ev.date || ev.start || null;
  const getEndDate = (ev) => ev.end_date || ev.finish_date || ev.end || null;

  // ================= FETCH FROM API =================
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        // /events/ endpoint kupitia apiService (VITE_API_URL inaheshimika)
        const data = await apiService.getEvents({
          ordering: 'start_date',
        });

        const list = Array.isArray(data) ? data : data.results || [];
        setEvents(list);
      } catch (err) {
        setError(err.message || 'Hitilafu katika kupakia matukio.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const now = new Date();

  const filteredEvents = events
    .filter((event) => {
      const startDate = getStartDate(event);
      const startObj = startDate ? new Date(startDate) : null;

      if (filter === 'featured') {
        return !!event.is_featured;
      }
      if (filter === 'upcoming') {
        if (!startObj) return false;
        return startObj >= now;
      }
      return true; // all
    })
    .sort((a, b) => {
      const da = getStartDate(a) ? new Date(getStartDate(a)).getTime() : 0;
      const db = getStartDate(b) ? new Date(getStartDate(b)).getTime() : 0;
      return da - db;
    });

  // ================= STATES =================
  if (loading) {
    return (
      <div
        className={`min-h-screen py-12 transition-colors ${
          isDark ? 'bg-gray-900' : 'bg-gray-50'
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-center min-h-[400px]">
          <LoadingSpinner text="Inapakia matukio..." size="lg" />
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

  // ================= VIEW =================
  return (
    <div
      className={`min-h-screen py-12 transition-colors ${
        isDark ? 'bg-gray-900' : 'bg-gray-50'
      }`}
    >
      <div className="container mx-auto px-6">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="text-white" size={32} />
          </div>
          <h1
            className={`text-4xl font-bold mb-4 ${
              isDark ? 'text-white' : 'text-gray-800'
            }`}
          >
            Matukio Maalum
          </h1>
          <p
            className={`text-lg max-w-2xl mx-auto ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            Jiunge nasi katika matukio ya kiroho yanayoleta ukuaji na umoja
            katika jamii yetu.
          </p>
        </header>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {[
            { key: 'all', label: 'Yote' },
            { key: 'featured', label: 'Maalum' },
            { key: 'upcoming', label: 'Zijazo' },
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

        {/* Events grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => {
            const startDate = getStartDate(event);
            const endDate = getEndDate(event);

            return (
              <div
                key={event.id || event.slug}
                className={`card overflow-hidden group hover:scale-105 transition-transform ${
                  isDark ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                <div className="relative">
                  {event.image && (
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  )}
                  {event.is_featured && (
                    <div className="absolute top-4 left-4 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                      Maalum
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3
                    className={`text-xl font-bold mb-3 ${
                      isDark ? 'text-white' : 'text-gray-800'
                    }`}
                  >
                    {event.title}
                  </h3>

                  {event.description && (
                    <p
                      className={`text-sm mb-4 ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    >
                      {event.description}
                    </p>
                  )}

                  <div className="space-y-2 mb-4 text-sm">
                    {startDate && (
                      <div className="flex items-center">
                        <Calendar
                          className="text-purple-600 mr-2"
                          size={16}
                        />
                        <span
                          className={
                            isDark ? 'text-gray-300' : 'text-gray-600'
                          }
                        >
                          {formatDate(startDate)}
                        </span>
                      </div>
                    )}

                    {startDate && (
                      <div className="flex items-center">
                        <Clock className="text-purple-600 mr-2" size={16} />
                        <span
                          className={
                            isDark ? 'text-gray-300' : 'text-gray-600'
                          }
                        >
                          {formatTime(startDate)}
                          {endDate && ` - ${formatTime(endDate)}`}
                        </span>
                      </div>
                    )}

                    {event.location && (
                      <div className="flex items-center">
                        <MapPin className="text-purple-600 mr-2" size={16} />
                        <span
                          className={
                            isDark ? 'text-gray-300' : 'text-gray-600'
                          }
                        >
                          {event.location}
                        </span>
                      </div>
                    )}

                    {event.max_attendees && (
                      <div className="flex items-center">
                        <Users className="text-purple-600 mr-2" size={16} />
                        <span
                          className={
                            isDark ? 'text-gray-300' : 'text-gray-600'
                          }
                        >
                          Hadi watu {event.max_attendees}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    {event.slug && (
                      <Link
                        to={`/matukio/${event.slug}`}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center"
                      >
                        <Calendar size={16} className="mr-2" />
                        Tazama Maelezo
                      </Link>
                    )}

                    {event.registration_url && (
                      <a
                        href={event.registration_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 border border-purple-600 text-purple-600 hover:bg-purple-50 font-semibold py-3 rounded-lg transition-colors flex items-center justify-center"
                      >
                        <ExternalLink size={16} className="mr-2" />
                        Jisajili Sasa
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredEvents.length === 0 && (
          <div
            className={`text-center card p-8 ${
              isDark ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <Calendar
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
              Hakuna matukio yaliyopatikana kwa sasa.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
