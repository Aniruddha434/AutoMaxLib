import RepositoryReadmeGenerator from '../components/RepositoryReadmeGenerator'
import SEOHead from '../components/SEOHead'
import { seoData } from '../utils/seoData'

const RepositoryReadmeGeneratorPage = () => {
  return (
    <>
      <SEOHead
        title={seoData.repositoryReadmeGenerator.title}
        description={seoData.repositoryReadmeGenerator.description}
        keywords={seoData.repositoryReadmeGenerator.keywords}
        canonicalUrl="/repository-readme-generator"
        structuredData={seoData.repositoryReadmeGenerator.structuredData}
      />
      <div className="section">
        <div className="container-custom">
          <RepositoryReadmeGenerator />
        </div>
      </div>
    </>
  )
}

export default RepositoryReadmeGeneratorPage
