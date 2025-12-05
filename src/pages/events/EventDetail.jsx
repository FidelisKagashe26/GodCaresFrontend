// src/pages/events/EventDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  ExternalLink,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

// NOTE: kwa sasa tunatumia data ile ile ya mfano kama Events
const mockEvents = [
  {
    id: 1,
    slug: 'kampeni-ujumbe-malaika-watatu',
    title: 'Kampeni ya Ujumbe wa Malaika Watatu – Dodoma',
    description:
      'Wiki ya kipekee ya mafundisho ya unabii, uimbaji na maombi kwa ajili ya mji wa Dodoma.',
    content:
      '<p>Kampeni hii inalenga kuwafikia wakazi wa Dodoma na ujumbe wa tumaini kupitia Ujumbe wa Malaika Watatu. Kila jioni kutakuwa na nyimbo, mafundisho, muda wa maswali na maombi ya pamoja.</p><p>Karibu ufike ukiwa na rafiki, jirani au mwanafamilia. Tunaomba pia uendelee kuiombea kampeni hii ili Roho Mtakatifu aongoze.</p>',
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
    content:
      '<p>Kongamano hili limeandaliwa kwa ajili ya vijana wanaotaka kuishi maisha ya ushuhuda na mission kila siku. Kuta kuwepo na vipindi vya Neno, vikundi vidogo na majadiliano.</p>',
    image: '/images/events/event2.jpg',
    location: 'Mwanza, Tanzania',
    start_date: '2025-03-05T09:00:00',
    end_date: '2025-03-07T17:30:00',
    max_attendees: 400,
    is_featured: false,
    registration_url: '#',
  },
];

