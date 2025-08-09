import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

const SEOFAQSection = () => {
  const [openFAQ, setOpenFAQ] = useState(null)

  const faqs = [
    {
      question: "What is GitHub README AI and how does it work?",
      answer: "GitHub README AI is an advanced artificial intelligence tool that automatically creates professional GitHub profile READMEs. Our GitHub README AI analyzes your skills, projects, and experience to generate stunning, customizable README profiles that showcase your abilities to potential employers and collaborators."
    },
    {
      question: "Why is AutoMaxLib the best GitHub README AI generator?",
      answer: "AutoMaxLib's GitHub README AI stands out as the best README AI generator because it combines advanced natural language processing with deep understanding of GitHub best practices. Our README AI creates professional, engaging content with proper formatting and industry-standard sections that make your profile stand out."
    },
    {
      question: "How does the auto commit AI work with GitHub README AI?",
      answer: "Our platform combines GitHub README AI with auto commit AI to provide a complete GitHub profile enhancement solution. While the README AI creates your professional profile, the auto commit AI maintains your contribution streak with meaningful commits, creating a comprehensive developer presence."
    },
    {
      question: "What makes AutoMaxLib's GitHub contribution tools different?",
      answer: "AutoMaxLib's GitHub contribution tools combine AI-powered automation with intelligent scheduling. Unlike basic tools, our platform understands your coding habits, generates meaningful commits, and maintains authentic contribution patterns that reflect genuine development activity."
    },
    {
      question: "Can the repository README generator work with any programming language?",
      answer: "Yes, our repository README generator AI supports all major programming languages including JavaScript, Python, Java, C++, React, Node.js, and more. The AI analyzes your repository structure and generates appropriate documentation regardless of the technology stack."
    },
    {
      question: "Is the profile generation AI suitable for beginners?",
      answer: "Absolutely! Our profile generation AI is designed for developers at all levels. Whether you're a beginner looking to create your first GitHub profile or an experienced developer wanting to enhance your presence, the AI adapts to your experience level and creates appropriate content."
    },
    {
      question: "How does the auto contribution feature maintain GitHub streaks?",
      answer: "The auto contribution feature uses smart scheduling to make commits at optimal times, ensuring your GitHub streak remains unbroken. It generates meaningful commits based on your project context, maintaining authenticity while automating the process of consistent contributions."
    }
  ]

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }

  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions About GitHub README AI
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Learn more about our GitHub README AI, auto commit AI, and advanced README generation tools
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {faq.question}
                </h3>
                {openFAQ === index ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>
              {openFAQ === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default SEOFAQSection
