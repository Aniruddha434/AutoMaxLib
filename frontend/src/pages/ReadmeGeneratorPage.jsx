import ReadmeGenerator from '../components/ReadmeGenerator'
import SEOHead from '../components/SEOHead'
import { seoData } from '../utils/seoData'
import { useScrollToTop } from '../hooks/useScrollToTop'

const ReadmeGeneratorPage = () => {
  // Scroll to top when component mounts
  useScrollToTop({ onMount: true, delay: 100 })
  return (
    <>
      <SEOHead
        title={seoData.readmeGenerator.title}
        description={seoData.readmeGenerator.description}
        keywords={seoData.readmeGenerator.keywords}
        canonicalUrl="/readme-generator"
        structuredData={seoData.readmeGenerator.structuredData}
      />
      <div className="section">
        <div className="container-custom">
          <ReadmeGenerator />
        </div>
      </div>
    </>
  )
}

export default ReadmeGeneratorPage
