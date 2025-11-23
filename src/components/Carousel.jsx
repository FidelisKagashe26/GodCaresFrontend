import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Carousel({ slides, interval = 5000 }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setCurrent((prev) => (prev + 1) % slides.length),
      interval
    );
    return () => clearInterval(timer);
  }, [slides.length, interval]);

  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  const nextSlide = () =>
    setCurrent((prev) => (prev + 1) % slides.length);

  return (
    <section className="relative w-full h-[70vh] overflow-hidden">
      {slides.map((slide, idx) => {
        const isActive = idx === current;
        const horizontalPosition =
          slide.align === 'right'
            ? 'right-12 text-right'
            : 'left-12 text-left';

        return (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover object-center"
            />

            <div className="absolute inset-0 bg-black bg-opacity-50" />

            <div
              className={`
                absolute top-1/2 transform -translate-y-1/2
                ${horizontalPosition} max-w-lg px-4
              `}
            >
              {slide.badge && (
                <span className="inline-block bg-gray-800 bg-opacity-70 text-xs uppercase tracking-wider px-3 py-3 text-white mb-4">
                  {slide.badge}
                </span>
              )}
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4">
                {slide.title}
              </h2>
              {slide.subtitle && (
                <p className="text-md md:text-lg text-gray-200 mb-6">
                  {slide.subtitle}
                </p>
              )}
              {slide.cta && (
                <Link
                  to={slide.cta.link}
                  className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition"
                >
                  {slide.cta.label}
                </Link>
              )}
            </div>
          </div>
        );
      })}

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 p-2 rounded-full text-white hover:bg-opacity-60 transition"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-40 p-2 rounded-full text-white hover:bg-opacity-60 transition"
      >
        <ChevronRight size={24} />
      </button>

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-10 h-1 rounded-full transition-all ${
              idx === current
                ? 'bg-yellow-500 w-12'
                : 'bg-white bg-opacity-50'
            }`}
          />
        ))}
      </div>
    </section>
  );
}