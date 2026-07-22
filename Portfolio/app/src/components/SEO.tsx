import { Helmet } from 'react-helmet-async';

export interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogType?: 'website' | 'article' | 'profile';
  ogImage?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  jsonLd?: Record<string, any> | Array<Record<string, any>>;
}

const DEFAULT_TITLE = 'Seth N. AKPLOGAN — AI & Data Science';
const DEFAULT_DESCRIPTION =
  'Portfolio of Seth N. AKPLOGAN, AI & Data Science student at IFRI, Benin. Building reliable and intelligent software.';
const DEFAULT_SITE_URL = 'https://seth-akplogan.onrender.com';
const DEFAULT_OG_IMAGE = 'https://seth-akplogan.onrender.com/images/og-cover.jpg';

export default function SEO({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  canonical,
  ogType = 'website',
  ogImage = DEFAULT_OG_IMAGE,
  twitterCard = 'summary_large_image',
  jsonLd,
}: SEOProps) {
  const fullTitle = title === DEFAULT_TITLE ? title : `${title} | Seth N. AKPLOGAN`;
  const currentUrl = canonical || (typeof window !== 'undefined' ? window.location.href : DEFAULT_SITE_URL);

  return (
    <Helmet>
      {/* Basic Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={currentUrl} />
      <link rel="alternate" type="text/plain" href="/llms.txt" title="LLMs.txt Summary" />
      <link rel="alternate" type="text/plain" href="/llms-full.txt" title="LLMs Full Dataset" />

      {/* Open Graph Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Seth N. AKPLOGAN Portfolio" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Schema.org Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
}
