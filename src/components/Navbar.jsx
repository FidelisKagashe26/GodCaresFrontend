// src/components/Navbar.jsx
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import useApi from '../hooks/useApi';

import {
  Menu,
  X,
  Sun,
  Moon,
  Globe,
  Home,
  Info,
  Newspaper,
  BookOpen,
  Image,
  ShoppingCart,
  Calendar,
  Heart,
  DollarSign,
  Bell,
  User as UserIcon,
} from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const { isDark, toggleTheme } = useTheme();
  const { language, changeLanguage, t } = useLanguage();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  const navigation = [
    { name: t('home'), href: '/', icon: Home },
    { name: t('about'), href: '/kuhusu-sisi', icon: Info },
    { name: t('news'), href: '/habari', icon: Newspaper },
    { name: t('studies'), href: '/mafunzo', icon: BookOpen },
    { name: 'Media', href: '/media', icon: Image },
    { name: t('shop'), href: '/duka', icon: ShoppingCart },
    { name: t('events'), href: '/matukio', icon: Calendar },
    { name: t('prayers'), href: '/maombi', icon: Heart },
    { name: t('donations'), href: '/michango', icon: DollarSign },
  ];

  const isActive = (path) => location.pathname === path;

  // Notifications (simple) from user-activities
  const { data: activities } = useApi('user-activities', {
    skip: !isAuthenticated,
  });

  const notifications = activities?.results?.slice(0, 5) || [];
  const unreadCount = notifications.length;

  const initials = (
    user?.first_name?.[0] ||
    user?.last_name?.[0] ||
    user?.username?.[0] ||
    'U'
  ).toUpperCase();

  const closeAllDropdowns = () => {
    setLangOpen(false);
    setNotifOpen(false);
    setProfileOpen(false);
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-colors border-b ${
        isDark
          ? 'bg-gray-900/95 backdrop-blur-sm border-gray-700'
          : 'bg-white/95 backdrop-blur-sm border-gray-200'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2"
            onClick={() => {
              closeAllDropdowns();
              setIsOpen(false);
            }}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">GC</span>
            </div>
            <span
              className={`font-bold text-lg ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              GOD CARES 365
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      : isDark
                      ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  onClick={closeAllDropdowns}
                >
                  <Icon size={16} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Controls (right) */}
          <div className="flex items-center space-x-2 relative">
            {/* Authenticated: show notifications & profile */}
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setNotifOpen((v) => !v);
                      setProfileOpen(false);
                      setLangOpen(false);
                    }}
                    className={`p-2 rounded-lg transition-colors relative ${
                      isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                    }`}
                  >
                    <Bell size={20} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  {notifOpen && (
                    <div
                      className={`absolute right-0 mt-2 w-80 rounded-lg shadow-lg border ${
                        isDark
                          ? 'bg-gray-800 border-gray-700'
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wide border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400">
                        Notifications
                      </div>
                      <div className="max-h-72 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <p className="px-4 py-3 text-sm text-gray-500 dark:text-gray-300">
                            Hakuna taarifa mpya kwa sasa.
                          </p>
                        ) : (
                          notifications.map((item) => (
                            <div
                              key={item.id}
                              className="px-4 py-3 text-sm border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                            >
                              <div
                                className={`font-medium ${
                                  isDark ? 'text-white' : 'text-gray-800'
                                }`}
                              >
                                {item.activity_type || 'Tukio jipya'}
                              </div>
                              {item.description && (
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {item.description}
                                </div>
                              )}
                              {item.created_at && (
                                <div className="text-xs text-gray-400 mt-1">
                                  {new Date(
                                    item.created_at
                                  ).toLocaleString()}
                                </div>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                      <div className="px-4 py-2 text-right">
                        <Link
                          to="/notifications"
                          onClick={closeAllDropdowns}
                          className="text-xs font-semibold text-green-600 dark:text-green-400 hover:underline"
                        >
                          Angalia zote
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setProfileOpen((v) => !v);
                      setNotifOpen(false);
                      setLangOpen(false);
                    }}
                    className={`flex items-center space-x-2 px-2 py-1 rounded-lg transition-colors ${
                      isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold">
                      {initials}
                    </div>
                    <span
                      className={`hidden md:inline text-sm ${
                        isDark ? 'text-gray-100' : 'text-gray-700'
                      }`}
                    >
                      {user?.first_name || user?.username || 'Akaunti'}
                    </span>
                  </button>
                  {profileOpen && (
                    <div
                      className={`absolute right-0 mt-2 w-52 rounded-lg shadow-lg border ${
                        isDark
                          ? 'bg-gray-800 border-gray-700'
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={closeAllDropdowns}
                      >
                        <UserIcon size={16} className="mr-2" />
                        Profaili Yangu
                      </Link>
                      <Link
                        to="/mafunzo"
                        className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={closeAllDropdowns}
                      >
                        Safari ya Mafunzo
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          closeAllDropdowns();
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Toka (Logout)
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              // Guest: onyesha Login CTA (desktop)
              <Link
                to="/login"
                className="hidden md:inline-flex items-center px-3 py-2 rounded-lg text-sm font-semibold border border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-gray-800"
                onClick={closeAllDropdowns}
              >
                {t('login') || 'Ingia'}
              </Link>
            )}

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => {
                  setLangOpen((v) => !v);
                  setNotifOpen(false);
                  setProfileOpen(false);
                }}
                className={`p-2 rounded-lg transition-colors ${
                  isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                }`}
              >
                <Globe size={20} />
              </button>
              {langOpen && (
                <div
                  className={`absolute right-0 mt-2 w-32 rounded-lg shadow-lg border ${
                    isDark
                      ? 'bg-gray-800 border-gray-700'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <button
                    onClick={() => {
                      changeLanguage('sw');
                      setLangOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      language === 'sw' ? 'font-semibold' : ''
                    }`}
                  >
                    Kiswahili
                  </button>
                  <button
                    onClick={() => {
                      changeLanguage('en');
                      setLangOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      language === 'en' ? 'font-semibold' : ''
                    }`}
                  >
                    English
                  </button>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => {
                toggleTheme();
                closeAllDropdowns();
              }}
              className={`p-2 rounded-lg transition-colors ${
                isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => {
                setIsOpen((v) => !v);
                closeAllDropdowns();
              }}
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div
            className={`lg:hidden border-t ${
              isDark ? 'border-gray-700' : 'border-gray-200'
            }`}
          >
            <div className="py-4 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                      isActive(item.href)
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        : isDark
                        ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              {/* Login link kwa mobile */}
              {!isAuthenticated && (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg font-semibold text-green-600 border border-green-500 mt-2"
                >
                  <UserIcon size={20} />
                  <span>{t('login') || 'Ingia'}</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
