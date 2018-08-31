const fs = require('fs');
const stringifyJs = require('javascript-stringify');

module.exports = (api, packageOverride) => {
  if (api.hasPlugin('apollo')) {
    // Add depedencies
    packageOverride.dependencies['isomorphic-fetch'] = '^2.2.1';
    packageOverride.dependencies['js-cookie'] = '^2.2.0';
    packageOverride.dependencies['koa-cookie'] = '^1.0.0';

    // Render template
    api.render('../templates/apollo');

    api.postProcessFiles(files => {
      // Transform existing files
      for (const file in files) {
        // Rewrite main.js
        if (file.indexOf('src/main.') == 0) {
          files[file] = files[file]
            .replace(
              'export default ({ router, store }) => {',
              `export default ({ router, store, ctx }) => {`,
            )
            .replace('createProvider()', 'createProvider({ ctx })');
        }

        // Rewrite vue-apollo.js
        if (file.indexOf('src/vue-apollo.') == 0) {
          files[file] =
            `import { getAuth } from './plugins/apollo';\n` + files[file];

          files[file] = files[file]
            .replace(/ssr:\s?false/, 'ssr: !!process.server')
            .replace('Vue.use(VueApollo)', '')
            .replace(
              'localStorage.setItem(AUTH_TOKEN, token)',
              `if (process.client) require('js-cookie').set(AUTH_TOKEN, token)`,
            )
            .replace(
              'localStorage.removeItem(AUTH_TOKEN)',
              `if (process.client) require('js-cookie').remove(AUTH_TOKEN)`,
            )
            .replace(
              /(createProvider.*\n)/,
              `$1\tdefaultOptions.getAuth = getAuth(AUTH_TOKEN, options.ctx)\n`,
            );
        }
      }
    });

    api.onCreateComplete(() => {
      // Get config path
      const neueConfigPath = api.resolve('neue.config.js');

      // Config already defined
      if (fs.existsSync(neueConfigPath)) {
        // Add plugin
        const neueConfig = require(neueConfigPath);
        neueConfig.plugins.apollo = '@/plugins/apollo';

        // Read original file
        const configContent = fs.readFileSync(neueConfigPath, 'utf-8');

        // Write changes
        fs.writeFileSync(
          neueConfigPath,
          configContent.replace(
            /^module\.exports.*(\{(\n|.)*\})/gm,
            `module.exports = {${stringifyJs(neueConfig, null, 2)}}`,
          ),
        );
      } else {
        // Create config file
        fs.writeFileSync(
          neueConfigPath,
          `module.exports = {
  plugins: {
    apollo: '@/plugins/apollo'
  }
}`,
        );
      }
    });
  }
};
