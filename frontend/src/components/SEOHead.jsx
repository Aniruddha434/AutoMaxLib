import { Helmet } from 'react-helmet-async'
import { organizationSchema, websiteSchema, softwareApplicationSchema } from '../utils/schemaMarkup'

const SEOHead = ({ 
  title, 
  description, 
  keywords, 
  canonicalUrl, 
  ogImage = '/og-image.svg',
  ogType = 'website',
  structuredData,
  noIndex = false 
}) => {
  const baseUrl = 'https://automaxlib.online'
  const fullUrl = canonicalUrl ? `${baseUrl}${canonicalUrl}` : baseUrl
  const fullTitle = title ? `${title} | AutoMaxLib` : 'AutoMaxLib - AI-Powered GitHub Tools & Auto Commit Generator'

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={fullUrl} />
      
      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${baseUrl}${ogImage}`} />
      <meta property="og:image:alt" content="AutoMaxLib - AI-Powered GitHub Tools & Auto Commit Generator" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="AutoMaxLib" />

      {/* Site Name and Branding */}
      <meta name="application-name" content="AutoMaxLib" />
      <meta name="apple-mobile-web-app-title" content="AutoMaxLib" />
      <meta name="msapplication-tooltip" content="AutoMaxLib - AI-Powered GitHub Tools" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${baseUrl}${ogImage}`} />
      
      {/* Additional SEO Meta Tags */}
      <meta name="author" content="AutoMaxLib" />
      <meta name="language" content="en" />
      <meta name="revisit-after" content="7 days" />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}

      {/* Global Schema Markup */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(softwareApplicationSchema)}
      </script>
    </Helmet>
  )
}

export default SEOHead
