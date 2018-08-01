module.exports = (api, packageOverride) => {
  if (api.hasPlugin('apollo')) {
    // Add depedencies
    packageOverride.dependencies['isomorphic-fetch'] = '^2.2.1';
    packageOverride.dependencies['js-cookies'] = '^1.0.2';
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
            .replace(
              'createProvider().provide()',
              'createProvider({ ctx }).provide()',
            );
        }

        // Rewrite vue-apollo.js
        if (file.indexOf('src/vue-apollo.') == 0) {
          files[file] =
            `import { getAuth } from './plugins/apollo';\n` + files[file];

          files[file] = files[file]
            .replace(/ssr:\s?false/, 'ssr: !!process.server')
            .replace(
              'localStorage.setItem(AUTH_TOKEN, token)',
              `if (process.client) require('js-cookies').set(AUTH_TOKEN, token)`,
            )
            .replace(
              'localStorage.removeItem(AUTH_TOKEN)',
              `if (process.client) require('js-cookies').remove(AUTH_TOKEN)`,
            )
            .replace(
              /export function createProvider\(([^)]*)\) \{/,
              `export function createProvider($1) {
                defaultOptions.getAuth = getAuth(AUTH_TOKEN, options.ctx)`,
            );
        }
      }
    });
  }
};
