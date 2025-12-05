// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';

import ErrorBoundary from './components/ErrorBoundary';
import PageLoader from './components/PageLoader';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import NotFound from './components/NotFound';

import RequireAuth from './pages/User/Components/RequireAuth';

// Public pages
import Home from './pages/home/Home';
import About from './pages/About';

import News from './pages/news/News';
import NewsDetail from './pages/news/NewsDetail';

import BibleStudies from './pages/lessons/BibleStudies';
import LessonDetail from './pages/lessons/LessonDetail';

import MediaLibrary from './pages/media/MediaLibrary';
import MediaDetail from './pages/media/MediaDetail';

import Shop from './pages/shop/Shop';

import Events from './pages/events/Events';
import EventDetail from './pages/events/EventDetail';

import PrayerRequests from './pages/prayer/PrayerRequests';
import Donations from './pages/Donations';

// Auth / Account
import Login from './pages/User/Login';
import Register from './pages/auth/Register';
import Profile from './pages/account/Profile';
import ChangePassword from './pages/User/ChangePassword';
import Notifications from './pages/account/Notifications';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <BrowserRouter>
              <PageLoader>
                <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-emerald-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 text-gray-900 dark:text-white transition-colors">
                  <Navbar />

                  <main className="min-h-[calc(100vh-160px)]">
                    <Routes>
                      {/* Public routes */}
                      <Route path="/" element={<Home />} />
                      <Route path="/kuhusu-sisi" element={<About />} />

                      <Route path="/habari" element={<News />} />
                      <Route path="/habari/:slug" element={<NewsDetail />} />

                      <Route path="/mafunzo" element={<BibleStudies />} />
                      <Route
                        path="/mafunzo/:slug"
                        element={<LessonDetail />}
                      />

                      <Route path="/media" element={<MediaLibrary />} />
                      <Route path="/media/:id" element={<MediaDetail />} />

                      <Route path="/duka" element={<Shop />} />

                      <Route path="/matukio" element={<Events />} />
                      <Route
                        path="/matukio/:slug"
                        element={<EventDetail />}
                      />

                      <Route path="/maombi" element={<PrayerRequests />} />
                      <Route path="/michango" element={<Donations />} />

                      {/* Auth routes */}
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />

                      {/* Protected routes */}
                      <Route
                        path="/profile"
                        element={
                          <RequireAuth>
                            <Profile />
                          </RequireAuth>
                        }
                      />
                      <Route
                        path="/profile/password"
                        element={
                          <RequireAuth>
                            <ChangePassword />
                          </RequireAuth>
                        }
                      />
                      <Route
                        path="/notifications"
                        element={
                          <RequireAuth>
                            <Notifications />
                          </RequireAuth>
                        }
                      />

                      {/* 404 */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>

                  <Footer />
                </div>
              </PageLoader>
            </BrowserRouter>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
