// src/pages/events/EventDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import apiService from '../../services/api';
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  ExternalLink,
  ArrowLeft,
} from 'lucide-react';

export default function EventDetail() {
  const { slug } = useParams();
  const { isDark } = useTheme();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        // /events/<slug>/ kupitia apiService
        const data = await apiService.getEvent(slug);
        setEvent(data);
      } catch (err) {
        setError(err.message || 'Hitilafu katika kupakia tukio.');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      load();
    }
  }, [slug]);

  if (loading) {
    return (
      <div
        className={`min-h-screen py-12 transition-colors ${
          isDark ? 'bg-gray-900' : 'bg-gray-50'
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-center min-h-[400px]">
          <LoadingSpinner text="Inapakia tukio..." size="lg" />
        </div>
      </div>
    );
  }

  if (error || !event) {
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
            <p className="text-red-600 text-lg">
              {error || 'Tukio halijapatikana.'}
            </p>
            <Link
              to="/matukio"
              className="inline-flex items-center mt-4 text-purple-600 hover:text-purple-700"
            >
              <ArrowLeft size={16} className="mr-1" />
              Rudi kwenye Matukio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const startDate = getStartDate(event);
  const endDate = getEndDate(event);

  return (
    <div
      className={`min-h-screen py-12 transition-colors ${
        isDark ? 'bg-gray-900' : 'bg-gray-50'
      }`}
    >
      <div className="container mx-auto px-6">
        {/* Back */}
        <Link
          to="/matukio"
          className="inline-flex items-center mb-8 text-purple-600 hover:text-purple-700 transition-colors"
        >
          <ArrowLeft size={16} className="mr-1" />
          Rudi kwenye Matukio
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main content */}
          <div className="lg:col-span-3">
            <div
              className={`card p-8 ${
                isDark ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              {/* Header */}
              <header className="mb-8">
                <div className="flex items-center space-x-2 mb-4">
                  {event.is_featured && (
                    <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                      Tukio Maalum
                    </span>
                  )}
                  {startDate && (
                    <span
                      className={`text-xs ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      {formatDate(startDate)}
                    </span>
                  )}
                </div>

                <h1
                  className={`text-3xl md:text-4xl font-bold mb-4 ${
                    isDark ? 'text-white' : 'text-gray-800'
                  }`}
                >
                  {event.title}
                </h1>

                <div className="flex flex-wrap items-center justify-between gap-4 text-sm mb-6">
                  <div className="flex flex-wrap gap-4 items-center">
                    {startDate && (
                      <span className="flex items-center">
                        <Calendar size={16} className="mr-1" />
                        {formatDate(startDate)}
                      </span>
                    )}
                    {startDate && (
                      <span className="flex items-center">
                        <Clock size={16} className="mr-1" />
                        {formatTime(startDate)}
                        {endDate && ` - ${formatTime(endDate)}`}
                      </span>
                    )}
                    {event.location && (
                      <span className="flex items-center">
                        <MapPin size={16} className="mr-1" />
                        {event.location}
                      </span>
                    )}
                    {event.max_attendees && (
                      <span className="flex items-center">
                        <Users size={16} className="mr-1" />
                        Hadi watu {event.max_attendees}
                      </span>
                    )}
                  </div>

                  {event.registration_url && (
                    <a
                      href={event.registration_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                    >
                      <ExternalLink size={16} className="mr-1" />
                      Jisajili Sasa
                    </a>
                  )}
                </div>

                {event.image && (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-64 md:h-80 object-cover rounded-lg mb-6"
                  />
                )}
              </header>

              {/* Description & content */}
              <div className="space-y-4">
                {event.description && (
                  <p
                    className={
                      isDark ? 'text-gray-200' : 'text-gray-700'
                    }
                  >
                    {event.description}
                  </p>
                )}

                {event.content && (
                  <div
                    className={`prose prose-lg max-w-none ${
                      isDark ? 'prose-invert' : ''
                    }`}
                    dangerouslySetInnerHTML={{ __html: event.content }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            <div
              className={`card p-6 ${
                isDark ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <h3
                className={`text-lg font-bold mb-4 ${
                  isDark ? 'text-white' : 'text-gray-800'
                }`}
              >
                Maelezo ya Tukio
              </h3>
              <div className="space-y-3 text-sm">
                {startDate && (
                  <div>
                    <span
                      className={`font-medium ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    >
                      Tarehe ya kuanza:
                    </span>
                    <p
                      className={
                        isDark ? 'text-white' : 'text-gray-800'
                      }
                    >
                      {formatDate(startDate)} {formatTime(startDate)}
                    </p>
                  </div>
                )}
                {endDate && (
                  <div>
                    <span
                      className={`font-medium ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    >
                      Tarehe ya kumaliza:
                    </span>
                    <p
                      className={
                        isDark ? 'text-white' : 'text-gray-800'
                      }
                    >
                      {formatDate(endDate)} {formatTime(endDate)}
                    </p>
                  </div>
                )}
                {event.location && (
                  <div>
                    <span
                      className={`font-medium ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    >
                      Mahali:
                    </span>
                    <p
                      className={
                        isDark ? 'text-white' : 'text-gray-800'
                      }
                    >
                      {event.location}
                    </p>
                  </div>
                )}
                {event.max_attendees && (
                  <div>
                    <span
                      className={`font-medium ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    >
                      Uwezo wa mahudhurio:
                    </span>
                    <p
                      className={
                        isDark ? 'text-white' : 'text-gray-800'
                      }
                    >
                      Hadi watu {event.max_attendees}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {event.registration_url && (
              <div
                className={`card p-6 ${
                  isDark ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                <h3
                  className={`text-lg font-bold mb-4 ${
                    isDark ? 'text-white' : 'text-gray-800'
                  }`}
                >
                  Usikose!
                </h3>
                <p
                  className={`text-sm mb-4 ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  Jisajili mapema ili kuhakikisha nafasi yako katika tukio hili
                  la kipekee.
                </p>
                <a
                  href={event.registration_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  <ExternalLink size={16} className="mr-2" />
                  Fungua Ukurasa wa Usajili
                </a>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
