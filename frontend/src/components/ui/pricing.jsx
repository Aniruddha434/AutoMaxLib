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
        "relative flex flex-col h-full transition-all duration-300",
        highlight && "ring-2 ring-primary-500 shadow-lg scale-105",
        popular && "ring-2 ring-primary-500 shadow-glow-lg",
        "hover:shadow-lg hover:scale-105 card-interactive",
        className
      )}
      {...props}
    >
      {(highlight || popular) && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
          <Badge className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-4 py-2 text-sm font-semibold shadow-md">
            ⭐ Most Popular
          </Badge>
        </div>
      )}

      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-bold mb-2">{title}</CardTitle>
        <div className="mb-4">
          <div className="text-4xl font-bold text-primary-600 mb-1">
            {price}
          </div>
          {description && (
            <CardDescription className="text-sm">
              {description}
            </CardDescription>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1">
          <ul className="space-y-3 mb-8">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground leading-relaxed">
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
              size="lg"
              className={cn(
                "w-full group transition-all duration-300",
                buttonVariant === "default" && "hover:scale-105 hover-glow",
                buttonVariant === "outline" && "hover:scale-105 hover-glow-secondary"
              )}
            >
              <span className="flex items-center justify-center gap-2">
                {buttonText}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default PricingCard
