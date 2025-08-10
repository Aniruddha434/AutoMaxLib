import ReadmeGenerator from '../components/ReadmeGenerator'
import SEOHead from '../components/SEOHead'

const GitHubReadmeAI = () => {
  return (
    <>
      <SEOHead 
        title="GitHub README AI - Best AI README Generator for GitHub Profiles"
        description="The ultimate GitHub README AI tool for creating professional GitHub profile READMEs. Our advanced README AI generates stunning, customizable profiles that showcase your skills and attract employers."
        keywords="GitHub README AI, README AI generator, GitHub README generator AI, AI README creator, GitHub profile README AI, GitHub README maker AI, developer profile generator, README template AI"
        canonicalUrl="/github-readme-ai"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "GitHub README AI Generator",
          "description": "Advanced GitHub README AI tool for generating professional GitHub profile READMEs",
          "url": "https://automaxlib.online/github-readme-ai",
          "applicationCategory": "DeveloperApplication",
          "operatingSystem": "Web",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock"
          },
          "featureList": [
            "GitHub README AI generation",
            "AI-powered README creation",
            "Customizable README templates", 
            "Professional GitHub formatting",
            "Skills showcase with AI",
            "Social links integration",
            "GitHub profile integration",
            "Real-time README preview"
          ],
          "provider": {
            "@type": "Organization",
            "name": "AutoMaxLib"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "ratingCount": "200"
          }
        }}
      />
      <div className="section">
        <div className="container-custom">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              GitHub README AI - The Best AI README Generator
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Create professional GitHub profile READMEs with our advanced GitHub README AI. 
              The most powerful README AI generator for developers who want to stand out.
            </p>
          </div>
          <ReadmeGenerator />
        </div>
      </div>
    </>
  )
}

export default GitHubReadmeAI
