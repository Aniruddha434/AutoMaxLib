import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock, Crown, AlertTriangle, CheckCircle, X } from 'lucide-react'

const TrialStatus = ({ userData, onDismiss }) => {
  const [dismissed, setDismissed] = useState(false)

  if (!userData || userData.plan !== 'free' || !userData.trial || dismissed) {
    return null
  }

  const { isTrialActive, daysRemaining, trialEndDate } = userData.trial

  const handleDismiss = () => {
    setDismissed(true)
    if (onDismiss) {
      onDismiss()
    }
  }

  // Don't show if trial is active and has more than 3 days remaining
  if (isTrialActive && daysRemaining > 3) {
    return null
  }

  const isExpired = !isTrialActive
  const isExpiringSoon = isTrialActive && daysRemaining <= 3

  return (
    <div className={`rounded-xl border p-4 mb-6 ${
      isExpired 
        ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' 
        : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className={`p-2 rounded-lg ${
            isExpired 
              ? 'bg-red-100 dark:bg-red-800' 
              : 'bg-amber-100 dark:bg-amber-800'
          }`}>
            {isExpired ? (
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            ) : (
              <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            )}
          </div>
          
          <div className="flex-1">
            <h3 className={`font-semibold ${
              isExpired 
                ? 'text-red-900 dark:text-red-100' 
                : 'text-amber-900 dark:text-amber-100'
            }`}>
              {isExpired ? 'Free Trial Expired' : 'Free Trial Ending Soon'}
            </h3>
            
            <p className={`text-sm mt-1 ${
              isExpired 
                ? 'text-red-700 dark:text-red-300' 
                : 'text-amber-700 dark:text-amber-300'
            }`}>
              {isExpired ? (
                'Your 15-day free trial for auto commits has ended. Upgrade to premium to continue using all features.'
              ) : (
                `Your free trial expires in ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}. Upgrade now to keep your automation running.`
              )}
            </p>

            {trialEndDate && (
              <p className={`text-xs mt-2 ${
                isExpired 
                  ? 'text-red-600 dark:text-red-400' 
                  : 'text-amber-600 dark:text-amber-400'
              }`}>
                Trial ended: {new Date(trialEndDate).toLocaleDateString()}
              </p>
            )}

            <div className="flex items-center space-x-3 mt-4">
              <Link
                to="/upgrade"
                className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isExpired
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-amber-600 hover:bg-amber-700 text-white'
                }`}
              >
                <Crown className="h-4 w-4" />
                <span>Upgrade to Premium</span>
              </Link>

              {!isExpired && (
                <button
                  onClick={handleDismiss}
                  className="text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200 text-sm font-medium"
                >
                  Remind me later
                </button>
              )}
            </div>
          </div>
        </div>

        {!isExpired && (
          <button
            onClick={handleDismiss}
            className="text-amber-400 hover:text-amber-600 dark:text-amber-500 dark:hover:text-amber-300"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  )
}

// Compact version for sidebar or header
export const TrialStatusCompact = ({ userData }) => {
  if (!userData || userData.plan !== 'free' || !userData.trial) {
    return null
  }

  const { isTrialActive, daysRemaining } = userData.trial

  if (isTrialActive && daysRemaining > 7) {
    return null
  }

  const isExpired = !isTrialActive

  return (
    <Link
      to="/upgrade"
      className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        isExpired
          ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50'
          : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900/50'
      }`}
    >
      {isExpired ? (
        <AlertTriangle className="h-4 w-4" />
      ) : (
        <Clock className="h-4 w-4" />
      )}
      <span>
        {isExpired ? 'Trial Expired' : `${daysRemaining} days left`}
      </span>
    </Link>
  )
}

export default TrialStatus
