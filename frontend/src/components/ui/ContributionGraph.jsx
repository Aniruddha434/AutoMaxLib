import { useState, useEffect } from 'react'

const ContributionGraph = ({ 
  type = 'before', // 'before' or 'after'
  className = '',
  animated = true 
}) => {
  const [squares, setSquares] = useState([])

  useEffect(() => {
    // Generate contribution data
    const generateSquares = () => {
      const weeks = 53
      const daysPerWeek = 7
      const totalSquares = weeks * daysPerWeek
      const newSquares = []

      for (let i = 0; i < totalSquares; i++) {
        const random = Math.random()
        let level = 0

        if (type === 'before') {
          // Sparse pattern for "before" state
          if (random < 0.7) level = 0      // Empty
          else if (random < 0.85) level = 1 // Light
          else if (random < 0.95) level = 2 // Medium
          else level = 3                    // Dark
        } else {
          // Dense pattern for "after" state
          if (random < 0.1) level = 0       // Empty
          else if (random < 0.3) level = 1  // Light
          else if (random < 0.6) level = 2  // Medium
          else if (random < 0.85) level = 3 // Dark
          else level = 4                    // Darkest
        }

        newSquares.push({
          id: i,
          level,
          delay: animated ? Math.random() * 2 : 0
        })
      }

      return newSquares
    }

    setSquares(generateSquares())
  }, [type, animated])

  const getLevelColor = (level) => {
    const colors = {
      before: [
        'bg-neutral-100 dark:bg-neutral-800',     // Empty
        'bg-green-200 dark:bg-green-900',         // Light
        'bg-green-400 dark:bg-green-700',         // Medium
        'bg-green-600 dark:bg-green-500',         // Dark
      ],
      after: [
        'bg-neutral-100 dark:bg-neutral-800',     // Empty
        'bg-green-200 dark:bg-green-900',         // Light
        'bg-green-400 dark:bg-green-700',         // Medium
        'bg-green-600 dark:bg-green-500',         // Dark
        'bg-green-800 dark:bg-green-400',         // Darkest
      ]
    }
    return colors[type][level] || colors[type][0]
  }

  return (
    <div className={`contribution-graph ${className}`}>
      {/* Month labels */}
      <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400 mb-2 px-2">
        <span>Jan</span>
        <span>Mar</span>
        <span>May</span>
        <span>Jul</span>
        <span>Sep</span>
        <span>Nov</span>
      </div>

      {/* Graph container */}
      <div className="relative">
        {/* Day labels */}
        <div className="absolute -left-8 top-0 flex flex-col justify-between h-full text-xs text-neutral-500 dark:text-neutral-400 py-1">
          <span>Sun</span>
          <span>Tue</span>
          <span>Thu</span>
          <span>Sat</span>
        </div>

        {/* Contribution squares */}
        <div 
          className="grid grid-rows-7 grid-flow-col gap-1 w-full overflow-x-auto"
          style={{ gridTemplateColumns: 'repeat(53, minmax(0, 1fr))' }}
        >
          {squares.map((square) => (
            <div
              key={square.id}
              className={`
                w-3 h-3 rounded-sm transition-all duration-300 hover:scale-125 cursor-pointer
                ${getLevelColor(square.level)}
                ${animated ? 'animate-fade-in' : ''}
              `}
              style={{
                animationDelay: animated ? `${square.delay}s` : '0s'
              }}
              title={`${square.level} contributions`}
            />
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-3 text-xs text-neutral-500 dark:text-neutral-400">
        <span>Less</span>
        <div className="flex items-center gap-1">
          {[0, 1, 2, 3, ...(type === 'after' ? [4] : [])].map((level) => (
            <div
              key={level}
              className={`w-3 h-3 rounded-sm ${getLevelColor(level)}`}
            />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  )
}

export default ContributionGraph
