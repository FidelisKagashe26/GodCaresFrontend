// src/pages/events/Events.jsx
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import useApi from "../../hooks/useApi";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  ExternalLink,
  Search,
  Sparkles,
  RefreshCw,
  Share2,
} from "lucide-react";

function normalizeList(payload) {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.results)) return payload.results;
  return [];
}

export default function Events() {
  const { isDark } = useTheme();
  const [filter, setFilter] = useState("all"); // all | featured | upcoming
  const [searchTerm, setSearchTerm] = useState("");

  const { data: eventsRaw, loading, error, refetch } = useApi("events");
  const events = useMemo(() => normalizeList(eventsRaw), [eventsRaw]);

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
    return d.toLocaleTimeString("sw-TZ", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStartDate = (ev) => ev?.start_date || null;
  const getEndDate = (ev) => ev?.end_date || null;

  const now = new Date();
  const search = searchTerm.toLowerCase().trim();

  const filteredEvents = useMemo(() => {
    return events
      .filter((event) => {
        const startDate = getStartDate(event);
        const startObj = startDate ? new Date(startDate) : null;

        if (filter === "featured" && !event.is_featured) return false;
        if (filter === "upcoming") {
          if (!startObj) return false;
          if (startObj < now) return false;
        }

        if (!search) return true;
        const text = [event.title || "", event.description || "", event.location || ""]
          .join(" ")
          .toLowerCase();
        return text.includes(search);
      })
      .sort((a, b) => {
        const da = getStartDate(a) ? new Date(getStartDate(a)).getTime() : 0;
        const db = getStartDate(b) ? new Date(getStartDate(b)).getTime() : 0;
        return da - db;
      });
  }, [events, filter, now, search]);

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
          <LoadingSpinner text="Inapakia matukio..." size="lg" />
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
            className={`rounded-2xl border p-6 md:p-8 text-center ${
              isDark ? "bg-gray-900/85 border-gray-800" : "bg-white/95 border-gray-100"
            }`}
          >
            <p className="text-sm md:text-base text-red-500 mb-4">
              Imeshindikana kupakia matukio. Jaribu tena.
            </p>
            <button
              onClick={refetch}
              className="inline-flex items-center justify-center rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 text-sm font-semibold transition-colors"
              type="button"
            >
              <RefreshCw size={16} className="mr-2" />
              Pakia Upya
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen py-10 md:py-12 transition-colors ${
        isDark
          ? "bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950"
          : "bg-gradient-to-b from-slate-50 via-white to-emerald-50"
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

          <h1 className={`text-2xl md:text-3xl font-extrabold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
            Matukio ya God Cares 365
          </h1>

          <p className={`text-sm md:text-base max-w-2xl mx-auto ${isDark ? "text-gray-300" : "text-gray-600"}`}>
            Taarifa za matukio ya ana kwa ana na mtandaoni – kukuza imani, ushirika na mission ya kila siku.
          </p>
        </header>

        {/* Search + Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
            <div className="relative flex-1">
              <Search
                className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? "text-gray-400" : "text-gray-500"}`}
                size={18}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tafuta kwa jina la tukio, mji au maelezo..."
                className={`w-full pl-10 pr-10 py-2.5 rounded-full border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  isDark
                    ? "bg-gray-900/80 border-gray-700 text-white placeholder:text-gray-500"
                    : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-500"
                }`}
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-emerald-600 hover:text-emerald-700"
                >
                  Futa
                </button>
              )}
            </div>

            <div className="flex justify-center md:justify-end gap-2">
              {[
                { key: "all", label: "Yote" },
                { key: "featured", label: "Maalum" },
                { key: "upcoming", label: "Yajayo" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-4 py-1.5 rounded-full text-[12px] font-semibold border transition-all ${
                    filter === key
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-400/40"
                      : isDark
                      ? "bg-gray-900 border-gray-700 text-gray-300 hover:bg-gray-800"
                      : "bg-white border-gray-200 text-gray-700 hover:bg-gray-100"
                  }`}
                  type="button"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
            {filteredEvents.map((event) => {
              const startDate = getStartDate(event);
              const endDate = getEndDate(event);
              const detailUrl = event?.slug ? `/matukio/${event.slug}` : null;

              return (
                <article
                  key={event.slug || event.title}
                  className={`relative group overflow-hidden rounded-2xl border shadow-sm transition-all hover:-translate-y-1 hover:shadow-md focus-within:ring-2 focus-within:ring-emerald-500 ${
                    isDark
                      ? "bg-gray-900/85 border-gray-800 hover:border-emerald-500/70"
                      : "bg-white/95 border-gray-100 hover:border-emerald-500/70"
                  }`}
                >
                  {/* CARD OVERLAY: inafanya card nzima ibonyezeke kwenda details */}
                  {detailUrl ? (
                    <Link
                      to={detailUrl}
                      className="absolute inset-0 z-10"
                      aria-label={`Fungua maelezo ya tukio: ${event.title}`}
                    />
                  ) : null}

                  <div className="relative">
                    {event.image ? (
                      <div className="overflow-hidden rounded-t-2xl">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-44 md:h-48 object-cover transform transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="h-44 md:h-48 bg-gradient-to-br from-emerald-200 via-sky-200 to-emerald-100 dark:from-emerald-900/25 dark:via-sky-900/25 dark:to-emerald-900/25" />
                    )}

                    {event.is_featured && (
                      <div className="absolute top-3 left-3 inline-flex items-center rounded-full bg-yellow-400 text-gray-900 text-[10px] font-semibold px-2.5 py-1 shadow-sm">
                        Tukio Maalum
                      </div>
                    )}
                  </div>

                  <div className="p-4 md:p-5 flex flex-col h-full">
                    <h3 className={`text-base md:text-lg font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                      {event.title}
                    </h3>

                    {event.description && (
                      <p className={`text-xs md:text-sm mb-3 line-clamp-3 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                        {event.description}
                      </p>
                    )}

                    <div className="space-y-1.5 mb-4 text-[11px] md:text-xs">
                      {startDate && (
                        <div className="flex items-center">
                          <Calendar className="text-emerald-500 mr-2" size={14} />
                          <span className={isDark ? "text-gray-300" : "text-gray-600"}>{formatDate(startDate)}</span>
                        </div>
                      )}

                      {startDate && (
                        <div className="flex items-center">
                          <Clock className="text-sky-500 mr-2" size={14} />
                          <span className={isDark ? "text-gray-300" : "text-gray-600"}>
                            {formatTime(startDate)}
                            {endDate ? ` - ${formatTime(endDate)}` : ""}
                          </span>
                        </div>
                      )}

                      {event.location && (
                        <div className="flex items-center">
                          <MapPin className="text-emerald-500 mr-2" size={14} />
                          <span className={isDark ? "text-gray-300" : "text-gray-600"}>{event.location}</span>
                        </div>
                      )}

                      {event.max_attendees ? (
                        <div className="flex items-center">
                          <Users className="text-sky-500 mr-2" size={14} />
                          <span className={isDark ? "text-gray-300" : "text-gray-600"}>
                            Hadi watu {event.max_attendees}
                          </span>
                        </div>
                      ) : null}
                    </div>

                    {/* Actions (ziwe juu ya overlay) */}
                    <div className="mt-auto flex items-center gap-2 relative z-20">
                      {/* “Soma zaidi” (kamshare) */}
                      {detailUrl ? (
                        <Link
                          to={detailUrl}
                          className={`flex-1 inline-flex items-center justify-center rounded-lg border px-3 py-2.5 text-[12px] font-semibold transition-colors ${
                            isDark
                              ? "border-gray-700 text-emerald-200 hover:bg-gray-900"
                              : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                          }`}
                        >
                          <Share2 size={14} className="mr-1.5" />
                          Soma zaidi
                        </Link>
                      ) : (
                        <span
                          className={`flex-1 inline-flex items-center justify-center rounded-lg border px-3 py-2.5 text-[12px] font-semibold ${
                            isDark ? "border-gray-800 text-gray-500" : "border-gray-200 text-gray-500"
                          }`}
                        >
                          <Share2 size={14} className="mr-1.5" />
                          Soma zaidi
                        </span>
                      )}

                      {/* Registration (ibaki clickable) */}
                      {event.registration_url ? (
                        <a
                          href={event.registration_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center rounded-lg bg-emerald-600 text-white text-[12px] font-semibold py-2.5 hover:bg-emerald-700 transition-colors"
                        >
                          <ExternalLink size={14} className="mr-1.5" />
                          Jisajili
                        </a>
                      ) : null}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div
            className={`mt-8 text-center rounded-2xl border px-6 py-10 ${
              isDark ? "bg-gray-900/80 border-gray-800" : "bg-white border-gray-100"
            }`}
          >
            <Calendar className={`mx-auto mb-4 ${isDark ? "text-gray-500" : "text-gray-400"}`} size={40} />
            <p className={`text-sm md:text-base ${isDark ? "text-gray-300" : "text-gray-600"}`}>
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
