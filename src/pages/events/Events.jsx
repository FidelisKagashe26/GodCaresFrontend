// src/pages/events/Events.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  ExternalLink,
  Search,
  Sparkles,
} from 'lucide-react';

// NOTE: kwa sasa tunatumia data ya mfano (mock).
// Baadaye unaweza kubadilisha uunganishe na API ya backend.
const mockEvents = [
  {
    id: 1,
    slug: 'kampeni-ujumbe-malaika-watatu',
    title: 'Kampeni ya Ujumbe wa Malaika Watatu – Dodoma',
    description:
      'Wiki ya kipekee ya mafundisho ya unabii, uimbaji na maombi kwa ajili ya mji wa Dodoma.',
    image: '/images/events/event1.jpg',
    location: 'Dodoma, Tanzania',
    start_date: '2025-02-10T17:30:00',
    end_date: '2025-02-17T20:00:00',
    max_attendees: 800,
    is_featured: true,
    registration_url: '#',
  },
  {
    id: 2,
    slug: 'kongamano-vijana-mission-365',
    title: 'Kongamano la Vijana – Mission 365',
    description:
      'Mafunzo maalum kwa vijana wanaotaka kuishi mission kila siku katika shule, kazi na mtandaoni.',
    image: '/images/events/event2.jpg',
    location: 'Mwanza, Tanzania',
    start_date: '2025-03-05T09:00:00',
    end_date: '2025-03-07T17:30:00',
    max_attendees: 400,
    is_featured: false,
    registration_url: '#',
  },
  {
    id: 3,
    slug: 'mtandaoni-sabato-ya-familia-dunia',
    title: 'Sabato ya Familia – Mtandaoni Duniani',
    description:
      'Ibada maalum ya mtandaoni kwa familia kutoka nchi mbalimbali, kupitia God Cares 365 Online.',
    image: '/images/events/event3.jpg',
    location: 'Online (Zoom / YouTube)',
    start_date: '2025-01-25T10:00:00',
    end_date: '2025-01-25T13:00:00',
    max_attendees: 2000,
    is_featured: false,
    registration_url: '#',
  },
];

