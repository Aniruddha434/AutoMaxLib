module.exports = {
  apps: [
    {
      name: 'autogitpilot-backend',
      script: 'server.js',
      instances: process.env.NODE_ENV === 'production' ? 'max' : 1,
      exec_mode: 'cluster',
      
      // Environment variables
      env: {
        NODE_ENV: 'development',
        PORT: 5000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      
      // Logging
      log_file: 'logs/pm2-combined.log',
      out_file: 'logs/pm2-out.log',
      error_file: 'logs/pm2-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      
      // Process management
      watch: process.env.NODE_ENV === 'development',
      watch_delay: 1000,
      ignore_watch: [
        'node_modules',
        'logs',
        'uploads',
        '.git',
        '*.log'
      ],
      
      // Auto restart configuration
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '1G',
      
      // Graceful shutdown
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,
      
      // Health monitoring
      health_check_grace_period: 3000,
      
      // Performance monitoring
      pmx: true,
      
      // Source map support
      source_map_support: true,
      
      // Node.js options
      node_args: [
        '--max-old-space-size=1024',
        '--optimize-for-size'
      ],
      
      // Cron restart (restart every day at 2 AM in production)
      cron_restart: process.env.NODE_ENV === 'production' ? '0 2 * * *' : undefined,
      
      // Error handling
      exp_backoff_restart_delay: 100,
      
      // Instance variables
      instance_var: 'INSTANCE_ID',
      
      // Advanced features
      vizion: false,
      post_update: ['npm install'],
      
      // Environment-specific configurations
      ...(process.env.NODE_ENV === 'production' && {
        instances: 'max',
        exec_mode: 'cluster',
        max_memory_restart: '2G',
        node_args: [
          '--max-old-space-size=2048',
          '--optimize-for-size'
        ]
      })
    }
  ],

  // Deployment configuration
  deploy: {
    production: {
      user: 'deploy',
      host: ['your-production-server.com'],
      ref: 'origin/main',
      repo: 'git@github.com:your-username/autogitpilot.git',
      path: '/var/www/autogitpilot',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': 'apt update && apt install git -y'
    },
    staging: {
      user: 'deploy',
      host: ['your-staging-server.com'],
      ref: 'origin/develop',
      repo: 'git@github.com:your-username/autogitpilot.git',
      path: '/var/www/autogitpilot-staging',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env staging',
      'pre-setup': 'apt update && apt install git -y'
    }
  }
}
