import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const { isDark } = useTheme();
  const { t } = useLanguage();

  return (
    <footer
      className={`transition-colors ${
        isDark
          ? 'bg-gray-950 text-gray-300'
          : 'bg-slate-900 text-gray-300'
      }`}
    >
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm shadow-emerald-500/40">
                <span className="text-white font-extrabold text-sm tracking-tight">
                  GC
                </span>
              </div>
              <h3
                className={`text-xl font-semibold tracking-wide ${
                  isDark ? 'text-gray-100' : 'text-white'
                }`}
              >
                GOD CARES 365
              </h3>
            </div>
            <p
              className={`text-sm leading-relaxed mb-4 ${
                isDark ? 'text-gray-400' : 'text-gray-300'
              }`}
            >
              {t('footerDescription')}
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                className={`transition-colors ${
                  isDark
                    ? 'hover:text-emerald-400'
                    : 'hover:text-emerald-300'
                }`}
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://twitter.com"
                className={`transition-colors ${
                  isDark
                    ? 'hover:text-emerald-400'
                    : 'hover:text-emerald-300'
                }`}
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://instagram.com"
                className={`transition-colors ${
                  isDark
                    ? 'hover:text-emerald-400'
                    : 'hover:text-emerald-300'
                }`}
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3
              className={`text-sm font-semibold uppercase tracking-wide mb-4 ${
                isDark ? 'text-gray-100' : 'text-white'
              }`}
            >
              {t('quickLinks')}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className={`transition-colors ${
                    isDark
                      ? 'hover:text-emerald-400'
                      : 'hover:text-emerald-300'
                  }`}
                >
                  {t('home')}
                </Link>
              </li>
              <li>
                <Link
                  to="/kuhusu-sisi"
                  className={`transition-colors ${
                    isDark
                      ? 'hover:text-emerald-400'
                      : 'hover:text-emerald-300'
                  }`}
                >
                  {t('about')}
                </Link>
              </li>
              <li>
                <Link
                  to="/habari"
                  className={`transition-colors ${
                    isDark
                      ? 'hover:text-emerald-400'
                      : 'hover:text-emerald-300'
                  }`}
                >
                  {t('news')}
                </Link>
              </li>
              <li>
                <Link
                  to="/mafunzo"
                  className={`transition-colors ${
                    isDark
                      ? 'hover:text-emerald-400'
                      : 'hover:text-emerald-300'
                  }`}
                >
                  {t('studies')}
                </Link>
              </li>
              <li>
                <Link
                  to="/maombi"
                  className={`transition-colors ${
                    isDark
                      ? 'hover:text-emerald-400'
                      : 'hover:text-emerald-300'
                  }`}
                >
                  {t('prayers')}
                </Link>
              </li>
              <li>
                <Link
                  to="/michango"
                  className={`transition-colors ${
                    isDark
                      ? 'hover:text-emerald-400'
                      : 'hover:text-emerald-300'
                  }`}
                >
                  {t('donations')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3
              className={`text-sm font-semibold uppercase tracking-wide mb-4 ${
                isDark ? 'text-gray-100' : 'text-white'
              }`}
            >
              Huduma Zetu
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/mafunzo"
                  className={`transition-colors ${
                    isDark
                      ? 'hover:text-emerald-400'
                      : 'hover:text-emerald-300'
                  }`}
                >
                  Masomo ya Biblia
                </Link>
              </li>
              <li>
                <Link
                  to="/maombi"
                  className={`transition-colors ${
                    isDark
                      ? 'hover:text-emerald-400'
                      : 'hover:text-emerald-300'
                  }`}
                >
                  Maombi ya Pamoja
                </Link>
              </li>
              <li>
                <Link
                  to="/matukio"
                  className={`transition-colors ${
                    isDark
                      ? 'hover:text-emerald-400'
                      : 'hover:text-emerald-300'
                  }`}
                >
                  Matukio ya Kiroho
                </Link>
              </li>
              <li>
                <Link
                  to="/media"
                  className={`transition-colors ${
                    isDark
                      ? 'hover:text-emerald-400'
                      : 'hover:text-emerald-300'
                  }`}
                >
                  Rasilimali za Media
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3
              className={`text-sm font-semibold uppercase tracking-wide mb-4 ${
                isDark ? 'text-gray-100' : 'text-white'
              }`}
            >
              {t('contactUs')}
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3">
                <Mail size={16} />
                <span>fmklink@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={16} />
                <span>+255 767 525 234</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin size={16} />
                <span>Dar es Salaam, Tanzania</span>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`mt-8 pt-8 border-t text-center text-xs ${
            isDark
              ? 'border-emerald-500/20 text-gray-500'
              : 'border-emerald-500/20 text-gray-400'
          }`}
        >
          &copy; {new Date().getFullYear()} GOD CARES 365. {t('allRightsReserved')}.
        </div>
      </div>
    </footer>
  );
}
