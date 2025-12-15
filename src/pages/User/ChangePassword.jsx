import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";
import SEOHead from "../../components/SEOHead";
import api from "../../services/api";
import { Lock, ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react";

export default function ChangePassword() {
  const { isDark } = useTheme();
  const { language } = useLanguage();

  const [form, setForm] = useState({
    current_password: "",
    new_password: "",
    confirm_new_password: "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const canSubmit = useMemo(() => {
    return form.current_password.length > 0 && form.new_password.length >= 8 && form.confirm_new_password.length >= 8 && !saving;
  }, [form, saving]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (form.new_password !== form.confirm_new_password) {
      setError(language === "sw" ? "Nenosiri jipya na uthibitisho havilingani." : "Passwords do not match.");
      return;
    }

    setSaving(true);
    try {
      // OpenAPI: POST /api/v1/auth/change-password/ {current_password, new_password}
      const res = await api.changePassword(form.current_password, form.new_password);
      setMessage(res?.detail || (language === "sw" ? "Nenosiri limebadilishwa." : "Password changed successfully."));
      setForm({ current_password: "", new_password: "", confirm_new_password: "" });
    } catch (err) {
      setError(err?.message || (language === "sw" ? "Imeshindikana kubadili nenosiri." : "Failed to change password."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <SEOHead title={language === "sw" ? "Badili Nenosiri" : "Change Password"} description="" />

      <section className={`min-h-[calc(100vh-160px)] flex items-center justify-center px-4 py-10 ${isDark ? "bg-gray-950" : "bg-gray-50"}`}>
        <div className={`max-w-md w-full rounded-2xl shadow-xl border p-6 md:p-8 ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 flex items-center justify-center text-white">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h1 className={`text-lg md:text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                {language === "sw" ? "Badili Neno la Siri" : "Change Password"}
              </h1>
              <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                {language === "sw" ? "Angalau herufi 8." : "At least 8 characters."}
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs md:text-sm text-red-700 dark:border-red-500/40 dark:bg-red-900/40 dark:text-red-100 flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs md:text-sm text-green-700 dark:border-green-500/40 dark:bg-green-900/40 dark:text-green-100 flex items-center gap-2">
              <CheckCircle2 size={16} />
              <span>{message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
                  name="current_password"
                  value={form.current_password}
                  onChange={handleChange}
                  required
                  className={`w-full rounded-lg border px-9 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                    isDark ? "bg-gray-950 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
              </div>
            </div>

            <div>
              <label className={`block mb-1 text-xs font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                {language === "sw" ? "Nenosiri jipya" : "New password"}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  name="new_password"
                  value={form.new_password}
                  onChange={handleChange}
                  required
                  className={`w-full rounded-lg border px-9 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                    isDark ? "bg-gray-950 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
              </div>
            </div>

            <div>
              <label className={`block mb-1 text-xs font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                {language === "sw" ? "Thibitisha nenosiri jipya" : "Confirm new password"}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  name="confirm_new_password"
                  value={form.confirm_new_password}
                  onChange={handleChange}
                  required
                  className={`w-full rounded-lg border px-9 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                    isDark ? "bg-gray-950 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Link to="/profile" className="text-[11px] text-sky-600 hover:underline dark:text-sky-400">
                {language === "sw" ? "← Rudi kwenye profaili" : "← Back to profile"}
              </Link>

              <button
                type="submit"
                disabled={!canSubmit}
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-sky-600 to-emerald-600 hover:brightness-110 text-white disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving && <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {saving ? (language === "sw" ? "Inahifadhi..." : "Saving...") : (language === "sw" ? "Hifadhi" : "Save")}
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
