// src/pages/events/EventDetail.jsx
import { Link, useParams } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import useApi from "../../hooks/useApi";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  ExternalLink,
  ArrowLeft,
  Sparkles,
  RefreshCw,
} from "lucide-react";

export default function EventDetail() {
  const { slug } = useParams();
  const { isDark } = useTheme();

  const { data: event, loading, error, refetch } = useApi(`/events/${slug}/`);

  const formatDate = (value) => {
    if (!value) return "";
    const d = new Date(value);
    return d.toLocaleDateString("sw-TZ", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (value) => {
    if (!value) return "";
    const d = new Date(value);
    return d.toLocaleTimeString("sw-TZ", { hour: "2-digit", minute: "2-digit" });
  };

  const startDate = event?.start_date || null;
  const endDate = event?.end_date || null;

  if (loading) {
    return (
      <div
        className={`min-h-screen py-12 transition-colors ${
          isDark
            ? "bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950"
            : "bg-gradient-to-b from-slate-50 via-white to-emerald-50"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-center min-h-[420px]">
          <LoadingSpinner text="Inapakia tukio..." size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`min-h-screen py-12 transition-colors ${
          isDark
            ? "bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950"
            : "bg-gradient-to-b from-slate-50 via-white to-emerald-50"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div
            className={`text-center rounded-2xl border px-6 py-10 ${
              isDark ? "bg-gray-900/80 border-gray-800" : "bg-white border-gray-100"
            }`}
          >
            <p className="text-red-500 text-sm md:text-base mb-4">Imeshindikana kupakia tukio.</p>
            <div className="flex items-center justify-center gap-3">
              <Link
                to="/matukio"
                className="inline-flex items-center text-sm font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-300"
              >
                <ArrowLeft size={16} className="mr-1.5" />
                Rudi kwenye Matukio
              </Link>

              <button
                onClick={refetch}
                className="inline-flex items-center rounded-full bg-emerald-600 px-4 py-2 text-xs md:text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
              >
                <RefreshCw size={14} className="mr-1.5" />
                Jaribu tena
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div
        className={`min-h-screen py-12 transition-colors ${
          isDark
            ? "bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950"
            : "bg-gradient-to-b from-slate-50 via-white to-emerald-50"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div
            className={`text-center rounded-2xl border px-6 py-10 ${
              isDark ? "bg-gray-900/80 border-gray-800" : "bg-white border-gray-100"
            }`}
          >
            <p className="text-emerald-600 text-base md:text-lg mb-3">Tukio halijapatikana.</p>
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

  return (
    <div
      className={`min-h-screen pb-12 pt-6 md:pt-8 transition-colors ${
        isDark
          ? "bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950"
          : "bg-gradient-to-b from-slate-50 via-white to-emerald-50"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <Link
          to="/matukio"
          className="inline-flex items-center text-xs md:text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-300 mb-4 md:mb-6"
        >
          <ArrowLeft size={16} className="mr-1.5" />
          Rudi kwenye Matukio
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8 items-start">
          <div className="lg:col-span-3">
            <div
              className={`overflow-hidden rounded-2xl border shadow-sm ${
                isDark ? "bg-gray-900/85 border-gray-800" : "bg-white/95 border-gray-100"
              }`}
            >
              {event.image ? (
                <div className="relative h-48 md:h-64 lg:h-72 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover transform transition-transform duration-[1500ms] hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />

                  <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                    {event.is_featured && (
                      <span className="inline-flex items-center rounded-full bg-yellow-400/95 px-3 py-1 text-[10px] font-semibold text-gray-900">
                        <Sparkles size={14} className="mr-1" />
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
              ) : (
                <div className="h-48 md:h-64 lg:h-72 bg-gradient-to-br from-emerald-200 via-sky-200 to-emerald-100 dark:from-emerald-900/25 dark:via-sky-900/25 dark:to-emerald-900/25" />
              )}

              <div className="p-5 md:p-7">
                <header className="mb-5">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <h1 className={`text-xl md:text-2xl font-extrabold leading-snug ${isDark ? "text-white" : "text-gray-900"}`}>
                      {event.title}
                    </h1>

                    {event.registration_url ? (
                      <a
                        href={event.registration_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center rounded-full bg-emerald-600 px-4 py-2 text-xs md:text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
                      >
                        <ExternalLink size={14} className="mr-1.5" />
                        Jisajili Sasa
                      </a>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] md:text-xs">
                    {startDate && (
                      <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-1 dark:bg-emerald-900/25 dark:text-emerald-200">
                        <Clock size={14} className="mr-1" />
                        {formatTime(startDate)}
                        {endDate ? ` - ${formatTime(endDate)}` : ""}
                      </span>
                    )}

                    {event.location && (
                      <span className="inline-flex items-center rounded-full bg-sky-50 text-sky-700 px-2.5 py-1 dark:bg-sky-900/25 dark:text-sky-200">
                        <MapPin size={14} className="mr-1" />
                        {event.location}
                      </span>
                    )}

                    {event.max_attendees ? (
                      <span className="inline-flex items-center rounded-full bg-yellow-50 text-yellow-700 px-2.5 py-1 dark:bg-yellow-900/25 dark:text-yellow-200">
                        <Users size={14} className="mr-1" />
                        Hadi {event.max_attendees} washiriki
                      </span>
                    ) : null}
                  </div>
                </header>

                <div className="space-y-4 text-sm md:text-base">
                  {event.description ? (
                    <p className={isDark ? "text-gray-200" : "text-gray-700"}>{event.description}</p>
                  ) : null}

                  {event.content ? (
                    <div
                      className={`prose prose-sm md:prose-base max-w-none ${isDark ? "prose-invert" : ""}`}
                      dangerouslySetInnerHTML={{ __html: event.content }}
                    />
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <aside className="lg:col-span-1 space-y-5 md:space-y-6">
            <div className={`rounded-2xl border p-5 ${isDark ? "bg-gray-900/85 border-gray-800" : "bg-white/95 border-gray-100"}`}>
              <h3 className={`text-sm md:text-base font-bold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
                Maelezo ya Tukio
              </h3>

              <div className="space-y-3 text-[12px] md:text-xs">
                {startDate && (
                  <div>
                    <p className={`font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>Tarehe ya kuanza:</p>
                    <p className={isDark ? "text-gray-100" : "text-gray-800"}>
                      {formatDate(startDate)} {formatTime(startDate)}
                    </p>
                  </div>
                )}

                {endDate && (
                  <div>
                    <p className={`font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>Tarehe ya kumaliza:</p>
                    <p className={isDark ? "text-gray-100" : "text-gray-800"}>
                      {formatDate(endDate)} {formatTime(endDate)}
                    </p>
                  </div>
                )}

                {event.location && (
                  <div>
                    <p className={`font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>Mahali:</p>
                    <p className={isDark ? "text-gray-100" : "text-gray-800"}>{event.location}</p>
                  </div>
                )}

                {event.max_attendees ? (
                  <div>
                    <p className={`font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>Uwezo wa mahudhurio:</p>
                    <p className={isDark ? "text-gray-100" : "text-gray-800"}>Hadi watu {event.max_attendees}</p>
                  </div>
                ) : null}
              </div>

              {event.registration_url ? (
                <a
                  href={event.registration_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 w-full inline-flex items-center justify-center rounded-lg bg-emerald-600 text-white text-[12px] md:text-sm font-semibold py-2.5 hover:bg-emerald-700 transition-colors"
                >
                  <ExternalLink size={14} className="mr-1.5" />
                  Fungua Ukurasa wa Usajili
                </a>
              ) : null}
            </div>

            <div className={`rounded-2xl border p-5 ${isDark ? "bg-gray-900/85 border-gray-800" : "bg-white/95 border-gray-100"}`}>
              <h3 className={`text-sm md:text-base font-bold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
                Kwa nini tukio hili ni muhimu?
              </h3>

              <p className={`text-[12px] md:text-xs mb-3 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                Matukio haya yameandaliwa kukuza ufahamu wa Neno la Mungu, kuimarisha familia za waamini na kuwasha moyo wa mission.
              </p>

              <ul className="space-y-1.5 text-[12px] md:text-xs text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <Sparkles size={14} className="mt-0.5 text-emerald-400" />
                  <span>Mafundisho ya kina ya Biblia na uimarishaji wa imani.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles size={14} className="mt-0.5 text-emerald-400" />
                  <span>Fursa ya maombi binafsi na ya pamoja.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles size={14} className="mt-0.5 text-emerald-400" />
                  <span>Ushirika wa imani na kujengeana kiroho.</span>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
