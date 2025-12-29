// src/components/Navbar.jsx
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/1000472563.png";

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
} from "lucide-react";

export default function Navbar() {
  const rootRef = useRef(null);

  // Desktop measurement refs
  const desktopWrapRef = useRef(null); // width container
  const measureMoreRef = useRef(null);
  const measureItemRefs = useRef({});

  const [isOpen, setIsOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const [containerWidth, setContainerWidth] = useState(0);
  const [itemWidths, setItemWidths] = useState({});
  const [moreWidth, setMoreWidth] = useState(0);

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
    setMoreOpen(false);
  };

  // Close menus on route change
  useEffect(() => {
    closeAllDropdowns();
    setIsOpen(false);
  }, [location.pathname]);

  // Close on outside click
  useEffect(() => {
    const onMouseDown = (e) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target)) {
        closeAllDropdowns();
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  // Close on Escape
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        closeAllDropdowns();
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  // Lock scroll on mobile menu open
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const navItems = useMemo(
    () => ({
      home: { id: "home", name: t("home") || "Home", href: "/", icon: Home },
      about: { id: "about", name: t("about") || "About", href: "/kuhusu-sisi", icon: Info },
      news: { id: "news", name: t("news") || "News", href: "/habari", icon: Newspaper },
      studies: { id: "studies", name: t("studies") || "Studies", href: "/mafunzo", icon: BookOpen },
      media: { id: "media", name: t("media") || "Media", href: "/media", icon: Image },
      shop: { id: "shop", name: t("shop") || "Shop", href: "/duka", icon: ShoppingCart },
      events: { id: "events", name: t("events") || "Events", href: "/matukio", icon: Calendar },
      prayers: { id: "prayers", name: t("prayers") || "Prayers", href: "/maombi", icon: Heart },
      donations: { id: "donations", name: t("donations") || "Donations", href: "/michango", icon: DollarSign },
    }),
    [t]
  );

  const desktopOrder = useMemo(
    () => [
      navItems.home,
      navItems.about,
      navItems.news,
      navItems.studies,
      navItems.media,
      navItems.shop,
      navItems.events,
      navItems.prayers,
      navItems.donations,
    ],
    [navItems]
  );

  // Demo notifications
  const notifications = useMemo(() => {
    if (!isAuthenticated) return [];
    return [
      {
        id: 1,
        title: language === "sw" ? "Karibu God Cares 365" : "Welcome to God Cares 365",
        description: language === "sw" ? "Anza safari yako ya imani leo." : "Start your faith journey today.",
        created_at: new Date().toISOString(),
      },
    ];
  }, [isAuthenticated, language]);

  const unreadCount = notifications.length;

  const initials = useMemo(() => {
    const c = user?.first_name?.[0] || user?.last_name?.[0] || user?.username?.[0] || "U";
    return String(c).toUpperCase();
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      closeAllDropdowns();
      setIsOpen(false);
      navigate("/", { replace: true });
    }
  };

  // Observe available width (desktop)
  useEffect(() => {
    if (!desktopWrapRef.current) return;

    const el = desktopWrapRef.current;
    const ro = new ResizeObserver(() => {
      const w = Math.floor(el.getBoundingClientRect().width || 0);
      setContainerWidth(w);
    });

    ro.observe(el);
    setContainerWidth(Math.floor(el.getBoundingClientRect().width || 0));

    return () => ro.disconnect();
  }, []);

  // Measure widths (offscreen)
  useLayoutEffect(() => {
    const nextItemWidths = {};
    for (const item of desktopOrder) {
      const node = measureItemRefs.current[item.id];
      if (node) nextItemWidths[item.id] = Math.ceil(node.getBoundingClientRect().width);
    }

    const nextMoreWidth = measureMoreRef.current
      ? Math.ceil(measureMoreRef.current.getBoundingClientRect().width)
      : 0;

    setItemWidths((prev) => {
      const prevKeys = Object.keys(prev);
      const nextKeys = Object.keys(nextItemWidths);
      const same =
        prevKeys.length === nextKeys.length && nextKeys.every((k) => prev[k] === nextItemWidths[k]);
      return same ? prev : nextItemWidths;
    });

    setMoreWidth((prev) => (prev === nextMoreWidth ? prev : nextMoreWidth));
  }, [desktopOrder, language]);

  const moreLabel = language === "sw" ? "Zaidi" : "More";

  const desktopItemById = useMemo(() => {
    const map = {};
    for (const x of desktopOrder) map[x.id] = x;
    return map;
  }, [desktopOrder]);

  // Tailwind gap-2 = 8px
  const DESKTOP_GAP_PX = 8;
  // Keep navbar clean: show at most these many items on desktop (rest -> More)
  const MAX_VISIBLE_DESKTOP = 6;

  const { visibleIds, overflowIds, showMore } = useMemo(() => {
    const ids = desktopOrder.map((x) => x.id);

    const hasAll =
      containerWidth > 0 && ids.every((id) => typeof itemWidths[id] === "number" && itemWidths[id] > 0);

    // Fallback: show few then More (prevents weird states before measuring)
    if (!hasAll) {
      const fallbackVisible = ids.slice(0, Math.min(ids.length, MAX_VISIBLE_DESKTOP));
      const fallbackOverflow = ids.slice(fallbackVisible.length);
      return {
        visibleIds: fallbackVisible,
        overflowIds: fallbackOverflow,
        showMore: fallbackOverflow.length > 0,
      };
    }

    const fitsAllWithoutMore = () => {
      let used = 0;
      for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        const w = itemWidths[id] || 0;
        const gap = i === 0 ? 0 : DESKTOP_GAP_PX;
        if (used + gap + w <= containerWidth) used += gap + w;
        else return false;
      }
      return true;
    };

    // Even if all fits, still keep "link chache"
    if (fitsAllWithoutMore()) {
      const vis = ids.slice(0, Math.min(ids.length, MAX_VISIBLE_DESKTOP));
      const ov = ids.slice(vis.length);
      return { visibleIds: vis, overflowIds: ov, showMore: ov.length > 0 };
    }

    // Need More: reserve space for More + one gap before it
    const spaceForMore = (moreWidth || 0) + DESKTOP_GAP_PX;
    const available = Math.max(0, containerWidth - spaceForMore);

    let used = 0;
    const vis = [];
    const ov = [];

    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      const w = itemWidths[id] || 0;
      const gap = vis.length === 0 ? 0 : DESKTOP_GAP_PX;

      if (used + gap + w <= available) {
        vis.push(id);
        used += gap + w;
      } else {
        ov.push(id);
      }
    }

    // Ensure Home stays visible
    if (!vis.includes("home")) {
      const homeIdx = ov.indexOf("home");
      if (homeIdx >= 0) ov.splice(homeIdx, 1);
      vis.unshift("home");
    }

    // Enforce cap
    if (vis.length > MAX_VISIBLE_DESKTOP) {
      const extra = vis.splice(MAX_VISIBLE_DESKTOP);
      ov.unshift(...extra);
    }

    return { visibleIds: vis, overflowIds: ov, showMore: true };
  }, [containerWidth, desktopOrder, itemWidths, moreWidth]);

  const isMoreActive = useMemo(() => {
    return overflowIds.some((id) => {
      const item = desktopItemById[id];
      return item && isActive(item.href);
    });
  }, [overflowIds, desktopItemById, location.pathname]);

  // Base pill
  const pillBase =
    "inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[12px] font-medium transition-all border border-transparent";

  // Solid dropdown panel (NOT transparent)
  const dropdownPanel = `rounded-2xl border shadow-xl ${
    isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
  }`;

  // Rounded hover items inside dropdown
  const dropItemBase =
    "mx-2 my-1 flex items-center gap-2 px-3 py-2 text-[12px] transition-colors rounded-lg";

  return (
    <nav
      ref={rootRef}
      className={`sticky top-0 z-50 border-b backdrop-blur-md transition-colors ${
        isDark ? "bg-gray-950/85 border-gray-800" : "bg-white/85 border-gray-200"
      }`}
    >
      {/* Hidden measurement row (offscreen) */}
      <div className="absolute -left-[9999px] top-0 h-0 overflow-hidden">
        <div className="flex items-center gap-2">
          {desktopOrder.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                ref={(el) => {
                  if (el) measureItemRefs.current[item.id] = el;
                }}
                type="button"
                className={`${pillBase} text-gray-700`}
              >
                <Icon size={14} />
                <span>{item.name}</span>
              </button>
            );
          })}
          <button ref={measureMoreRef} type="button" className={`${pillBase} text-gray-700`}>
            <span>{moreLabel}</span>
            <ChevronDown size={14} />
          </button>
        </div>
      </div>

      <div className="container mx-auto px-3 md:px-4">
        <div className="flex items-center justify-between h-14 md:h-16 gap-2">
          {/* Brand */}
          <Link
            to="/"
            className="flex items-center gap-3 shrink-0"
            onClick={() => {
              closeAllDropdowns();
              setIsOpen(false);
            }}
          >
            <div className="flex h-20 w-auto mb-1 items-center">
              <img src={logo} alt="God Cares 365 Logo" className="h-20 w-auto object-contain" />
            </div>

            <div className="flex flex-col leading-tight">
              <span
                className={`text-[11px] md:text-xs hidden md:block font-semibold uppercase tracking-[0.18em] ${
                  isDark ? "text-emerald-300" : "text-emerald-700"
                }`}
              >
                GOD CARES 365
              </span>
              <span
                className={`hidden sm:inline text-[10px] md:text-xs font-medium ${
                  isDark ? "text-gray-200" : "text-gray-700"
                }`}
              >
                Every Door • Every Soul • Every Day
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex min-w-0 flex-1 justify-center">
            {/* IMPORTANT: overflow-visible so dropdowns show BELOW without pushing/clipping */}
            <div ref={desktopWrapRef} className="relative w-full max-w-[920px] min-w-0 overflow-visible">
              <div className="flex items-center justify-center gap-2 min-w-0 overflow-visible">
                {visibleIds.map((id) => {
                  const item = desktopItemById[id];
                  if (!item) return null;
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  return (
                    <Link
                      key={item.id}
                      to={item.href}
                      onClick={closeAllDropdowns}
                      className={`${pillBase} ${
                        active
                          ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300 border-emerald-500/60 shadow-sm"
                          : isDark
                          ? "text-gray-300 hover:text-white hover:bg-gray-800/80"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                    >
                      <Icon size={14} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}

                {/* MORE dropdown (absolute, below, solid like Profile dropdown) */}
                {showMore && overflowIds.length > 0 && (
                  <div className="relative">
                    <button
                      type="button"
                      aria-haspopup="menu"
                      aria-expanded={moreOpen}
                      onClick={() => {
                        setMoreOpen((v) => !v);
                        setLangOpen(false);
                        setNotifOpen(false);
                        setProfileOpen(false);
                      }}
                      className={`${pillBase} ${
                        isMoreActive
                          ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300 border-emerald-500/60 shadow-sm"
                          : isDark
                          ? "text-gray-300 hover:text-white hover:bg-gray-800/80"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                    >
                      <span>{moreLabel}</span>
                      <ChevronDown size={14} className={`transition-transform ${moreOpen ? "rotate-180" : ""}`} />
                    </button>

                    {moreOpen && (
                      <div role="menu" className={`absolute left-0 top-full mt-2 z-[60] w-60 ${dropdownPanel}`}>
                        <div className={`px-4 py-2 border-b ${isDark ? "border-gray-700" : "border-gray-100"}`}>
                          <p
                            className={`text-[11px] font-semibold uppercase tracking-wide ${
                              isDark ? "text-gray-300" : "text-gray-600"
                            }`}
                          >
                            {moreLabel}
                          </p>
                        </div>

                        <div className="py-2">
                          {overflowIds.map((oid) => {
                            const oitem = desktopItemById[oid];
                            if (!oitem) return null;
                            const Icon = oitem.icon;
                            const active = isActive(oitem.href);

                            return (
                              <Link
                                key={oitem.id}
                                to={oitem.href}
                                onClick={() => {
                                  closeAllDropdowns();
                                  setMoreOpen(false);
                                }}
                                className={`${dropItemBase} ${
                                  active
                                    ? "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200"
                                    : isDark
                                    ? "text-gray-200 hover:bg-gray-800 hover:text-white"
                                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                }`}
                              >
                                <Icon size={15} />
                                <span>{oitem.name}</span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-1 md:gap-2 relative shrink-0">
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setNotifOpen((v) => !v);
                      setLangOpen(false);
                      setProfileOpen(false);
                      setMoreOpen(false);
                    }}
                    className={`relative inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors ${
                      isDark ? "hover:bg-gray-800 hover:text-gray-100" : "hover:bg-gray-100 hover:text-gray-800"
                    }`}
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
                    <div className={`absolute right-0 mt-2 w-80 z-[60] ${dropdownPanel}`}>
                      <div
                        className={`flex items-center justify-between px-4 py-2 border-b ${
                          isDark ? "border-gray-700" : "border-gray-100"
                        }`}
                      >
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          {language === "sw" ? "Taarifa za hivi karibuni" : "Recent notifications"}
                        </p>
                      </div>

                      <div className="max-h-72 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <p className="px-4 py-3 text-[12px] text-gray-500 dark:text-gray-300">
                            {language === "sw" ? "Hakuna taarifa kwa sasa." : "No notifications yet."}
                          </p>
                        ) : (
                          notifications.map((item) => (
                            <div
                              key={item.id}
                              className={`px-4 py-3 text-[12px] border-b last:border-b-0 ${
                                isDark ? "border-gray-700" : "border-gray-100"
                              }`}
                            >
                              <div className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>{item.title}</div>
                              {item.description && (
                                <div className="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">{item.description}</div>
                              )}
                              {item.created_at && (
                                <div className="mt-1 text-[10px] text-gray-400">
                                  {new Date(item.created_at).toLocaleString()}
                                </div>
                              )}
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
                          {language === "sw" ? "Angalia zote" : "View all"}
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile (SOLID, not transparent) */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setProfileOpen((v) => !v);
                      setLangOpen(false);
                      setNotifOpen(false);
                      setMoreOpen(false);
                    }}
                    className={`flex items-center gap-2 rounded-full px-2 py-1 pl-1 pr-2 transition-colors ${
                      isDark ? "hover:bg-gray-800" : "hover:bg-gray-100 border border-transparent hover:border-gray-200"
                    }`}
                    aria-label="Account menu"
                    aria-expanded={profileOpen}
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 text-[11px] font-bold text-white shadow-sm">
                      {initials}
                    </div>
                    <div className="hidden md:flex flex-col leading-tight">
                      <span className={`text-[11px] font-semibold ${isDark ? "text-gray-100" : "text-gray-800"}`}>
                        {user?.first_name || user?.username || (language === "sw" ? "Akaunti" : "Account")}
                      </span>
                      <span className="text-[10px] text-gray-500 dark:text-gray-400">
                        {language === "sw" ? "Safari ya God Cares 365" : "Your God Cares 365 journey"}
                      </span>
                    </div>
                  </button>

                  {profileOpen && (
                    <div className={`absolute right-0 mt-2 w-56 z-[60] ${dropdownPanel}`}>
                      <div className={`px-4 py-3 border-b ${isDark ? "border-gray-700" : "border-gray-100"}`}>
                        <p className={`text-[11px] font-semibold ${isDark ? "text-gray-100" : "text-gray-800"}`}>
                          {user?.first_name || user?.username || (language === "sw" ? "Akaunti" : "Account")}
                        </p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400">{user?.email || ""}</p>
                      </div>

                      <div className="py-2">
                        <Link
                          to="/profile"
                          className={`${dropItemBase} ${
                            isDark
                              ? "text-gray-200 hover:bg-gray-800 hover:text-white"
                              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                          }`}
                          onClick={closeAllDropdowns}
                        >
                          <UserIcon size={14} />
                          {language === "sw" ? "Profaili Yangu" : "My Profile"}
                        </Link>

                        {/* Last button: radius ndogo (rounded-md) */}
                        <button
                          onClick={handleLogout}
                          className={`mx-2 my-1 w-[calc(100%-16px)] text-left px-3 py-2 text-[12px] transition-colors rounded-md ${
                            isDark ? "text-red-300 hover:bg-gray-800" : "text-red-600 hover:bg-gray-100"
                          }`}
                        >
                          {language === "sw" ? "Toka (Logout)" : "Logout"}
                        </button>
                      </div>
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
                  {t("login") || (language === "sw" ? "Ingia" : "Login")}
                </Link>

                <Link
                  to="/register"
                  className="inline-flex items-center rounded-full bg-gradient-to-r from-emerald-500 to-blue-600 px-3.5 py-1.5 text-[12px] font-semibold text-white shadow-sm shadow-emerald-500/40 hover:brightness-110"
                  onClick={closeAllDropdowns}
                >
                  {t("register") || (language === "sw" ? "Jisajili" : "Register")}
                </Link>
              </div>
            )}

            {/* Language */}
            <div className="relative">
              <button
                onClick={() => {
                  setLangOpen((v) => !v);
                  setNotifOpen(false);
                  setProfileOpen(false);
                  setMoreOpen(false);
                }}
                className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors ${
                  isDark ? "hover:bg-gray-800 hover:text-gray-100" : "hover:bg-gray-100 hover:text-gray-800"
                }`}
                aria-label="Language"
                aria-expanded={langOpen}
              >
                <Globe size={18} />
              </button>

              {langOpen && (
                <div className={`absolute right-0 mt-2 w-32 z-[60] ${dropdownPanel}`}>
                  <div className="py-2">
                    <button
                      onClick={() => {
                        changeLanguage("sw");
                        setLangOpen(false);
                      }}
                      className={`${dropItemBase} ${
                        language === "sw"
                          ? "font-semibold text-emerald-600 dark:text-emerald-300"
                          : isDark
                          ? "text-gray-200 hover:bg-gray-800 hover:text-white"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      Kiswahili
                    </button>

                    <button
                      onClick={() => {
                        changeLanguage("en");
                        setLangOpen(false);
                      }}
                      className={`${dropItemBase} ${
                        language === "en"
                          ? "font-semibold text-emerald-600 dark:text-emerald-300"
                          : isDark
                          ? "text-gray-200 hover:bg-gray-800 hover:text-white"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      English
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Theme */}
            <button
              onClick={() => {
                toggleTheme();
                closeAllDropdowns();
              }}
              className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors ${
                isDark ? "hover:bg-gray-800 hover:text-yellow-300" : "hover:bg-gray-100 hover:text-gray-800"
              }`}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Mobile menu */}
            <button
              onClick={() => {
                setIsOpen((v) => !v);
                closeAllDropdowns();
              }}
              className={`lg:hidden inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors ${
                isDark ? "hover:bg-gray-800 hover:text-gray-100" : "hover:bg-gray-100 hover:text-gray-800"
              }`}
              aria-label="Menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile panel: TOP login/register (guest) OR account card (logged) + ALL links visible */}
        {isOpen && (
          <div className={`lg:hidden border-t ${isDark ? "border-gray-800" : "border-gray-200"}`}>
            <div className="py-3 space-y-2">
              {/* TOP AREA */}
              {isAuthenticated ? (
                <div className="px-3">
                  <div
                    className={`rounded-2xl border p-3 ${
                      isDark ? "border-gray-800 bg-gray-900/60" : "border-gray-200 bg-white/60"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 text-[12px] font-bold text-white">
                        {initials}
                      </div>
                      <div className="leading-tight">
                        <div className={`text-[12px] font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                          {user?.first_name || user?.username || (language === "sw" ? "Akaunti" : "Account")}
                        </div>
                        <div className="text-[10px] text-gray-500 dark:text-gray-400">{user?.email || ""}</div>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <Link
                        to="/profile"
                        onClick={() => setIsOpen(false)}
                        className={`rounded-xl px-3 py-2 text-center text-[11px] font-semibold ${
                          isDark ? "bg-gray-800 text-gray-100" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {language === "sw" ? "Profaili" : "Profile"}
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="rounded-xl px-3 py-2 text-center text-[11px] font-semibold bg-red-600/10 text-red-600 dark:text-red-300 hover:bg-red-600/20 transition-colors"
                      >
                        {language === "sw" ? "Toka" : "Logout"}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="px-3 flex gap-2">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-emerald-500 px-3 py-2 text-[11px] font-semibold text-emerald-600 hover:bg-emerald-50 dark:border-emerald-400 dark:text-emerald-300 dark:hover:bg-gray-900"
                  >
                    <UserIcon size={14} />
                    <span>{t("login") || (language === "sw" ? "Ingia" : "Login")}</span>
                  </Link>

                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-600 px-3 py-2 text-[11px] font-semibold text-white shadow-sm shadow-emerald-500/40 hover:brightness-110"
                  >
                    <span>{t("register") || (language === "sw" ? "Jisajili" : "Register")}</span>
                  </Link>
                </div>
              )}

              {/* ALL LINKS */}
              <div className="px-3">
                <div
                  className={`rounded-2xl border p-2 ${
                    isDark ? "border-gray-800 bg-gray-900/50" : "border-gray-200 bg-white/60"
                  }`}
                >
                  {desktopOrder.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);

                    return (
                      <Link
                        key={item.id}
                        to={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-2 rounded-xl px-3 py-2 text-[12px] font-semibold transition-colors ${
                          active
                            ? "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200"
                            : isDark
                            ? "text-gray-200 hover:bg-gray-800/70 hover:text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <Icon size={16} />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>

                <div className="pt-2 text-center text-[10px] text-gray-500 dark:text-gray-400">
                  {language === "sw" ? "God Cares 365 • Safari ya Imani" : "God Cares 365 • Faith Journey"}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
