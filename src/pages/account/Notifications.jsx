// src/pages/account/Notifications.jsx
import { useEffect, useMemo, useState } from 'react';
import {
  Bell,
  Inbox,
  AlertCircle,
  CheckCircle2,
  Clock,
  Filter,
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import SEOHead from '../../components/SEOHead';
import LoadingSpinner from '../../components/LoadingSpinner';
import apiService from '../../services/api';

export default function Notifications() {
  const { isDark } = useTheme();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, unread
  const [markingAll, setMarkingAll] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiService.getNotifications();
        const list = Array.isArray(data)
          ? data
          : data?.results || data?.data || [];
        setItems(list);
      } catch (err) {
        console.error('Notifications load error:', err);
        setError(
          err?.message || 'Imeshindikana kupakia notifications.'
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const unreadCount = useMemo(
    () => items.filter((n) => !n.is_read).length,
    [items]
  );

  const formatDateTime = (value) => {
    if (!value) return '';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleString('sw-TZ', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTypeLabel = (item) => {
    const type = (item.type || item.category || '').trim();
    if (!type) return null;
    return type.replace(/_/g, ' ').toUpperCase();
  };

  const filteredItems = useMemo(() => {
    return items.filter((n) =>
      filter === 'unread' ? !n.is_read : true
    );
  }, [items, filter]);

  const handleMarkRead = async (notification) => {
    const id = notification.id;
    if (!id) return;

    setItems((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, is_read: true } : n
      )
    );

    try {
      if (typeof apiService.markNotificationRead === 'function') {
        await apiService.markNotificationRead(id);
      }
    } catch (err) {
      console.error('markNotificationRead error:', err);
    }
  };

  const handleMarkAllRead = async () => {
    setMarkingAll(true);
    setItems((prev) =>
      prev.map((n) => ({ ...n, is_read: true }))
    );
    try {
      if (typeof apiService.markAllNotificationsRead === 'function') {
        await apiService.markAllNotificationsRead();
      }
    } catch (err) {
      console.error('markAllNotificationsRead error:', err);
    } finally {
      setMarkingAll(false);
    }
  };

  return (
    <>
      <SEOHead
        title="Taarifa & Notifications"
        description="Orodha ya taarifa muhimu kutoka mfumo wa GOD CARES 365."
      />

      <section
        className={`min-h-[calc(100vh-200px)] py-10 transition-colors ${
          isDark ? 'bg-gray-900' : 'bg-gray-50'
        }`}
      >
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-400/40">
                <Bell size={22} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Taarifa &amp; Notifications
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  Hapa utaona taarifa muhimu kutoka kwenye mfumo na viongozi wa
                  GOD CARES 365.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-start sm:items-end gap-1 text-xs">
              <div className="text-right">
                <p className="text-gray-500 dark:text-gray-400">
                  Jumla: {items.length}
                </p>
                <p className="text-blue-600 dark:text-blue-400 font-semibold">
                  Zisizosomwa: {unreadCount}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="inline-flex rounded-full bg-gray-100 dark:bg-gray-800 p-1 border border-gray-200 dark:border-gray-700 text-[11px]">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-3 py-1 rounded-full font-medium transition-colors ${
                      filter === 'all'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    Zote
                  </button>
                  <button
                    onClick={() => setFilter('unread')}
                    className={`px-3 py-1 rounded-full font-medium transition-colors ${
                      filter === 'unread'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    Zisizosomwa
                  </button>
                </div>

                <button
                  type="button"
                  disabled={unreadCount === 0 || markingAll}
                  onClick={handleMarkAllRead}
                  className="text-[11px] px-3 py-1 rounded-full border border-blue-500 text-blue-600 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  {markingAll && (
                    <span className="inline-block h-3 w-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  )}
                  Tandaza zimesomwa
                </button>
              </div>
            </div>
          </header>

          {/* State: loading */}
          {loading && (
            <div className="flex justify-center py-16">
              <LoadingSpinner text="Inapakia notifications..." />
            </div>
          )}

          {/* State: error */}
          {error && !loading && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-500/40 dark:bg-red-900/40 dark:text-red-100 flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* State: empty */}
          {!loading && !error && filteredItems.length === 0 && (
            <div
              className={`mt-4 rounded-2xl border px-6 py-10 text-center ${
                isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}
            >
              <Inbox
                className={
                  isDark
                    ? 'text-gray-400 mx-auto mb-4'
                    : 'text-gray-500 mx-auto mb-4'
                }
                size={40}
              />
              <p
                className={
                  isDark ? 'text-gray-300 text-sm' : 'text-gray-600 text-sm'
                }
              >
                Kwa sasa hakuna notifications{' '}
                {filter === 'unread' ? 'zisizosomwa' : ''}.
              </p>
            </div>
          )}

          {/* List */}
          {!loading && filteredItems.length > 0 && (
            <div className="space-y-3">
              {filteredItems.map((item) => {
                const title = item.title || 'Taarifa';
                const body = item.message || item.body || '';
                const date = formatDateTime(
                  item.created_at || item.timestamp
                );
                const read = item.is_read ?? false;
                const typeLabel = getTypeLabel(item);

                const priority = (item.priority || 'normal').toLowerCase();
                const priorityColor =
                  priority === 'high'
                    ? 'text-red-600 dark:text-red-300'
                    : priority === 'low'
                    ? 'text-gray-500 dark:text-gray-400'
                    : 'text-blue-600 dark:text-blue-300';

                return (
                  <button
                    key={item.id || `${title}-${date}`}
                    type="button"
                    onClick={() => !read && handleMarkRead(item)}
                    className={`w-full text-left rounded-xl border px-4 py-3 text-sm flex gap-3 transition-colors ${
                      read
                        ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750'
                        : 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-500/50 hover:bg-blue-100 dark:hover:bg-blue-900/50'
                    }`}
                  >
                    <div className="mt-1">
                      {read ? (
                        <CheckCircle2
                          size={18}
                          className="text-green-500"
                        />
                      ) : (
                        <Bell size={18} className="text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                        <div className="flex items-center flex-wrap gap-2">
                          <h2 className="font-semibold text-gray-900 dark:text-white">
                            {title}
                          </h2>
                          {typeLabel && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-600/10 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
                              {typeLabel}
                            </span>
                          )}
                          {item.priority && (
                            <span
                              className={`text-[10px] font-semibold ${priorityColor}`}
                            >
                              {priority.toUpperCase()}
                            </span>
                          )}
                        </div>
                        {date && (
                          <span className="flex items-center text-[10px] text-gray-500 dark:text-gray-400 gap-1">
                            <Clock size={10} />
                            {date}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 dark:text-gray-200 text-xs sm:text-sm">
                        {body}
                      </p>

                      {/* Extra meta */}
                      <div className="mt-2 flex flex-wrap gap-2 text-[10px] text-gray-500 dark:text-gray-400">
                        {item.source && <span>Chanzo: {item.source}</span>}
                        {item.audience && (
                          <span>
                            Walengwa:{' '}
                            {String(item.audience)
                              .replace(/_/g, ' ')
                              .toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
