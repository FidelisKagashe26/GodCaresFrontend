import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/1000472563.png';

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
  ChevronDown,
} from 'lucide-react';

export default function Navbar() {
  const rootRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState(null);
  const [openMobileGroup, setOpenMobileGroup] = useState(null);

  const { isDark, toggleTheme } = useTheme();
  const { language, changeLanguage, t } = useLanguage();
  const { isAuthenticated, user, logout } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const closeAllDropdowns = () => {
    setLangOpen(false);
    setNotifOpen(false);
    setProfileOpen(false);
    setOpenGroup(null);
    setOpenMobileGroup(null);
  };

  useEffect(() => {
    closeAllDropdowns();
    setIsOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useEffect(() => {
    const onMouseDown = (e) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target)) {
        closeAllDropdowns();
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeAllDropdowns();
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const navItems = useMemo(
    () => ({
      home: { name: t('home') || 'Home', href: '/', icon: Home },
      about: { name: t('about') || 'About', href: '/kuhusu-sisi', icon: Info },
      news: { name: t('news') || 'News', href: '/habari', icon: Newspaper },
      studies: { name: t('studies') || 'Studies', href: '/mafunzo', icon: BookOpen },
      media: { name: t('media') || 'Media', href: '/media', icon: Image },
      shop: { name: t('shop') || 'Shop', href: '/duka', icon: ShoppingCart },
      events: { name: t('events') || 'Events', href: '/matukio', icon: Calendar },
      prayers: { name: t('prayers') || 'Prayers', href: '/maombi', icon: Heart },
      donations: { name: t('donations') || 'Donations', href: '/michango', icon: DollarSign },
    }),
    [t]
  );

  const navGroups = useMemo(
    () => [
      {
        id: 'journey',
        label: language === 'sw' ? 'Safari ya Imani' : 'Faith Journey',
        items: [navItems.studies, navItems.events],
      },
      {
        id: 'resources',
        label: language === 'sw' ? 'Rasilimali' : 'Resources',
        items: [navItems.media, navItems.news, navItems.shop],
      },
      {
        id: 'spiritual',
        label: language === 'sw' ? 'Huduma za Kiroho' : 'Spiritual Care',
        items: [navItems.prayers, navItems.donations, navItems.about],
      },
    ],
    [language, navItems]
  );

  const isGroupActive = (group) => group.items.some((item) => isActive(item.href));

  // Demo notifications (unaweza kuunganisha API baadaye)
  const notifications = useMemo(() => {
    if (!isAuthenticated) return [];
    return [
      {
        id: 1,
        title: language === 'sw' ? 'Karibu God Cares 365' : 'Welcome to God Cares 365',
        description: language === 'sw' ? 'Anza safari yako ya imani leo.' : 'Start your faith journey today.',
        created_at: new Date().toISOString(),
      },
    ];
  }, [isAuthenticated, language]);

  const unreadCount = notifications.length;

  const initials = useMemo(() => {
    const c = user?.first_name?.[0] || user?.last_name?.[0] || user?.username?.[0] || 'U';
    return String(c).toUpperCase();
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      closeAllDropdowns();
      setIsOpen(false);
      navigate('/', { replace: true });
    }
  };

  return (
    <nav
      ref={rootRef}
      className={`sticky top-0 z-50 border-b backdrop-blur-md transition-colors ${isDark ? 'bg-gray-950/85 border-gray-800' : 'bg-white/85 border-gray-200'}`}
    >
      <div className="container mx-auto px-3 md:px-4">
        <div className="flex items-center justify-between h-14 md:h-16">
          <Link
            to="/"
            className="flex items-center gap-3"
            onClick={() => {
              closeAllDropdowns();
              setIsOpen(false);
            }}
          >
            <div className="flex h-20 w-auto mb-1 items-center">
              <img src={logo} alt="God Cares 365 Logo" className="h-20 w-auto object-contain" />
            </div>

            <div className="flex flex-col leading-tight">
              <span className={`text-[11px] md:text-xs hidden md:block font-semibold uppercase tracking-[0.18em] ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
                GOD CARES 365
              </span>
              <span className={`hidden sm:inline text-[10px] md:text-xs font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                Every Door • Every Soul • Every Day
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-2">
            <Link
              to={navItems.home.href}
              onClick={closeAllDropdowns}
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[12px] font-medium transition-all ${
                isActive(navItems.home.href)
                  ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-500/60 shadow-sm'
                  : isDark
                  ? 'text-gray-300 hover:text-white hover:bg-gray-800/80'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Home size={14} />
              <span>{navItems.home.name}</span>
            </Link>

            {navGroups.map((group) => (
              <div key={group.id} className="relative">
                <button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={openGroup === group.id}
                  onClick={() => {
                    closeAllDropdowns();
                    setOpenGroup((prev) => (prev === group.id ? null : group.id));
                  }}
                  className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-[12px] font-medium transition-all ${
                    isGroupActive(group)
                      ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-500/60 shadow-sm'
                      : isDark
                      ? 'text-gray-300 hover:text-white hover:bg-gray-800/80'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span>{group.label}</span>
                  <ChevronDown size={14} className={`transition-transform ${openGroup === group.id ? 'rotate-180' : ''}`} />
                </button>

                {openGroup === group.id && (
                  <div role="menu" className={`absolute left-0 mt-2 w-52 rounded-xl border shadow-lg shadow-gray-900/10 ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700">
                      <p className={`text-[11px] font-semibold uppercase tracking-wide ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{group.label}</p>
                    </div>
                    <div className="py-1">
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            to={item.href}
                            onClick={() => {
                              closeAllDropdowns();
                              setOpenGroup(null);
                            }}
                            className={`flex items-center gap-2 px-3 py-2 text-[12px] transition-colors ${
                              isActive(item.href)
                                ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300'
                                : isDark
                                ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                          >
                            <Icon size={15} />
                            <span>{item.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-1 md:gap-2 relative">
            {isAuthenticated ? (
              <>
                <div className="relative">
                  <button
                    onClick={() => {
                      closeAllDropdowns();
                      setNotifOpen((v) => !v);
                    }}
                    className={`relative inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors ${isDark ? 'hover:bg-gray-800 hover:text-gray-100' : 'hover:bg-gray-100 hover:text-gray-800'}`}
                    aria-label="Notifications"
                    aria-expanded={notifOpen}
                  >
                    <Bell size={18} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 rounded-full bg-emerald-500 px-1.5 text-[9px] font-semibold text-white shadow-sm">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {notifOpen && (
                    <div className={`absolute right-0 mt-2 w-80 rounded-xl border shadow-xl shadow-gray-900/15 ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
                      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          {language === 'sw' ? 'Taarifa za hivi karibuni' : 'Recent notifications'}
                        </p>
                      </div>

                      <div className="max-h-72 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <p className="px-4 py-3 text-[12px] text-gray-500 dark:text-gray-300">
                            {language === 'sw' ? 'Hakuna taarifa kwa sasa.' : 'No notifications yet.'}
                          </p>
                        ) : (
                          notifications.map((item) => (
                            <div key={item.id} className="px-4 py-3 text-[12px] border-b last:border-b-0 border-gray-100 dark:border-gray-700">
                              <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.title}</div>
                              {item.description && <div className="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">{item.description}</div>}
                              {item.created_at && <div className="mt-1 text-[10px] text-gray-400">{new Date(item.created_at).toLocaleString()}</div>}
                            </div>
                          ))
                        )}
                      </div>

                      <div className="px-4 py-2 text-right">
                        <Link
                          to="/notifications"
                          onClick={() => {
                            closeAllDropdowns();
                            setNotifOpen(false);
                          }}
                          className="text-[11px] font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
                        >
                          {language === 'sw' ? 'Angalia zote' : 'View all'}
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <button
                    onClick={() => {
                      closeAllDropdowns();
                      setProfileOpen((v) => !v);
                    }}
                    className={`flex items-center gap-2 rounded-full px-2 py-1 pl-1 pr-2 transition-colors ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100 border border-transparent hover:border-gray-200'}`}
                    aria-label="Account menu"
                    aria-expanded={profileOpen}
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 text-[11px] font-bold text-white shadow-sm">
                      {initials}
                    </div>
                    <div className="hidden md:flex flex-col leading-tight">
                      <span className={`text-[11px] font-semibold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
                        {user?.first_name || user?.username || (language === 'sw' ? 'Akaunti' : 'Account')}
                      </span>
                      <span className="text-[10px] text-gray-500 dark:text-gray-400">
                        {language === 'sw' ? 'Safari ya God Cares 365' : 'Your God Cares 365 journey'}
                      </span>
                    </div>
                  </button>

                  {profileOpen && (
                    <div className={`absolute right-0 mt-2 w-56 rounded-xl border shadow-xl shadow-gray-900/15 ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                        <p className={`text-[11px] font-semibold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
                          {user?.first_name || user?.username || (language === 'sw' ? 'Akaunti' : 'Account')}
                        </p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400">
                          {user?.email || ''}
                        </p>
                      </div>

                      <Link to="/profile" className="flex items-center px-4 py-2 text-[12px] hover:bg-gray-100 dark:hover:bg-gray-800" onClick={closeAllDropdowns}>
                        <UserIcon size={14} className="mr-2" />
                        {language === 'sw' ? 'Profaili Yangu' : 'My Profile'}
                      </Link>

                      <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-[12px] text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800">
                        {language === 'sw' ? 'Toka (Logout)' : 'Logout'}
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/login"
                  className="inline-flex items-center rounded-full border border-emerald-500 px-3 py-1.5 text-[12px] font-semibold text-emerald-600 hover:bg-emerald-50 dark:border-emerald-400 dark:text-emerald-300 dark:hover:bg-gray-900"
                  onClick={closeAllDropdowns}
                >
                  <UserIcon size={14} className="mr-1.5" />
                  {t('login') || (language === 'sw' ? 'Ingia' : 'Login')}
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center rounded-full bg-gradient-to-r from-emerald-500 to-blue-600 px-3.5 py-1.5 text-[12px] font-semibold text-white shadow-sm shadow-emerald-500/40 hover:brightness-110"
                  onClick={closeAllDropdowns}
                >
                  {t('register') || (language === 'sw' ? 'Jisajili' : 'Register')}
                </Link>
              </div>
            )}

            <div className="relative">
              <button
                onClick={() => {
                  closeAllDropdowns();
                  setLangOpen((v) => !v);
                }}
                className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors ${isDark ? 'hover:bg-gray-800 hover:text-gray-100' : 'hover:bg-gray-100 hover:text-gray-800'}`}
                aria-label="Language"
                aria-expanded={langOpen}
              >
                <Globe size={18} />
              </button>

              {langOpen && (
                <div className={`absolute right-0 mt-2 w-32 rounded-xl border shadow-lg ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <button
                    onClick={() => {
                      changeLanguage('sw');
                      setLangOpen(false);
                    }}
                    className={`block w-full px-4 py-2 text-left text-[12px] hover:bg-gray-100 dark:hover:bg-gray-800 ${language === 'sw' ? 'font-semibold text-emerald-600 dark:text-emerald-300' : ''}`}
                  >
                    Kiswahili
                  </button>
                  <button
                    onClick={() => {
                      changeLanguage('en');
                      setLangOpen(false);
                    }}
                    className={`block w-full px-4 py-2 text-left text-[12px] hover:bg-gray-100 dark:hover:bg-gray-800 ${language === 'en' ? 'font-semibold text-emerald-600 dark:text-emerald-300' : ''}`}
                  >
                    English
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                toggleTheme();
                closeAllDropdowns();
              }}
              className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors ${isDark ? 'hover:bg-gray-800 hover:text-yellow-300' : 'hover:bg-gray-100 hover:text-gray-800'}`}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              onClick={() => {
                setIsOpen((v) => !v);
                closeAllDropdowns();
              }}
              className={`lg:hidden inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors ${isDark ? 'hover:bg-gray-800 hover:text-gray-100' : 'hover:bg-gray-100 hover:text-gray-800'}`}
              aria-label="Menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className={`lg:hidden border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
            <div className="py-3 space-y-1 text-[11px]">
              {isAuthenticated ? (
                <div className="px-3 pb-2">
                  <div className={`rounded-xl border p-3 ${isDark ? 'border-gray-800 bg-gray-900/60' : 'border-gray-200 bg-white/60'}`}>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 text-[12px] font-bold text-white">
                        {initials}
                      </div>
                      <div className="leading-tight">
                        <div className={`text-[12px] font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {user?.first_name || user?.username || (language === 'sw' ? 'Akaunti' : 'Account')}
                        </div>
                        <div className="text-[10px] text-gray-500 dark:text-gray-400">{user?.email || ''}</div>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <Link
                        to="/profile"
                        onClick={() => setIsOpen(false)}
                        className={`rounded-lg px-3 py-2 text-center text-[11px] font-semibold ${isDark ? 'bg-gray-800 text-gray-100' : 'bg-gray-100 text-gray-800'}`}
                      >
                        {language === 'sw' ? 'Profaili' : 'Profile'}
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="rounded-lg px-3 py-2 text-center text-[11px] font-semibold bg-red-600/10 text-red-600 dark:text-red-300"
                      >
                        {language === 'sw' ? 'Toka' : 'Logout'}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="px-2 pb-2 flex gap-2">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-emerald-500 px-3 py-2 text-[11px] font-semibold text-emerald-600 hover:bg-emerald-50 dark:border-emerald-400 dark:text-emerald-300 dark:hover:bg-gray-900"
                  >
                    <UserIcon size={14} />
                    <span>{t('login') || (language === 'sw' ? 'Ingia' : 'Login')}</span>
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-blue-600 px-3 py-2 text-[11px] font-semibold text-white shadow-sm shadow-emerald-500/40 hover:brightness-110"
                  >
                    <span>{t('register') || (language === 'sw' ? 'Jisajili' : 'Register')}</span>
                  </Link>
                </div>
              )}

              <div className="px-2">
                <Link
                  to={navItems.home.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2 rounded-lg px-2 py-2 text-[11px] font-semibold ${
                    isActive(navItems.home.href)
                      ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300'
                      : isDark
                      ? 'text-gray-200 hover:bg-gray-800 hover:text-white'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Home size={14} />
                  <span>{navItems.home.name}</span>
                </Link>
              </div>

              {navGroups.map((group) => (
                <div key={group.id} className="px-2">
                  <button
                    type="button"
                    onClick={() => setOpenMobileGroup((prev) => (prev === group.id ? null : group.id))}
                    className={`flex w-full items-center justify-between rounded-lg px-2 py-2 text-[11px] font-semibold tracking-tight ${
                      isGroupActive(group)
                        ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300'
                        : isDark
                        ? 'text-gray-200'
                        : 'text-gray-700'
                    }`}
                  >
                    <span>{group.label}</span>
                    <ChevronDown size={14} className={`transition-transform ${openMobileGroup === group.id ? 'rotate-180' : ''}`} />
                  </button>

                  {openMobileGroup === group.id && (
                    <div className="mt-1 space-y-0.5 rounded-lg bg-gray-50 p-1 dark:bg-gray-900/80">
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            to={item.href}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-[11px] ${
                              isActive(item.href)
                                ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300'
                                : isDark
                                ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                          >
                            <Icon size={14} />
                            <span>{item.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}

              <div className="px-3 pt-1 pb-1 flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400">
                <span>{language === 'sw' ? 'God Cares 365 • Safari ya Imani' : 'God Cares 365 • Faith Journey'}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
