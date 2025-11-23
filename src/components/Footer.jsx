import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const { isDark } = useTheme();
  const { t } = useLanguage();

  return (
    <footer className={`transition-colors ${
      isDark ? 'bg-gray-950 text-gray-300' : 'bg-gray-800 text-gray-300'
    }`}>
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">GC</span>
              </div>
              <h3 className={`text-xl font-semibold ${
                isDark ? 'text-gray-100' : 'text-white'
              }`}>GOD CARES 365</h3>
            </div>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-400'} mb-4`}>
              {t('footerDescription')}
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className={`transition-colors ${
                isDark ? 'hover:text-gray-100' : 'hover:text-white'
              }`} aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com" className={`transition-colors ${
                isDark ? 'hover:text-gray-100' : 'hover:text-white'
              }`} aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="https://instagram.com" className={`transition-colors ${
                isDark ? 'hover:text-gray-100' : 'hover:text-white'
              }`} aria-label="Instagram">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={`text-xl font-semibold mb-4 ${
              isDark ? 'text-gray-100' : 'text-white'
            }`}>{t('quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className={`transition-colors ${
                  isDark ? 'hover:text-gray-100' : 'hover:text-white'
                }`}>{t('home')}</Link>
              </li>
              <li>
                <Link to="/kuhusu-sisi" className={`transition-colors ${
                  isDark ? 'hover:text-gray-100' : 'hover:text-white'
                }`}>{t('about')}</Link>
              </li>
              <li>
                <Link to="/habari" className={`transition-colors ${
                  isDark ? 'hover:text-gray-100' : 'hover:text-white'
                }`}>{t('news')}</Link>
              </li>
              <li>
                <Link to="/mafunzo" className={`transition-colors ${
                  isDark ? 'hover:text-gray-100' : 'hover:text-white'
                }`}>{t('studies')}</Link>
              </li>
              <li>
                <Link to="/maombi" className={`transition-colors ${
                  isDark ? 'hover:text-gray-100' : 'hover:text-white'
                }`}>{t('prayers')}</Link>
              </li>
              <li>
                <Link to="/michango" className={`transition-colors ${
                  isDark ? 'hover:text-gray-100' : 'hover:text-white'
                }`}>{t('donations')}</Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className={`text-xl font-semibold mb-4 ${
              isDark ? 'text-gray-100' : 'text-white'
            }`}>Huduma Zetu</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/mafunzo" className={`transition-colors ${
                  isDark ? 'hover:text-gray-100' : 'hover:text-white'
                }`}>Masomo ya Biblia</Link>
              </li>
              <li>
                <Link to="/maombi" className={`transition-colors ${
                  isDark ? 'hover:text-gray-100' : 'hover:text-white'
                }`}>Maombi ya Pamoja</Link>
              </li>
              <li>
                <Link to="/matukio" className={`transition-colors ${
                  isDark ? 'hover:text-gray-100' : 'hover:text-white'
                }`}>Matukio ya Kiroho</Link>
              </li>
              <li>
                <Link to="/media" className={`transition-colors ${
                  isDark ? 'hover:text-gray-100' : 'hover:text-white'
                }`}>Rasilimali za Media</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className={`text-xl font-semibold mb-4 ${
              isDark ? 'text-gray-100' : 'text-white'
            }`}>{t('contactUs')}</h3>
            <div className="space-y-3">
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

        <div className={`mt-8 pt-8 border-t text-center ${
          isDark ? 'border-gray-800 text-gray-500' : 'border-gray-700 text-gray-500'
        }`}>
          &copy; {new Date().getFullYear()} GOD CARES 365. {t('allRightsReserved')}.
        </div>
      </div>
    </footer>
  );
}