import React from 'react'

export const Separator = ({ 
  orientation = 'horizontal', 
  className = '', 
  ...props 
}) => {
  const orientationClasses = orientation === 'vertical' 
    ? 'h-full w-px' 
    : 'h-px w-full'

  return (
    <div 
      className={`bg-gray-200 dark:bg-gray-700 ${orientationClasses} ${className}`}
      {...props}
    />
  )
}
