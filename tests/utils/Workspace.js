const fs = require('fs-extra');
const execa = require('execa');
const { join, resolve } = require('path');
const Project = require('./Project');

class Workspace {
  constructor(path = process.cwd()) {
    this.path = resolve(path);
    this.packagesPath = join(this.path, 'packages/tests');
  }

  async lernaLink() {
    return execa(join(this.path, 'node_modules/.bin/lerna'), ['link'], {
      stdio: 'inherit',
      cwd: this.path,
    });
  }

  async vue(args, options) {
    return execa(join(this.path, 'node_modules/.bin/vue'), args, options);
  }

  async createBaseProject() {
    await fs.ensureDir(this.packagesPath);
    await this.vue(
      [
        'create',
        '--inlinePreset',
        JSON.stringify({
          plugins: {
            '@vue/cli-plugin-babel': {},
          },
          router: true,
          vuex: true,
        }),
        '--force',
        '--git',
        'false',
        'base',
      ],
      {
        stdio: 'inherit',
        cwd: this.packagesPath,
      },
    );

    await this.getProject('base').addDependency('@vueneue/vue-cli-plugin-ssr');
  }

  async cloneBaseProject(name) {
    if (name === 'base') throw new Error('Wrong package name');

    if (!(await fs.exists(join(this.packagesPath, 'base/package.json')))) {
      await this.createBaseProject();
    }

    await fs.copy(
      join(this.packagesPath, 'base'),
      join(this.packagesPath, name),
    );

    const projectPackage = require(join(
      this.packagesPath,
      name,
      'package.json',
    ));
    projectPackage.name = name;
    await fs.writeFileSync(
      join(this.packagesPath, name, 'package.json'),
      JSON.stringify(projectPackage, null, 2),
    );
  }

  getProject(name) {
    return new Project(this, name);
  }

  async relink(name) {
    await fs.remove(`node_modules/${name}`);
    await fs.symlink(
      join(process.cwd(), `packages/${name}`),
      `node_modules/${name}`,
    );
  }
}

module.exports = Workspace;
