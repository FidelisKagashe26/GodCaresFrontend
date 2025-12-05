import { useEffect } from 'react';
import { updatePageMeta, generateStructuredData } from '../utils/seo';

export default function SEOHead({
  title,
  description,
  keywords = '',
  image = '',
  type = 'website',
  structuredData = null,
}) {
  useEffect(() => {
    updatePageMeta(title, description, keywords, image);

    if (structuredData) {
      generateStructuredData(type, structuredData);
    }
  }, [title, description, keywords, image, type, structuredData]);

  return null;
}
