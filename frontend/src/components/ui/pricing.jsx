import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './Card'
import { Button } from './Button'
import { Badge } from './badge'
import { Check, ArrowRight } from 'lucide-react'
import { cn } from '@/utils'

export const PricingCard = ({
  title,
  price,
  description,
  features = [],
  buttonText = "Get Started",
  buttonVariant = "default",
  highlight = false,
  popular = false,
  className,
  ...props
}) => {
  const { isSignedIn } = useAuth()

  return (
    <Card
      className={cn(
        "relative flex flex-col h-full transition-all duration-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700",
        highlight && "ring-2 ring-indigo-500 shadow-lg scale-[1.02] border-indigo-200 dark:border-indigo-700",
        popular && "ring-2 ring-indigo-500 shadow-lg border-indigo-200 dark:border-indigo-700",
        "hover:shadow-md hover:scale-[1.01] hover:border-slate-300 dark:hover:border-slate-600",
        className
      )}
      {...props}
    >
      {(highlight || popular) && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
          <Badge className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1 text-xs font-medium shadow-sm">
            ⭐ Most Popular
          </Badge>
        </div>
      )}

      <CardHeader className="text-center pb-4">
        <CardTitle className="text-lg font-semibold mb-2 text-slate-800 dark:text-slate-200">{title}</CardTitle>
        <div className="mb-3">
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
            {price}
          </div>
          {description && (
            <CardDescription className="text-xs text-slate-600 dark:text-slate-400">
              {description}
            </CardDescription>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1">
          <ul className="space-y-2 mb-6">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                <span className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto">
          <Link
            to={isSignedIn ? "/dashboard" : "/sign-up"}
            className="w-full block"
          >
            <Button
              variant={buttonVariant}
              size="sm"
              className={cn(
                "w-full group transition-all duration-300 text-xs font-medium py-2",
                buttonVariant === "default" && "bg-indigo-600 hover:bg-indigo-700 text-white border-0 hover:scale-[1.02]",
                buttonVariant === "outline" && "border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:scale-[1.02]"
              )}
            >
              <span className="flex items-center justify-center gap-1">
                {buttonText}
                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default PricingCard
