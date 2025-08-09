import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';

export const CircularTestimonials = ({
  testimonials = [],
  autoplay = false,
  autoplayInterval = 5000,
  hideDots = false,
  colors = {
    name: "#0a0a0a",
    designation: "#454545",
    testimony: "#171717",
    arrowBackground: "#141414",
    arrowForeground: "#f1f1f7",
    arrowHoverBackground: "#00A6FB",
  },
  fontSizes = {
    name: "28px",
    designation: "20px",
    quote: "20px",
  },
  className,
  ...props
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const autoplayRef = useRef(null);

  // Auto-advance testimonials
  useEffect(() => {
    if (autoplay && testimonials.length > 1) {
      autoplayRef.current = setInterval(() => {
        nextTestimonial();
      }, autoplayInterval);

      return () => {
        if (autoplayRef.current) {
          clearInterval(autoplayRef.current);
        }
      };
    }
  }, [autoplay, autoplayInterval, testimonials.length]);

  // Clear autoplay on manual navigation
  const clearAutoplay = () => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  };

  const nextTestimonial = () => {
    if (isAnimating || testimonials.length <= 1) return;
    
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    
    setTimeout(() => setIsAnimating(false), 300);
  };

  const prevTestimonial = () => {
    if (isAnimating || testimonials.length <= 1) return;
    
    clearAutoplay();
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleNext = () => {
    clearAutoplay();
    nextTestimonial();
  };

  const handlePrev = () => {
    clearAutoplay();
    prevTestimonial();
  };

  if (!testimonials.length) {
    return null;
  }

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div 
      className={cn("relative w-full max-w-4xl mx-auto", className)}
      {...props}
    >
      {/* Main testimonial display */}
      <div className="relative min-h-[400px] flex items-center justify-center">
        {/* Background circle decoration */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-80 h-80 rounded-full border border-gray-200 dark:border-gray-700 opacity-20" />
          <div className="absolute w-96 h-96 rounded-full border border-gray-200 dark:border-gray-700 opacity-10" />
        </div>

        {/* Testimonial content */}
        <div 
          className={cn(
            "relative z-10 text-center max-w-2xl px-8 transition-all duration-300",
            isAnimating ? "opacity-0 transform scale-95" : "opacity-100 transform scale-100"
          )}
        >
          {/* Profile image */}
          {currentTestimonial.src && (
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <img
                  src={currentTestimonial.src}
                  alt={currentTestimonial.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent to-white/20" />
              </div>
            </div>
          )}

          {/* Quote */}
          <blockquote 
            className="mb-8 leading-relaxed"
            style={{ 
              color: colors.testimony,
              fontSize: fontSizes.quote,
              lineHeight: '1.6'
            }}
          >
            "{currentTestimonial.quote}"
          </blockquote>

          {/* Author info */}
          <div className="space-y-2">
            <h4 
              className="font-semibold"
              style={{ 
                color: colors.name,
                fontSize: fontSizes.name
              }}
            >
              {currentTestimonial.name}
            </h4>
            <p 
              className="opacity-80"
              style={{ 
                color: colors.designation,
                fontSize: fontSizes.designation
              }}
            >
              {currentTestimonial.designation}
            </p>
          </div>
        </div>

        {/* Navigation arrows */}
        {testimonials.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 z-20 text-black dark:text-white"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 z-20 text-black dark:text-white"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>


    </div>
  );
};

export default CircularTestimonials;
