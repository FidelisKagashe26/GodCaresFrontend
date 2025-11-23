import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import ErrorBoundary from './components/ErrorBoundary';
import PageLoader from './components/PageLoader';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import NotFound from './components/NotFound';
import Home from './pages/Home';
import About from './pages/About';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import BibleStudies from './pages/BibleStudies';
import LessonDetail from './pages/LessonDetail';
import MediaLibrary from './pages/MediaLibrary';
import Shop from './pages/Shop';
import Events from './pages/Events';
import PrayerRequests from './pages/PrayerRequests';
import Donations from './pages/Donations';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <BrowserRouter>
            <PageLoader>
              <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
                <Navbar />
                <main className="min-h-screen">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/kuhusu-sisi" element={<About />} />
                    <Route path="/habari" element={<News />} />
                    <Route path="/habari/:slug" element={<NewsDetail />} />
                    <Route path="/mafunzo" element={<BibleStudies />} />
                    <Route path="/mafunzo/:slug" element={<LessonDetail />} />
                    <Route path="/media" element={<MediaLibrary />} />
                    <Route path="/duka" element={<Shop />} />
                    <Route path="/matukio" element={<Events />} />
                    <Route path="/maombi" element={<PrayerRequests />} />
                    <Route path="/michango" element={<Donations />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </PageLoader>
          </BrowserRouter>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;