export default function EventDetail() {
  const { slug } = useParams();
  const { isDark } = useTheme();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

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
    setLoading(true);
    const timer = setTimeout(() => {
      const found = mockEvents.find((e) => e.slug === slug);
      setEvent(found || null);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [slug]);

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
          <LoadingSpinner text="Inapakia tukio..." size="lg" />
        </div>
      </div>
    );
  }

  if (!event) {
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
                ? 'bg-gray-900/80 border-gray-800'
                : 'bg-white border-gray-100'
            }`}
          >
            <p className="text-emerald-600 text-base md:text-lg mb-3">
              Tukio halijapatikana.
            </p>
            <Link
              to="/matukio"
              className="inline-flex items-center text-sm font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-300"
            >
              <ArrowLeft size={16} className="mr-1.5" />
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
      className={`min-h-screen pb-12 pt-6 md:pt-8 transition-colors ${
        isDark
          ? 'bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950'
          : 'bg-gradient-to-b from-slate-50 via-white to-emerald-50'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        {/* Back link */}
        <Link
          to="/matukio"
          className="inline-flex items-center text-xs md:text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-300 mb-4 md:mb-6"
        >
          <ArrowLeft size={16} className="mr-1.5" />
          Rudi kwenye Matukio
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8 items-start">
          {/* Main content */}
          <div className="lg:col-span-3">
            <div
              className={`overflow-hidden rounded-2xl border shadow-sm ${
                isDark
                  ? 'bg-gray-900/85 border-gray-800'
                  : 'bg-white/95 border-gray-100'
              }`}
            >
              {/* Hero image */}
              {event.image && (
                <div className="relative h-48 md:h-64 lg:h-72 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover transform transition-transform duration-[1500ms] hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                    {event.is_featured && (
                      <span className="inline-flex items-center rounded-full bg-yellow-400/95 px-3 py-1 text-[10px] font-semibold text-gray-900">
                        Tukio Maalum
                      </span>
                    )}
                    {startDate && (
                      <span className="inline-flex items-center rounded-full bg-black/60 px-3 py-1 text-[10px] font-medium text-gray-100">
                        <Calendar size={14} className="mr-1" />
                        {formatDate(startDate)}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Header & description */}
              <div className="p-5 md:p-7">
                <header className="mb-5">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <h1
                      className={`text-xl md:text-2xl font-extrabold leading-snug ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {event.title}
                    </h1>
                    {event.registration_url && (
                      <a
                        href={event.registration_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center rounded-full bg-emerald-600 px-4 py-2 text-xs md:text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
                      >
                        <ExternalLink size={14} className="mr-1.5" />
                        Jisajili Sasa
                      </a>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] md:text-xs">
                    {startDate && (
                      <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-1 dark:bg-emerald-900/25 dark:text-emerald-200">
                        <Clock size={14} className="mr-1" />
                        {formatTime(startDate)}
                        {endDate && ` - ${formatTime(endDate)}`}
                      </span>
                    )}
                    {event.location && (
                      <span className="inline-flex items-center rounded-full bg-sky-50 text-sky-700 px-2.5 py-1 dark:bg-sky-900/25 dark:text-sky-200">
                        <MapPin size={14} className="mr-1" />
                        {event.location}
                      </span>
                    )}
                    {event.max_attendees && (
                      <span className="inline-flex items-center rounded-full bg-yellow-50 text-yellow-700 px-2.5 py-1 dark:bg-yellow-900/25 dark:text-yellow-200">
                        <Users size={14} className="mr-1" />
                        Hadi {event.max_attendees} washiriki
                      </span>
                    )}
                  </div>
                </header>

                {/* Body */}
                <div className="space-y-4 text-sm md:text-base">
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
                      className={`prose prose-sm md:prose-base max-w-none ${
                        isDark ? 'prose-invert' : ''
                      }`}
                      dangerouslySetInnerHTML={{ __html: event.content }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-5 md:space-y-6">
            <div
              className={`rounded-2xl border p-5 ${
                isDark
                  ? 'bg-gray-900/85 border-gray-800'
                  : 'bg-white/95 border-gray-100'
              }`}
            >
              <h3
                className={`text-sm md:text-base font-bold mb-3 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                Maelezo ya Tukio
              </h3>
              <div className="space-y-3 text-[12px] md:text-xs">
                {startDate && (
                  <div>
                    <p
                      className={`font-medium ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    >
                      Tarehe ya kuanza:
                    </p>
                    <p
                      className={
                        isDark ? 'text-gray-100' : 'text-gray-800'
                      }
                    >
                      {formatDate(startDate)} {formatTime(startDate)}
                    </p>
                  </div>
                )}
                {endDate && (
                  <div>
                    <p
                      className={`font-medium ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    >
                      Tarehe ya kumaliza:
                    </p>
                    <p
                      className={
                        isDark ? 'text-gray-100' : 'text-gray-800'
                      }
                    >
                      {formatDate(endDate)} {formatTime(endDate)}
                    </p>
                  </div>
                )}
                {event.location && (
                  <div>
                    <p
                      className={`font-medium ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    >
                      Mahali:
                    </p>
                    <p
                      className={
                        isDark ? 'text-gray-100' : 'text-gray-800'
                      }
                    >
                      {event.location}
                    </p>
                  </div>
                )}
                {event.max_attendees && (
                  <div>
                    <p
                      className={`font-medium ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    >
                      Uwezo wa mahudhurio:
                    </p>
                    <p
                      className={
                        isDark ? 'text-gray-100' : 'text-gray-800'
                      }
                    >
                      Hadi watu {event.max_attendees}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div
              className={`rounded-2xl border p-5 ${
                isDark
                  ? 'bg-gray-900/85 border-gray-800'
                  : 'bg-white/95 border-gray-100'
              }`}
            >
              <h3
                className={`text-sm md:text-base font-bold mb-3 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                Kwa nini tukio hili ni muhimu?
              </h3>
              <p
                className={`text-[12px] md:text-xs mb-3 ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                Matukio haya yameandaliwa kukuza ufahamu wa Neno la Mungu,
                kuimarisha familia za waamini na kuwasha moyo wa mission
                katika kila mshiriki.
              </p>
              <ul className="space-y-1.5 text-[12px] md:text-xs text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <Sparkles size={14} className="mt-0.5 text-emerald-400" />
                  <span>Mafundisho ya kina ya Biblia na unabii.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles size={14} className="mt-0.5 text-emerald-400" />
                  <span>Fursa ya maombi ya binafsi na ya pamoja.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles size={14} className="mt-0.5 text-emerald-400" />
                  <span>Ushirika wa imani na kujengeana kiroho.</span>
                </li>
              </ul>

              {event.registration_url && (
                <a
                  href={event.registration_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 w-full inline-flex items-center justify-center rounded-lg bg-emerald-600 text-white text-[12px] md:text-sm font-semibold py-2.5 hover:bg-emerald-700 transition-colors"
                >
                  <ExternalLink size={14} className="mr-1.5" />
                  Fungua Ukurasa wa Usajili
                </a>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
