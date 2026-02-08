
import { Helmet } from 'react-helmet-async';

type SeoProps = {
  title: string;
  description: string;
  keywords?: string;
  author?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogType?: string;
  ogImage?: string;
  twitterCard?: string;
  twitterSite?: string;
  twitterImage?: string;
  canonical?: string;
  structuredData?: object;
};

export const Seo = ({
  title,
  description,
  keywords,
  author,
  ogTitle,
  ogDescription,
  ogType,
  ogImage,
  twitterCard,
  twitterSite,
  twitterImage,
  canonical,
  structuredData,
}: SeoProps) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {author && <meta name="author" content={author} />}

      {ogTitle && <meta property="og:title" content={ogTitle} />}
      {ogDescription && <meta property="og:description" content={ogDescription} />}
      {ogType && <meta property="og:type" content={ogType} />}
      {ogImage && <meta property="og:image" content={ogImage} />}

      {twitterCard && <meta name="twitter:card" content={twitterCard} />}
      {twitterSite && <meta name="twitter:site" content={twitterSite} />}
      {twitterImage && <meta name="twitter:image" content={twitterImage} />}

      {canonical && <link rel="canonical" href={canonical} />}

      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};
