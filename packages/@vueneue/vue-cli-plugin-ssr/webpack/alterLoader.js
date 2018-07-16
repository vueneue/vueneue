const fs = require('fs-extra');
const { join } = require('path');
const ejs = require('ejs');
const { parse } = require('../lib/filesRouter');

module.exports = async function(content, map, meta) {
  this.cacheable(false);
  const callback = this.async();

  const relativePath = this.resourcePath.split('@vueneue/ssr-core/')[1];
  const { api } = this.query;
  const { plugins, paths } = api.neue;

  if (relativePath === 'generated.js') {
    const template = await fs.readFile(
      join(__dirname, 'templates/generated.ejs'),
      'utf-8',
    );

    content = ejs.render(template, {
      paths,
      plugins,
    });
  }

  console.dir(await parse(api.resolve(''), 'src/pages'), { depth: null });
  process.exit();

  callback(null, content, map, meta);
};
