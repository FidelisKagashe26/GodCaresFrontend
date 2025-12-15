import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";
import SEOHead from "../../components/SEOHead";
import api from "../../services/api";
import { Mail, Lock, AlertCircle, CheckCircle2 } from "lucide-react";

export default function ChangeEmail() {
  const { isDark } = useTheme();
  const { language } = useLanguage();

  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const canSubmit = useMemo(() => newEmail.trim().length >= 5 && password.length > 0 && !saving, [newEmail, password, saving]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setSaving(true);

    try {
      // OpenAPI: POST /api/v1/auth/change-email/ {new_email, password}
      const res = await api.changeEmail(newEmail.trim().toLowerCase(), password);
      setMessage(
        res?.detail ||
          (language === "sw"
            ? "Ombi limepokelewa. Tafadhali angalia email mpya (inbox/spam) kuthibitisha mabadiliko."
            : "Request received. Check your new email to confirm the change.")
      );
      setNewEmail("");
      setPassword("");
    } catch (err) {
      setError(err?.message || (language === "sw" ? "Imeshindikana kubadili email." : "Failed to change email."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <SEOHead title={language === "sw" ? "Badili Email" : "Change Email"} description="" />

      <section className={`min-h-[calc(100vh-160px)] flex items-center justify-center px-4 py-10 ${isDark ? "bg-gray-950" : "bg-gray-50"}`}>
        <div className={`max-w-md w-full rounded-2xl shadow-xl border p-6 md:p-8 ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>
          <h1 className={`text-lg md:text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
            {language === "sw" ? "Badili Email" : "Change Email"}
          </h1>
          <p className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            {language === "sw" ? "Utatumiwa link ya kuthibitisha kwenye email mpya." : "A confirmation link will be sent to the new email."}
          </p>

          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs md:text-sm text-red-700 dark:border-red-500/40 dark:bg-red-900/40 dark:text-red-100 flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div className="mt-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs md:text-sm text-green-700 dark:border-green-500/40 dark:bg-green-900/40 dark:text-green-100 flex items-center gap-2">
              <CheckCircle2 size={16} />
              <span>{message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <label className={`block mb-1 text-xs font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                {language === "sw" ? "Email mpya" : "New email"}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                  className={`w-full rounded-lg border px-9 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    isDark ? "bg-gray-950 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"
                  }`}
                  placeholder="new@example.com"
                />
              </div>
            </div>

            <div>
              <label className={`block mb-1 text-xs font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                {language === "sw" ? "Nenosiri la sasa" : "Current password"}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={`w-full rounded-lg border px-9 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    isDark ? "bg-gray-950 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <Link to="/profile" className="text-[11px] text-emerald-600 hover:underline dark:text-emerald-300">
                {language === "sw" ? "← Rudi Profaili" : "← Back to Profile"}
              </Link>

              <button
                type="submit"
                disabled={!canSubmit}
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-emerald-600 to-sky-600 hover:brightness-110 text-white disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? (language === "sw" ? "Inatuma..." : "Submitting...") : (language === "sw" ? "Tuma" : "Submit")}
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
