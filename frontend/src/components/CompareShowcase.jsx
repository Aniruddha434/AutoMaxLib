import { Compare } from './ui/compare'
import { useState, useEffect } from 'react'

export default function CompareShowcase({
  firstImage,
  secondImage,
  className = ''
}) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Use mobile-specific images for mobile devices
  const beforeImage = firstImage || (isMobile ? '/images/MobileBefore.png' : '/images/Before.png')
  const afterImage = secondImage || (isMobile ? '/images/MobileAfter.png' : '/images/After.png')

  return (
    <div className={`w-full ${className}`}>
      <Compare
        firstImage={beforeImage}
        secondImage={afterImage}
        firstImageClassName="object-cover object-left-top"
        secondImageClassname="object-cover object-left-top"
        className="w-full h-[400px] md:h-[460px] lg:h-[480px] rounded-xl border bg-card shadow-sm"
        slideMode="hover"
        showHandlebar={true}
        autoplay={false}
      />

      {/* Labels */}
      <div className="mt-4 grid grid-cols-2 text-xs md:text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-2 w-2 rounded-full bg-destructive" />
          Before
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          After
        </div>
      </div>
    </div>
  )
}

export function CompareSection() {
  return (
    <section className="py-16 md:py-24 bg-gray-50 dark:bg-transparent">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white mb-4">
            Transform Your Github Portfolio
          </h2>
          <p className="text-foreground max-w-3xl mx-auto">
            Hover or drag the slider to compare before and after. Fully responsive and
            seamlessly styled to match AutoMaxLib’s theme.
          </p>
        </div>
        <CompareShowcase className="" />
      </div>
    </section>
  )
}

