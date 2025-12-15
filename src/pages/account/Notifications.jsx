import { useMemo, useState } from "react";
import { Bell, Inbox } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";
import SEOHead from "../../components/SEOHead";

export default function Notifications() {
  const { isDark } = useTheme();
  const { language } = useLanguage();

  // OpenAPI yako haina notifications endpoints, so hapa ni UI only (demo/local).
  const [items] = useState([
    {
      id: 1,
      title: language === "sw" ? "Karibu GOD CARES 365" : "Welcome to GOD CARES 365",
      message: language === "sw" ? "Uko tayari kuanza safari yako." : "You are ready to start your journey.",
      is_read: false,
      created_at: new Date().toISOString(),
    },
  ]);

  const unreadCount = useMemo(() => items.filter((x) => !x.is_read).length, [items]);

  return (
    <>
      <SEOHead title={language === "sw" ? "Notifications" : "Notifications"} description="" />

      <section className={`min-h-[calc(100vh-200px)] py-10 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="max-w-4xl mx-auto px-4">
          <header className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white">
                <Bell size={22} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {language === "sw" ? "Taarifa & Notifications" : "Notifications"}
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  {language === "sw"
                    ? "OpenAPI haijaonyesha endpoints za notifications — hapa ni UI ya ndani."
                    : "OpenAPI does not include notification endpoints — this is local UI."}
                </p>
              </div>
            </div>

            <div className="text-right text-xs text-gray-500 dark:text-gray-400">
              <div>{language === "sw" ? "Jumla" : "Total"}: {items.length}</div>
              <div className="font-semibold text-blue-600 dark:text-blue-300">
                {language === "sw" ? "Zisizosomwa" : "Unread"}: {unreadCount}
              </div>
            </div>
          </header>

          {items.length === 0 ? (
            <div className={`mt-4 rounded-2xl border px-6 py-10 text-center ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
              <Inbox className={isDark ? "text-gray-400 mx-auto mb-4" : "text-gray-500 mx-auto mb-4"} size={40} />
              <p className={isDark ? "text-gray-300 text-sm" : "text-gray-600 text-sm"}>
                {language === "sw" ? "Kwa sasa hakuna notifications." : "No notifications yet."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((n) => (
                <div
                  key={n.id}
                  className={`rounded-xl border px-4 py-3 ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
                >
                  <div className="font-semibold text-gray-900 dark:text-white">{n.title}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">{n.message}</div>
                  <div className="text-[11px] text-gray-400 mt-2">{new Date(n.created_at).toLocaleString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
