const fs = require('fs-extra');
const path = require('path');
const ejs = require('ejs');
const chokidar = require('chokidar');

class NeueCorePlugin {
  constructor({ api }) {
    this.api = api;
    this.neue = api.neue;
    this.watcher = null;
  }

  apply(compiler) {
    this.compiler = compiler;

    compiler.hooks.run.tapPromise('NeueCorePlugin', async () => {
      await this.writeBoot();
    });

    compiler.hooks.watchRun.tapPromise('NeueCorePlugin', async () => {
      if (!this.watcher) {
        chokidar.watch(this.api.resolve('neue.config.js')).on('all', () => {
          this.writeBoot();
        });
      }
      await this.writeBoot();
    });
  }

  onRun() {
    return async () => {
      await this.writeBoot();
    };
  }

  async writeBoot() {
    const { paths, plugins } = await this.neue.getConfig();

    for (const name in paths) {
      paths[name] = await this.neue.getFilePath(paths[name]);
    }

    for (const name in plugins) {
      plugins[name].src = await this.neue.getFilePath(plugins[name].src);
    }

    const to = path.resolve(__dirname, '../boot.js');
    const code = await ejs.renderFile(path.join(__dirname, 'boot.ejs'), {
      paths,
      plugins,
    });

    if ((await fs.exists(to)) && (await fs.readFile(to, 'utf-8')) == code) {
      return;
    }

    await fs.writeFile(to, code);
  }
}

module.exports = NeueCorePlugin;
