const path = require('path');
const serverStart = require('@vueneue/ssr-server');

serverStart({
  dist: path.resolve('dist'),
});