export default function Events() {
  const { isDark } = useTheme();
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('all'); // all | featured | upcoming
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

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

  // ================= "FETCH" MOCK DATA =================
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setEvents(mockEvents);
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  const now = new Date();
  const search = searchTerm.toLowerCase().trim();

  const filteredEvents = events
    .filter((event) => {
      const startDate = getStartDate(event);
      const startObj = startDate ? new Date(startDate) : null;

      // filter kwa aina
      if (filter === 'featured' && !event.is_featured) return false;
      if (filter === 'upcoming') {
        if (!startObj) return false;
        if (startObj < now) return false;
      }

      // smart search (title + description + location)
      if (!search) return true;
      const text = [
        event.title || '',
        event.description || '',
        event.location || '',
      ]
        .join(' ')
        .toLowerCase();
      return text.includes(search);
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
          isDark
            ? 'bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950'
            : 'bg-gradient-to-b from-slate-50 via-white to-emerald-50'
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-center min-h-[400px]">
          <LoadingSpinner text="Inapakia matukio..." size="lg" />
        </div>
      </div>
    );
  }

  // ================= VIEW =================
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
          <div className="inline-flex items-center justify-center rounded-full bg-emerald-500/10 px-3 py-1 mb-3 text-[11px] font-semibold text-emerald-700 dark:text-emerald-200">
            <Sparkles size={14} className="mr-1.5" />
            <span>Matukio • Semina • Mikutano ya Imani</span>
          </div>
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 via-sky-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md shadow-emerald-400/40">
            <Calendar className="text-white" size={32} />
          </div>
          <h1
            className={`text-2xl md:text-3xl font-extrabold mb-3 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            Matukio ya God Cares 365
          </h1>
          <p
            className={`text-sm md:text-base max-w-2xl mx-auto ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            Taarifa za matukio ya ana kwa ana na mtandaoni – kukuza imani,
            ushirika na mission ya kila siku.
          </p>
        </header>

        {/* Search + Filters (modern search bar) */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
            {/* Search bar */}
            <div className="relative flex-1">
              <Search
                className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}
                size={18}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tafuta kwa jina la tukio, mji au maelezo..."
                className={`w-full pl-10 pr-10 py-2.5 rounded-full border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  isDark
                    ? 'bg-gray-900/80 border-gray-700 text-white placeholder:text-gray-500'
                    : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-500'
                }`}
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-emerald-600 hover:text-emerald-700"
                >
                  Futa
                </button>
              )}
            </div>

            {/* Filter chips */}
            <div className="flex justify-center md:justify-end gap-2">
              {[
                { key: 'all', label: 'Yote' },
                { key: 'featured', label: 'Maalum' },
                { key: 'upcoming', label: 'Yajayo' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-4 py-1.5 rounded-full text-[12px] font-semibold border transition-all ${
                    filter === key
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-400/40'
                      : isDark
                      ? 'bg-gray-900 border-gray-700 text-gray-300 hover:bg-gray-800'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Events grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
            {filteredEvents.map((event) => {
              const startDate = getStartDate(event);
              const endDate = getEndDate(event);

              return (
                <article
                  key={event.id || event.slug}
                  className={`group overflow-hidden rounded-2xl border shadow-sm transition-all hover:-translate-y-1 hover:shadow-md ${
                    isDark
                      ? 'bg-gray-900/85 border-gray-800 hover:border-emerald-500/70'
                      : 'bg-white/95 border-gray-100 hover:border-emerald-500/70'
                  }`}
                >
                  <div className="relative">
                    {event.image && (
                      <div className="overflow-hidden rounded-t-2xl">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-44 md:h-48 object-cover transform transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}
                    {event.is_featured && (
                      <div className="absolute top-3 left-3 inline-flex items-center rounded-full bg-yellow-400 text-gray-900 text-[10px] font-semibold px-2.5 py-1 shadow-sm">
                        Tukio Maalum
                      </div>
                    )}
                  </div>

                  <div className="p-4 md:p-5 flex flex-col h-full">
                    <h3
                      className={`text-base md:text-lg font-bold mb-2 ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {event.title}
                    </h3>

                    {event.description && (
                      <p
                        className={`text-xs md:text-sm mb-3 line-clamp-3 ${
                          isDark ? 'text-gray-300' : 'text-gray-600'
                        }`}
                      >
                        {event.description}
                      </p>
                    )}

                    <div className="space-y-1.5 mb-4 text-[11px] md:text-xs">
                      {startDate && (
                        <div className="flex items-center">
                          <Calendar
                            className="text-emerald-500 mr-2"
                            size={14}
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
                          <Clock
                            className="text-sky-500 mr-2"
                            size={14}
                          />
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
                          <MapPin
                            className="text-emerald-500 mr-2"
                            size={14}
                          />
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
                          <Users
                            className="text-sky-500 mr-2"
                            size={14}
                          />
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

                    <div className="mt-auto flex flex-col sm:flex-row gap-2">
                      {event.slug && (
                        <Link
                          to={`/matukio/${event.slug}`}
                          className="flex-1 inline-flex items-center justify-center rounded-lg bg-emerald-600 text-white text-[12px] font-semibold py-2.5 hover:bg-emerald-700 transition-colors"
                        >
                          <Calendar size={14} className="mr-1.5" />
                          Tazama Maelezo
                        </Link>
                      )}

                      {event.registration_url && (
                        <a
                          href={event.registration_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center rounded-lg border border-emerald-500 text-emerald-600 text-[12px] font-semibold py-2.5 hover:bg-emerald-50 dark:text-emerald-300 dark:border-emerald-400 dark:hover:bg-gray-900 transition-colors"
                        >
                          <ExternalLink
                            size={14}
                            className="mr-1.5"
                          />
                          Jisajili Sasa
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div
            className={`mt-8 text-center rounded-2xl border px-6 py-10 ${
              isDark
                ? 'bg-gray-900/80 border-gray-800'
                : 'bg-white border-gray-100'
            }`}
          >
            <Calendar
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
              Hakuna matukio yaliyopatikana kwa sasa.  
              <br />
              Endelea kufuatilia – matukio mapya yataongezwa hivi karibuni.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
