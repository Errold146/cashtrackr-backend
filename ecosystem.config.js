module.exports = {
  apps: [{
    name: 'cashtrackr-backend',
    script: './dist/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    // Restart on crash
    autorestart: true,
    // Max restarts within min_uptime
    max_restarts: 10,
    min_uptime: '10s',
    // Delay between restarts
    restart_delay: 4000,
  }]
};
