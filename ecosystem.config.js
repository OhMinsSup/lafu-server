/* eslint-disable prettier/prettier */
module.exports = {
  apps: [
    {
      name: 'lafu-api',
      script: './build/main.js',
      // script: './src/server.ts',
      instances: "4",
      ignore_watch: ["node_modules"],
      exec_mode: "cluster",
      // interpreter: "ts-node",
      wait_ready: true,
      listen_timeout: 50000,
      kill_timeout: 5000,    
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
};
