import React, { useEffect } from 'react';
import { useI18n } from '../../i18n';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  noIndex?: boolean;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  image = 'https://taskroulette.app/og-image.png',
  url = 'https://taskroulette.app/',
  type = 'website',
  noIndex = false
}) => {
  const { t } = useI18n();
  
  const defaultTitle = t('seo.title');
  const defaultDescription = t('seo.description');
  const defaultKeywords = t('seo.keywords');
  
  const finalTitle = title ? `${title} | ${defaultTitle}` : defaultTitle;
  const finalDescription = description || defaultDescription;
  const finalKeywords = keywords || defaultKeywords;

  useEffect(() => {
    // Update document title
    document.title = finalTitle;
    
    // Update or create meta tags
    const updateMeta = (name: string, content: string, property?: boolean) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };
    
    // Primary Meta Tags
    updateMeta('title', finalTitle);
    updateMeta('description', finalDescription);
    updateMeta('keywords', finalKeywords);
    
    if (noIndex) {
      updateMeta('robots', 'noindex, nofollow');
    }
    
    // Open Graph / Facebook
    updateMeta('og:type', type, true);
    updateMeta('og:url', url, true);
    updateMeta('og:title', finalTitle, true);
    updateMeta('og:description', finalDescription, true);
    updateMeta('og:image', image, true);
    updateMeta('og:image:alt', finalTitle, true);
    
    // Twitter
    updateMeta('twitter:card', 'summary_large_image', true);
    updateMeta('twitter:url', url, true);
    updateMeta('twitter:title', finalTitle, true);
    updateMeta('twitter:description', finalDescription, true);
    updateMeta('twitter:image', image, true);
    updateMeta('twitter:image:alt', finalTitle, true);
    
    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);
    
  }, [finalTitle, finalDescription, finalKeywords, image, url, type, noIndex]);

  return null;
};

export default SEOHead;