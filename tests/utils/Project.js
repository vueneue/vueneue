const fs = require('fs-extra');
const execa = require('execa');
const { join } = require('path');

class Project {
  constructor(workspace, name) {
    this.workspace = workspace;
    this.name = name;
    this.path = join(this.workspace.packagesPath, name);
  }

  async create() {
    console.log(`Create project ${this.name}`);
    await this.workspace.cloneBaseProject(this.name);
  }

  async addPlugin(plugins = []) {
    if (!Array.isArray(plugins)) plugins = [plugins];
    for (const name of plugins) {
      await this.workspace.vue(['add', name], {
        stdio: 'inherit',
        cwd: this.path,
      });
    }
  }

  async invokePlugin(plugins, args = []) {
    if (!Array.isArray(plugins)) plugins = [plugins];
    for (const name of plugins) {
      await this.workspace.vue(['invoke', name, ...args], {
        stdio: 'inherit',
        cwd: this.path,
      });
    }
  }

  async addDependency(deps = []) {
    if (!Array.isArray(deps)) deps = [deps];
    if (deps.length) {
      await execa('yarn', ['add', ...deps], {
        stdio: 'inherit',
        cwd: this.path,
      });
    }
  }

  cliService(commandName, args = []) {
    return execa(
      './node_modules/.bin/vue-cli-service',
      [commandName, ...args],
      {
        stdio: 'inherit',
        cwd: this.path,
      },
    );
  }
}

module.exports = Project;
