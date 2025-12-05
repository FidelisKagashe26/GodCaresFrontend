import { useTheme } from '../contexts/ThemeContext';

export default function Quote({
  quoteText = `"Hili ndilo pendo, si kwamba sisi tulimpenda Mungu, bali kwamba yeye alitupenda sisi, akamtuma Mwanawe kuwa kipatanisho kwa dhambi zetu"`,
  citeText = '– 1 Yohana 4:10',
  className = '',
}) {
  useTheme(); 

  return (
    <section
      className={`py-16 bg-gradient-to-r from-emerald-600 to-blue-600 text-white ${className}`}
    >
      <div className="container mx-auto px-6 text-center">
        <blockquote className="text-2xl md:text-3xl font-bold mb-4 max-w-4xl mx-auto leading-relaxed">
          {quoteText}
        </blockquote>
        <cite className="text-xl font-medium opacity-90">{citeText}</cite>
      </div>
    </section>
  );
}
