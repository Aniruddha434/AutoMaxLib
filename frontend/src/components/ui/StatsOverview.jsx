import { 
  GitBranch, 
  Flame, 
  Award, 
  Calendar,
  TrendingUp,
  Clock,
  Target,
  Zap
} from 'lucide-react'
import { cn } from '../../utils/cn'

// Animated Number Component
const AnimatedNumber = ({ value, duration = 1000 }) => {
  return (
    <span className="tabular-nums">
      {value}
    </span>
  )
}

const StatCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  gradient, 
  badge, 
  trend = null,
  className = '' 
}) => {
  return (
    <div className={cn(
      'relative overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800',
      'bg-white dark:bg-neutral-900 p-4 transition-all duration-300 ease-out',
      'hover:shadow-md hover:shadow-black/5 dark:hover:shadow-black/20 hover:-translate-y-0.5',
      className
    )}>
      {/* Gradient Background */}
      <div className={cn(
        'absolute inset-0 bg-gradient-to-br opacity-5',
        gradient
      )} />
      
      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className={cn(
            'w-8 h-8 rounded-lg flex items-center justify-center',
            `bg-gradient-to-br ${gradient}`
          )}>
            <Icon className="h-4 w-4 text-white" />
          </div>
          {badge && (
            <div className={cn(
              'text-xs font-medium px-1.5 py-0.5 rounded-full',
              'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
            )}>
              {badge}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-1">
          <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
            {title}
          </p>
          <div className="flex items-baseline gap-1">
            <p className="text-xl font-bold text-neutral-900 dark:text-white">
              <AnimatedNumber value={value} />
            </p>
            {trend && (
              <div className={cn(
                'flex items-center gap-1 text-xs font-medium',
                trend.direction === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              )}>
                <TrendingUp className={cn(
                  'w-2 h-2',
                  trend.direction === 'down' && 'rotate-180'
                )} />
                {trend.value}
              </div>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-neutral-500 dark:text-neutral-500">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

const StatsOverview = ({ dashboardData, className = '' }) => {
  const stats = dashboardData?.user?.stats || {}
  
  const statsConfig = [
    {
      title: "Total Commits",
      value: stats.totalCommits || 0,
      subtitle: "All time contributions",
      icon: GitBranch,
      gradient: "from-blue-500 to-cyan-500",
      badge: "Total"
    },
    {
      title: "Current Streak",
      value: stats.currentStreak || 0,
      subtitle: "🔥 Keep it going!",
      icon: Flame,
      gradient: "from-orange-500 to-red-500",
      badge: "Active",
      trend: stats.currentStreak > 0 ? { direction: 'up', value: '+1' } : null
    },
    {
      title: "Longest Streak",
      value: stats.longestStreak || 0,
      subtitle: "🏆 Personal best",
      icon: Award,
      gradient: "from-amber-500 to-orange-500",
      badge: "Record"
    },
    {
      title: "This Month",
      value: stats.thisMonth || 0,
      subtitle: "Commits in current month",
      icon: Calendar,
      gradient: "from-green-500 to-emerald-500",
      badge: "Monthly"
    }
  ]

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="text-center">
        <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-1">
          Your Coding Statistics
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Track your progress and maintain your streak
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {statsConfig.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Streak Status */}
        <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <Target className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
              Streak Status
            </h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-neutral-600 dark:text-neutral-400">
                Current Streak
              </span>
              <span className="text-xs font-medium text-neutral-900 dark:text-white">
                {stats.currentStreak || 0} days
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-neutral-600 dark:text-neutral-400">
                Goal Progress
              </span>
              <span className="text-xs font-medium text-neutral-900 dark:text-white">
                {Math.min(((stats.currentStreak || 0) / 30) * 100, 100).toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-1.5">
              <div
                className="h-1.5 rounded-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500"
                style={{ width: `${Math.min(((stats.currentStreak || 0) / 30) * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-500">
              {stats.currentStreak >= 30 ? '🎉 Goal achieved!' : `${30 - (stats.currentStreak || 0)} days to reach 30-day goal`}
            </p>
          </div>
        </div>

        {/* Activity Summary */}
        <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
              Activity Summary
            </h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-neutral-600 dark:text-neutral-400">
                Average per day
              </span>
              <span className="text-xs font-medium text-neutral-900 dark:text-white">
                {stats.totalCommits && stats.currentStreak ?
                  (stats.totalCommits / Math.max(stats.currentStreak, 1)).toFixed(1) :
                  '0'} commits
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-neutral-600 dark:text-neutral-400">
                Last commit
              </span>
              <span className="text-xs font-medium text-neutral-900 dark:text-white">
                {dashboardData?.lastCommit ? 'Today' : 'No recent activity'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-neutral-600 dark:text-neutral-400">
                Status
              </span>
              <span className={cn(
                'text-xs font-medium',
                stats.currentStreak > 0 ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'
              )}>
                {stats.currentStreak > 0 ? '✅ Active' : '⚠️ Inactive'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatsOverview
