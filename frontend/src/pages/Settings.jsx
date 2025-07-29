import { useState, useEffect } from 'react'
import { useUserData } from '../contexts/UserContext'
import { useTheme } from '../contexts/ThemeContext'
import { userService } from '../services/userService'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card'
import FormField from '../components/ui/FormField'
import Toggle, { ToggleGroup } from '../components/ui/Toggle'
import {
  Settings as SettingsIcon,
  Clock,
  MessageSquare,
  Moon,
  Sun,
  Mail,
  User,
  Save,
  Crown,
  Bell,
  Shield,
  Palette,
  Zap,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

const Settings = () => {
  const { userData, updateUserData, isPremium } = useUserData()
  const { isDark, toggleTheme } = useTheme()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  // Form state
  const [commitTime, setCommitTime] = useState('10:00')
  const [commitMessages, setCommitMessages] = useState(['Daily update'])
  const [customMessage, setCustomMessage] = useState('')
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [publicProfile, setPublicProfile] = useState(false)
  const [enableAutoCommits, setEnableAutoCommits] = useState(true)
  const [enableSmartContent, setEnableSmartContent] = useState(false)
  const [enableAIMessages, setEnableAIMessages] = useState(false)

  useEffect(() => {
    if (userData) {
      setCommitTime(userData.commitSettings?.time || '10:00')
      setCommitMessages(userData.commitSettings?.messages || ['Daily update'])
      setEmailNotifications(userData.preferences?.emailNotifications ?? true)
      setPublicProfile(userData.preferences?.publicProfile ?? false)
      setEnableAutoCommits(userData.commitSettings?.enableAutoCommits ?? true)
      setEnableSmartContent(userData.commitSettings?.enableSmartContent ?? false)
      setEnableAIMessages(userData.commitSettings?.enableAIMessages ?? false)
    }
  }, [userData])

  const handleSaveSettings = async () => {
    try {
      setLoading(true)
      setError(null)

      // Update commit settings
      await userService.updateCommitSettings({
        time: commitTime,
        messages: commitMessages,
        enableAutoCommits,
        enableSmartContent,
        enableAIMessages
      })

      // Update user preferences
      await updateUserData({
        preferences: {
          emailNotifications,
          publicProfile,
          darkMode: isDark
        }
      })

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const addCustomMessage = () => {
    if (customMessage.trim() && !commitMessages.includes(customMessage.trim())) {
      setCommitMessages([...commitMessages, customMessage.trim()])
      setCustomMessage('')
    }
  }

  const removeMessage = (index) => {
    setCommitMessages(commitMessages.filter((_, i) => i !== index))
  }

  if (!userData) {
    return <LoadingSpinner text="Loading settings..." />
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="mb-12">
          <div className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-950/20 dark:to-secondary-950/20 rounded-2xl p-8 border border-primary-200/50 dark:border-primary-800/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center">
                  <SettingsIcon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-2">
                    Settings
                  </h1>
                  <p className="text-lg text-neutral-600 dark:text-neutral-300">
                    Customize your AutoGit experience to match your workflow
                  </p>
                </div>
              </div>
              {isPremium && (
                <div className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-medium">
                  <Crown className="h-5 w-5" />
                  <span>Premium Active</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <Card className="mb-8 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
              <p className="text-red-700 dark:text-red-200 font-medium">{error}</p>
            </div>
          </Card>
        )}

        {success && (
          <Card className="mb-8 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
              <p className="text-green-700 dark:text-green-200 font-medium">Settings saved successfully!</p>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Commit Settings */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle>Commit Settings</CardTitle>
                  <CardDescription>Configure when and how your commits are generated</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-8">
              {/* Commit Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Commit Time"
                  type="time"
                  value={commitTime}
                  onChange={(e) => setCommitTime(e.target.value)}
                  disabled={!isPremium}
                  hint={!isPremium ? "Premium feature - Fixed at 10:00 AM IST for free users" : "Choose your preferred commit time"}
                  icon={Clock}
                />

                <div className="flex items-center justify-center">
                  {!isPremium && (
                    <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl">
                      <Crown className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                      <p className="text-sm font-medium text-orange-700 dark:text-orange-300">
                        Upgrade to Premium for custom scheduling
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Auto Commits Toggle */}
              <ToggleGroup title="Auto Commits" description="Control automatic daily commits to your repositories">
                <Toggle
                  checked={enableAutoCommits}
                  onChange={setEnableAutoCommits}
                  label="Enable Auto Commits"
                  description="Automatically create daily commits to maintain your GitHub activity"
                  color="green"
                />
              </ToggleGroup>

              {/* Feature Toggles */}
              <ToggleGroup title="Advanced Features" description="Enhance your commits with AI-powered content generation">
                <Toggle
                  checked={enableSmartContent}
                  onChange={setEnableSmartContent}
                  disabled={!isPremium}
                  label="Smart Content Generation"
                  description="Generate dynamic content like quotes, ASCII art, and code snippets"
                  color="purple"
                />

                <Toggle
                  checked={enableAIMessages}
                  onChange={setEnableAIMessages}
                  disabled={!isPremium}
                  label="AI-Generated Commit Messages"
                  description="Use advanced AI to create meaningful and contextual commit messages"
                  color="blue"
                />
              </ToggleGroup>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <Bell className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle>Preferences</CardTitle>
                  <CardDescription>Manage your account preferences and notifications</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <ToggleGroup>
                <Toggle
                  checked={emailNotifications}
                  onChange={setEmailNotifications}
                  label="Email Notifications"
                  description="Receive email updates about your commits and account activity"
                  color="green"
                />

                <Toggle
                  checked={publicProfile}
                  onChange={setPublicProfile}
                  label="Public Profile"
                  description="Make your AutoGit statistics visible to others"
                  color="blue"
                />
              </ToggleGroup>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
                  <Palette className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>Customize the look and feel of your dashboard</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                    {isDark ? <Moon className="h-5 w-5 text-white" /> : <Sun className="h-5 w-5 text-white" />}
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900 dark:text-white">
                      {isDark ? 'Dark Mode' : 'Light Mode'}
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Switch between light and dark themes
                    </p>
                  </div>
                </div>
                <Toggle
                  checked={isDark}
                  onChange={toggleTheme}
                  color="purple"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save Button */}
        <div className="mt-12 flex justify-center">
          <button
            onClick={handleSaveSettings}
            disabled={loading}
            className="btn-primary px-12 py-4 text-lg font-semibold"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                Saving Settings...
              </div>
            ) : (
              <div className="flex items-center">
                <Save className="w-5 h-5 mr-2" />
                Save All Settings
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Settings
