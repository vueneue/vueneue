const { existsSync } = require('fs');
const path = require('path');
const serverStart = require('@vueneue/ssr-server');

process.env.NODE_ENV = 'production';

let ssr;
if (existsSync('./neue.config.js')) {
  const options = require('./neue.config.js');
  if (options) {
    ssr = options.ssr;
  }
}

serverStart({
  ssr,
  host: process.env.HOST || '0.0.0.0',
  port: process.env.PORT || 8080,
  dist: path.resolve('dist'),
}).then(httpServer => {
  const signals = ['SIGINT', 'SIGTERM'];
  for (const signal of signals) {
    process.on(signal, () => {
      httpServer.close(() => {
        process.exit(0);
      });
    });
  }
});
