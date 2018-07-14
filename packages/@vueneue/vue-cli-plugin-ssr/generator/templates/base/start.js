/**
 * Simple script to start SSR server in production
 * Used in Dockerfile
 */

const { existsSync } = require('fs');
const path = require('path');
const serverStart = require('@vueneue/ssr-server');

// Force production mode
process.env.NODE_ENV = 'production';

// Read Vue config if exists
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
});
