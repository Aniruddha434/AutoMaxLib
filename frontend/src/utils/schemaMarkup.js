// Advanced Schema Markup for SEO

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "AutoMaxLib Technologies",
  "alternateName": "AutoMaxLib",
  "url": "https://automaxlib.online",
  "logo": "https://automaxlib.online/logo.svg",
  "description": "AI-powered GitHub automation tools and README generators for developers",
  "foundingDate": "2024",
  "founders": [
    {
      "@type": "Person",
      "name": "Aniruddha Gayki"
    }
  ],
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Nimbhora MIDC Road",
    "addressLocality": "Amravati",
    "addressRegion": "Maharashtra",
    "postalCode": "444603",
    "addressCountry": "IN"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+91-8624829427",
    "email": "supportautomaxlib@gmail.com",
    "contactType": "customer service",
    "availableLanguage": ["English", "Hindi"]
  },
  "sameAs": [
    "https://github.com/automaxlib",
    "https://twitter.com/automaxlib"
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "AutoMaxLib Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "SoftwareApplication",
          "name": "GitHub README AI Generator",
          "description": "AI-powered tool for generating professional GitHub README files"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "SoftwareApplication",
          "name": "Auto Commit AI",
          "description": "Intelligent GitHub contribution automation tool"
        }
      }
    ]
  }
}

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "AutoMaxLib",
  "url": "https://automaxlib.online",
  "description": "AI-Powered GitHub Tools & Auto Commit Generator",
  "publisher": {
    "@type": "Organization",
    "name": "AutoMaxLib Technologies"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://automaxlib.online/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}

export const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "AutoMaxLib",
  "description": "AI-powered GitHub automation platform with README generators, auto commit tools, and contribution analytics",
  "url": "https://automaxlib.online",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "priceValidUntil": "2025-12-31"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "ratingCount": "1000",
    "bestRating": "5",
    "worstRating": "1"
  },
  "author": {
    "@type": "Organization",
    "name": "AutoMaxLib Technologies"
  },
  "datePublished": "2024-01-15",
  "dateModified": "2025-01-19",
  "version": "2.0",
  "featureList": [
    "GitHub README AI Generation",
    "Auto Commit Automation",
    "Repository Architecture Diagrams",
    "Contribution Pattern Analysis",
    "GitHub Profile Enhancement",
    "Multi-Repository Management"
  ],
  "screenshot": "https://automaxlib.online/images/Frameweb.png",
  "softwareVersion": "2.0",
  "requirements": "Modern web browser with JavaScript enabled"
}

export const breadcrumbSchema = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": `https://automaxlib.online${item.url}`
  }))
})

export const faqSchema = (faqs) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
})

export const articleSchema = (article) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": article.title,
  "description": article.description,
  "author": {
    "@type": "Organization",
    "name": "AutoMaxLib Technologies"
  },
  "publisher": {
    "@type": "Organization",
    "name": "AutoMaxLib Technologies",
    "logo": {
      "@type": "ImageObject",
      "url": "https://automaxlib.online/logo.svg"
    }
  },
  "datePublished": article.datePublished,
  "dateModified": article.dateModified || article.datePublished,
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": `https://automaxlib.online${article.url}`
  },
  "image": article.image ? {
    "@type": "ImageObject",
    "url": `https://automaxlib.online${article.image}`,
    "width": 1200,
    "height": 630
  } : undefined
})

export const serviceSchema = (service) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "name": service.name,
  "description": service.description,
  "provider": {
    "@type": "Organization",
    "name": "AutoMaxLib Technologies"
  },
  "areaServed": "Worldwide",
  "availableChannel": {
    "@type": "ServiceChannel",
    "serviceUrl": `https://automaxlib.online${service.url}`,
    "serviceType": "Online Service"
  },
  "category": "Software Development Tools",
  "offers": {
    "@type": "Offer",
    "price": service.price || "0",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  }
})

export const reviewSchema = (reviews) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "AutoMaxLib",
  "description": "AI-powered GitHub automation platform",
  "review": reviews.map(review => ({
    "@type": "Review",
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": review.rating,
      "bestRating": "5"
    },
    "author": {
      "@type": "Person",
      "name": review.author
    },
    "reviewBody": review.content,
    "datePublished": review.date
  })),
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": reviews.length.toString()
  }
})

export const howToSchema = (steps, title, description) => ({
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": title,
  "description": description,
  "step": steps.map((step, index) => ({
    "@type": "HowToStep",
    "position": index + 1,
    "name": step.name,
    "text": step.description,
    "image": step.image ? `https://automaxlib.online${step.image}` : undefined
  })),
  "totalTime": "PT5M",
  "estimatedCost": {
    "@type": "MonetaryAmount",
    "currency": "USD",
    "value": "0"
  },
  "tool": [
    {
      "@type": "HowToTool",
      "name": "Web Browser"
    },
    {
      "@type": "HowToTool",
      "name": "GitHub Account"
    }
  ]
})

// Helper function to inject schema markup
export const injectSchemaMarkup = (schema) => {
  if (typeof window !== 'undefined') {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(schema)
    document.head.appendChild(script)
    return script
  }
  return null
}

// Helper function to remove schema markup
export const removeSchemaMarkup = (script) => {
  if (script && script.parentNode) {
    script.parentNode.removeChild(script)
  }
}
