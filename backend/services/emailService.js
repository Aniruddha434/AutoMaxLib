import nodemailer from 'nodemailer'

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  }

  // Send commit notification email
  async sendCommitNotification(user, commit, githubCommit) {
    try {
      if (!user.preferences?.emailNotifications) {
        return { success: false, message: 'Email notifications disabled' }
      }

      const mailOptions = {
        from: `"AutoGitPilot" <${process.env.SMTP_USER}>`,
        to: user.email,
        subject: '✅ Daily Commit Successful - AutoGitPilot',
        html: this.generateCommitNotificationHTML(user, commit, githubCommit)
      }

      const result = await this.transporter.sendMail(mailOptions)
      console.log('Commit notification email sent:', result.messageId)
      
      return { success: true, messageId: result.messageId }
    } catch (error) {
      console.error('Error sending commit notification email:', error)
      throw error
    }
  }

  // Send monthly summary email
  async sendMonthlySummary(user, stats) {
    try {
      if (!user.preferences?.emailNotifications) {
        return { success: false, message: 'Email notifications disabled' }
      }

      const mailOptions = {
        from: `"AutoGitPilot" <${process.env.SMTP_USER}>`,
        to: user.email,
        subject: '📊 Your Monthly Coding Summary - AutoGitPilot',
        html: this.generateMonthlySummaryHTML(user, stats)
      }

      const result = await this.transporter.sendMail(mailOptions)
      console.log('Monthly summary email sent:', result.messageId)
      
      return { success: true, messageId: result.messageId }
    } catch (error) {
      console.error('Error sending monthly summary email:', error)
      throw error
    }
  }

  // Send welcome email
  async sendWelcomeEmail(user) {
    try {
      const mailOptions = {
        from: `"AutoGitPilot" <${process.env.SMTP_USER}>`,
        to: user.email,
        subject: '🚀 Welcome to AutoGitPilot!',
        html: this.generateWelcomeHTML(user)
      }

      const result = await this.transporter.sendMail(mailOptions)
      console.log('Welcome email sent:', result.messageId)
      
      return { success: true, messageId: result.messageId }
    } catch (error) {
      console.error('Error sending welcome email:', error)
      throw error
    }
  }

  // Send premium upgrade confirmation
  async sendPremiumUpgradeEmail(user) {
    try {
      const mailOptions = {
        from: `"AutoGitPilot" <${process.env.SMTP_USER}>`,
        to: user.email,
        subject: '👑 Welcome to AutoGitPilot Premium!',
        html: this.generatePremiumUpgradeHTML(user)
      }

      const result = await this.transporter.sendMail(mailOptions)
      console.log('Premium upgrade email sent:', result.messageId)
      
      return { success: true, messageId: result.messageId }
    } catch (error) {
      console.error('Error sending premium upgrade email:', error)
      throw error
    }
  }

  // Generate commit notification HTML
  generateCommitNotificationHTML(user, commit, githubCommit) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Commit Successful</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #3B82F6, #8B5CF6); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
          .success-icon { font-size: 48px; margin-bottom: 10px; }
          .commit-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10B981; }
          .button { display: inline-block; background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="success-icon">✅</div>
            <h1>Commit Successful!</h1>
            <p>Your daily commit has been automatically created</p>
          </div>
          
          <div class="content">
            <p>Hi ${user.firstName},</p>
            
            <p>Great news! Your automated commit was successfully created on GitHub.</p>
            
            <div class="commit-details">
              <h3>Commit Details</h3>
              <p><strong>Repository:</strong> ${commit.repository.fullName}</p>
              <p><strong>Message:</strong> ${commit.commitMessage}</p>
              <p><strong>File:</strong> ${commit.filePath}</p>
              <p><strong>Time:</strong> ${new Date(commit.executedAt).toLocaleString()}</p>
              ${githubCommit.url ? `<p><strong>View on GitHub:</strong> <a href="${githubCommit.url}">View Commit</a></p>` : ''}
            </div>
            
            <p>Keep up the great work! Your current streak is <strong>${user.stats.currentStreak} days</strong>.</p>
            
            <a href="${process.env.FRONTEND_URL}/dashboard" class="button">View Dashboard</a>
            
            <div class="footer">
              <p>This email was sent by AutoGitPilot. You can manage your email preferences in your account settings.</p>
              <p>© ${new Date().getFullYear()} AutoGitPilot. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  }

  // Generate monthly summary HTML
  generateMonthlySummaryHTML(user, stats) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Monthly Summary</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #3B82F6, #8B5CF6); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
          .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
          .stat-card { background: white; padding: 20px; border-radius: 8px; text-align: center; }
          .stat-number { font-size: 32px; font-weight: bold; color: #3B82F6; }
          .button { display: inline-block; background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📊 Your Monthly Summary</h1>
            <p>Here's how you did this month with AutoGitPilot</p>
          </div>
          
          <div class="content">
            <p>Hi ${user.firstName},</p>
            
            <p>Here's your coding activity summary for this month:</p>
            
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-number">${stats.monthlyCommits}</div>
                <p>Commits This Month</p>
              </div>
              <div class="stat-card">
                <div class="stat-number">${stats.currentStreak}</div>
                <p>Current Streak</p>
              </div>
              <div class="stat-card">
                <div class="stat-number">${stats.activeDays}</div>
                <p>Active Days</p>
              </div>
              <div class="stat-card">
                <div class="stat-number">${stats.successRate}%</div>
                <p>Success Rate</p>
              </div>
            </div>
            
            <p>🎉 <strong>Achievement:</strong> You've maintained a ${stats.currentStreak}-day streak! Keep it up!</p>
            
            <a href="${process.env.FRONTEND_URL}/dashboard" class="button">View Dashboard</a>
            
            <div class="footer">
              <p>Keep coding and stay consistent! 💪</p>
              <p>© ${new Date().getFullYear()} AutoGitPilot. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  }

  // Generate welcome email HTML
  generateWelcomeHTML(user) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to AutoGitPilot</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #3B82F6, #8B5CF6); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
          .welcome-icon { font-size: 48px; margin-bottom: 10px; }
          .feature-list { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .button { display: inline-block; background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="welcome-icon">🚀</div>
            <h1>Welcome to AutoGitPilot!</h1>
            <p>Your journey to consistent coding starts now</p>
          </div>
          
          <div class="content">
            <p>Hi ${user.firstName},</p>
            
            <p>Welcome to AutoGitPilot! We're excited to help you maintain your GitHub streak and build consistent coding habits.</p>
            
            <div class="feature-list">
              <h3>What you can do with AutoGitPilot:</h3>
              <ul>
                <li>✅ Automated daily commits to keep your streak alive</li>
                <li>📊 Track your coding consistency and streaks</li>
                <li>⚙️ Customize commit messages and scheduling</li>
                <li>🔒 Secure GitHub integration with your personal access token</li>
              </ul>
            </div>
            
            <p>Ready to get started? Connect your GitHub repository and set up your first automated commit!</p>
            
            <a href="${process.env.FRONTEND_URL}/connect" class="button">Connect GitHub Repository</a>
            
            <div class="footer">
              <p>Need help? Check out our documentation or contact support.</p>
              <p>© ${new Date().getFullYear()} AutoGitPilot. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  }

  // Generate premium upgrade email HTML
  generatePremiumUpgradeHTML(user) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Premium</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #F59E0B, #EF4444); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
          .crown-icon { font-size: 48px; margin-bottom: 10px; }
          .premium-features { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .button { display: inline-block; background: #F59E0B; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="crown-icon">👑</div>
            <h1>Welcome to Premium!</h1>
            <p>You now have access to all premium features</p>
          </div>
          
          <div class="content">
            <p>Hi ${user.firstName},</p>
            
            <p>Congratulations! You've successfully upgraded to AutoGitPilot Premium. You now have access to all our advanced features.</p>
            
            <div class="premium-features">
              <h3>Your Premium Features:</h3>
              <ul>
                <li>🕐 Custom commit scheduling</li>
                <li>📁 Multiple repository support</li>
                <li>🤖 AI-generated commit messages</li>
                <li>📧 Email notifications and summaries</li>

                <li>🔗 GitHub OAuth integration</li>
                <li>🌟 Public shareable profile</li>
                <li>💾 Backup and restore settings</li>
              </ul>
            </div>
            
            <p>Start exploring your new features and take your GitHub automation to the next level!</p>
            
            <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Explore Premium Features</a>
            
            <div class="footer">
              <p>Thank you for supporting AutoGitPilot! 🙏</p>
              <p>© ${new Date().getFullYear()} AutoGitPilot. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  }
}

export default new EmailService()
