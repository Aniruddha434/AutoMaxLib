import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Separator } from './ui/separator'
import { Clock, Users, GitCommit, AlertCircle, CheckCircle, Play, RefreshCw } from 'lucide-react'

const SchedulerDebug = () => {
  const [status, setStatus] = useState(null)
  const [commits, setCommits] = useState([])
  const [users, setUsers] = useState(null)
  const [loading, setLoading] = useState(false)
  const [testing, setTesting] = useState(false)

  const fetchStatus = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/scheduler/status')
      const data = await response.json()
      if (data.success) {
        setStatus(data)
      }
    } catch (error) {
      console.error('Error fetching scheduler status:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCommits = async () => {
    try {
      const response = await fetch('/api/scheduler/commits/recent?limit=10')
      const data = await response.json()
      if (data.success) {
        setCommits(data.commits)
      }
    } catch (error) {
      console.error('Error fetching commits:', error)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/scheduler/users/eligible')
      const data = await response.json()
      if (data.success) {
        setUsers(data)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const testFreeUsers = async () => {
    try {
      setTesting(true)
      const response = await fetch('/api/scheduler/test/free-users', {
        method: 'POST'
      })
      const data = await response.json()
      alert(data.success ? 'Free user test completed!' : `Error: ${data.message}`)
      fetchCommits() // Refresh commits
    } catch (error) {
      alert(`Error: ${error.message}`)
    } finally {
      setTesting(false)
    }
  }

  const testPremiumUsers = async () => {
    try {
      setTesting(true)
      const response = await fetch('/api/scheduler/test/premium-users', {
        method: 'POST'
      })
      const data = await response.json()
      alert(data.success ? 'Premium user test completed!' : `Error: ${data.message}`)
      fetchCommits() // Refresh commits
    } catch (error) {
      alert(`Error: ${error.message}`)
    } finally {
      setTesting(false)
    }
  }

  useEffect(() => {
    fetchStatus()
    fetchCommits()
    fetchUsers()
  }, [])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Scheduler Debug Panel</h1>
        <Button onClick={() => {
          fetchStatus()
          fetchCommits()
          fetchUsers()
        }} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Scheduler Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Scheduler Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          {status ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Badge variant={status.scheduler.isInitialized ? "default" : "destructive"}>
                  {status.scheduler.isInitialized ? "Running" : "Stopped"}
                </Badge>
                <span className="text-sm text-gray-600">
                  Current Time: {formatDate(status.scheduler.currentTime)}
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{status.stats.todayCommits}</div>
                  <div className="text-sm text-gray-600">Today's Commits</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{status.stats.failedCommits}</div>
                  <div className="text-sm text-gray-600">Failed Commits</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{status.stats.freeUsers}</div>
                  <div className="text-sm text-gray-600">Free Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{status.stats.premiumUsers}</div>
                  <div className="text-sm text-gray-600">Premium Users</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Active Jobs:</h4>
                <div className="flex gap-2">
                  {status.scheduler.activeJobs.map(job => (
                    <Badge key={job} variant="outline">{job}</Badge>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div>Loading...</div>
          )}
        </CardContent>
      </Card>

      {/* Test Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Manual Testing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button onClick={testFreeUsers} disabled={testing}>
              Test Free Users
            </Button>
            <Button onClick={testPremiumUsers} disabled={testing}>
              Test Premium Users
            </Button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            These buttons manually trigger the scheduler processes for testing.
          </p>
        </CardContent>
      </Card>

      {/* Eligible Users */}
      {users && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Eligible Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-xl font-bold">{users.summary.totalFreeUsers}</div>
                  <div className="text-sm text-gray-600">Total Free Users</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-green-600">{users.summary.eligibleFreeUsers}</div>
                  <div className="text-sm text-gray-600">Eligible Free Users</div>
                </div>
                <div>
                  <div className="text-xl font-bold">{users.summary.totalPremiumUsers}</div>
                  <div className="text-sm text-gray-600">Premium Users</div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-2">Free Users (Trial Status):</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {users.freeUsers.map(user => (
                    <div key={user.clerkId} className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">
                        {user.firstName} {user.lastName} ({user.email})
                      </span>
                      <div className="flex items-center gap-2">
                        <Badge variant={user.canUseAutoCommit ? "default" : "destructive"}>
                          {user.canUseAutoCommit ? `${user.trialDaysRemaining} days left` : "Trial Expired"}
                        </Badge>
                        {user.activeRepository && (
                          <Badge variant="outline">{user.activeRepository.name}</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Commits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitCommit className="h-5 w-5" />
            Recent Auto Commits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {commits.length > 0 ? (
              commits.map(commit => (
                <div key={commit.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <div className="font-medium">{commit.commitMessage}</div>
                    <div className="text-sm text-gray-600">
                      {commit.user?.firstName} {commit.user?.lastName} • {commit.repository.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(commit.createdAt)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={commit.status === 'success' ? "default" : "destructive"}>
                      {commit.status}
                    </Badge>
                    {commit.status === 'success' ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-4">
                No recent commits found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SchedulerDebug
