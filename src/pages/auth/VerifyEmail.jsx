import { useMemo, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";
import SEOHead from "../../components/SEOHead";
import api from "../../services/api";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function VerifyEmail() {
  const { isDark } = useTheme();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [search] = useSearchParams();
  const tokenFromUrl = search.get("token") || "";

  const [token, setToken] = useState(tokenFromUrl);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const canSubmit = useMemo(() => token.trim().length > 10 && !loading, [token, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      // OpenAPI: POST /api/v1/auth/verify-email/ {token}
      const res = await api.verifyEmail(token.trim());
      setMessage(res?.detail || (language === "sw" ? "Email imethibitishwa." : "Email verified."));
      setTimeout(() => navigate("/login?verified=1", { replace: true }), 900);
    } catch (err) {
      setError(err?.message || (language === "sw" ? "Imeshindikana kuthibitisha email." : "Failed to verify email."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEOHead title={language === "sw" ? "Thibitisha Email" : "Verify Email"} description="" />

      <section className={`min-h-[calc(100vh-160px)] flex items-center justify-center px-4 py-10 ${isDark ? "bg-gray-950" : "bg-gray-50"}`}>
        <div className={`max-w-md w-full rounded-2xl shadow-xl border p-6 md:p-8 ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>
          <h1 className={`text-lg md:text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
            {language === "sw" ? "Thibitisha Email" : "Verify Email"}
          </h1>

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
                {language === "sw" ? "Token" : "Token"}
              </label>
              <input
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  isDark ? "bg-gray-950 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"
                }`}
                placeholder="paste token here"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <Link to="/login" className="text-[11px] text-emerald-600 hover:underline dark:text-emerald-300">
                {language === "sw" ? "← Nenda Login" : "← Go to Login"}
              </Link>

              <button
                type="submit"
                disabled={!canSubmit}
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-emerald-600 to-sky-600 hover:brightness-110 text-white disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (language === "sw" ? "Inathibitisha..." : "Verifying...") : (language === "sw" ? "Thibitisha" : "Verify")}
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
