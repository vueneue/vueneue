const path = require('path');
const fs = require('fs-extra');

const readDir = async (
  basePath,
  subPath,
  output = [],
  parentPath = undefined,
) => {
  const fullPath = path.join(basePath, subPath);
  const results = await fs.readdir(fullPath);
  const dirs = [];
  const files = [];

  for (const filepath of results) {
    const fileFullpath = path.join(fullPath, filepath);

    if ((await fs.stat(fileFullpath)).isDirectory()) {
      dirs.push(fileFullpath);
    } else if (/\.vue$/.test(filepath)) {
      files.push(fileFullpath);
    }
  }

  for (const filepath of files) {
    const relativePath = filepath.replace(fullPath, '');

    let routePath = parentPath
      ? parentPath + transformRoutePath(relativePath)
      : transformRoutePath(relativePath);

    if (routePath !== '/') {
      routePath = routePath.replace(/\/$/, '');
    }

    const route = {
      metas: { isIndex: /\/index\.vue$/.test(relativePath), filepath },
      path: routePath,
    };

    if (route.metas.isIndex && /:[^/]*$/.test(routePath)) {
      route.path += '?';
    }

    output.push(route);
  }

  for (const dirpath of dirs) {
    const relativePath = dirpath.replace(fullPath, '');
    const dirRoutePath = transformRoutePath(relativePath);

    const parent = output.find(item => item.path === dirRoutePath);

    if (parent) {
      parent.children = [];
      await readDir(fullPath, relativePath, parent.children);
    } else {
      output = [
        ...output,
        ...(await readDir(fullPath, relativePath, [], dirRoutePath)),
      ];
    }
  }

  return output;
};

const normalizeRoutes = (projectPath, pagesPath, routes, parent) => {
  for (const route of routes) {
    route.name = route.metas.isIndex
      ? `index-${route.path.replace(/\//g, '-')}`
      : route.path.replace(/\//g, '-');

    route.metas.path = parent
      ? `${parent.metas.path}${route.path}`
      : route.path;

    route.component = route.metas.filepath
      .replace(projectPath, '')
      .replace(/^\//, '');

    route.name = route.metas.path
      .replace(/^\//, '')
      .replace(/:/g, '_')
      .replace(/\?/, '')
      .replace(/\//g, '-');

    if (!route.name) route.name = 'home';

    if (route.children) {
      normalizeRoutes(projectPath, pagesPath, route.children, route);
    }
  }
};

const transformRoutePath = filepath => {
  filepath = filepath
    .replace(/\.vue$/, '')
    .replace(/_/g, ':')
    .replace(/\/index$/, '/');
  if (filepath !== '/') return filepath.replace(/\/$/, '');
  return filepath;
};

module.exports = {
  async parse(projectPath, pagesPath) {
    const routes = await readDir(projectPath, pagesPath);
    normalizeRoutes(projectPath, pagesPath, routes);
    return routes;
  },
};
