module.exports = {
  apps: [
    {
      name: 'makchata',
      script: 'dist/main.js',
      exec_mode: 'cluster',
      instances: 'max',
      node_args: '-r ts-node/register',
    },
  ],
};
