// src/components/Carousel.jsx
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Carousel({ slides = [], interval = 7000 }) {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const slideCount = slides.length || 0;

  const nextSlide = useCallback(() => {
    if (!slideCount) return;
    setCurrent((prev) => (prev + 1) % slideCount);
  }, [slideCount]);

  const prevSlide = () => {
    if (!slideCount) return;
    setCurrent((prev) => (prev - 1 + slideCount) % slideCount);
  };

  useEffect(() => {
    if (!slideCount || isHovered) return;

    const timer = setTimeout(nextSlide, interval);
    return () => clearTimeout(timer);
  }, [current, slideCount, interval, isHovered, nextSlide]);

  if (!slides || slideCount === 0) return null;

  const getAlignClasses = (align) => {
    if (align === 'right') return 'justify-end text-right';
    if (align === 'center') return 'justify-center text-center';
    return 'justify-start text-left';
  };

  return (
    <section
      className="relative w-full h-[60vh] md:h-[70vh] xl:h-[75vh] max-h-[680px] overflow-hidden bg-black"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slides */}
      {slides.map((slide, idx) => {
        const isActive = idx === current;
        const alignClasses = getAlignClasses(slide.align);

        return (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-700 ease-out ${
              isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            aria-hidden={!isActive}
          >
            {/* Background image with subtle zoom */}
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={slide.image}
                alt={slide.title}
                className={`w-full h-full object-cover object-center transform transition-transform duration-[3500ms] ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
              />
              {/* Gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative h-full flex items-center">
              <div className="w-full px-4 sm:px-6 md:px-10 lg:px-20 xl:px-28">
                <div
                  className={`flex ${alignClasses}`}
                >
                  <div className="max-w-xl w-full bg-black/35 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-4 sm:px-6 sm:py-5 shadow-xl shadow-black/40">
                    {slide.badge && (
                      <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-100 mb-3">
                        {slide.badge}
                      </span>
                    )}

                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-3 leading-tight">
                      {slide.title}
                    </h2>

                    {slide.subtitle && (
                      <p className="text-xs sm:text-sm md:text-base text-gray-100/90 mb-4 md:mb-5 leading-relaxed">
                        {slide.subtitle}
                      </p>
                    )}

                    {slide.cta && (
                      <div className={alignClasses.includes('center') ? 'flex justify-center' : ''}>
                        <Link
                          to={slide.cta.link}
                          className="inline-flex items-center rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 px-4 sm:px-5 py-2 sm:py-2.5 text-[11px] sm:text-sm font-semibold text-white shadow-md shadow-emerald-500/40 hover:brightness-110 transition"
                        >
                          {slide.cta.label}
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Controls */}
      {slideCount > 1 && (
        <>
          <button
            type="button"
            onClick={prevSlide}
            className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white hover:bg-black/70 hover:border-white/40 transition focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-black"
            aria-label="Slide previous"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white hover:bg-black/70 hover:border-white/40 transition focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-black"
            aria-label="Slide next"
          >
            <ChevronRight size={18} />
          </button>
        </>
      )}

      {/* Dots */}
      {slideCount > 1 && (
        <div className="absolute bottom-4 sm:bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {slides.map((_, idx) => {
            const isActive = idx === current;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrent(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  isActive
                    ? 'w-6 bg-emerald-400'
                    : 'w-2.5 bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Nenda slide ${idx + 1}`}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
