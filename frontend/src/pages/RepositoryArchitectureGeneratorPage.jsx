import RepositoryArchitectureGenerator from '../components/RepositoryArchitectureGenerator'
import SEOHead from '../components/SEOHead'
import { seoData } from '../utils/seoData'

const RepositoryArchitectureGeneratorPage = () => {
  return (
    <>
      <SEOHead
        title={seoData.repositoryArchitectureGenerator?.title || 'Repository Architecture Diagram Generator'}
        description={seoData.repositoryArchitectureGenerator?.description || 'Generate a system architecture diagram (Mermaid) for your repository using AI.'}
        keywords={seoData.repositoryArchitectureGenerator?.keywords || 'architecture diagram AI, mermaid generator, system architecture'}
        canonicalUrl="/repository-architecture-generator"
        structuredData={seoData.repositoryArchitectureGenerator?.structuredData}
      />
      <div className="section">
        <div className="container-custom">
          <RepositoryArchitectureGenerator />
        </div>
      </div>
    </>
  )
}

export default RepositoryArchitectureGeneratorPage

