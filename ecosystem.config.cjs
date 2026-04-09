module.exports = {
  apps: [{
    name: 'chat-agent-app',
    script: 'npx',
    args: 'tsx server/index.ts',
    cwd: __dirname,
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '512M',
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    time: true
  }]
};
