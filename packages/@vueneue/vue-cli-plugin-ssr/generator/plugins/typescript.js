module.exports = api => {
  // TypeScript support
  if (api.invoking && api.hasPlugin('@vue/cli-plugin-typescript')) {
    /* eslint-disable-next-line node/no-extraneous-require */
    const convertFiles = require('@vue/cli-plugin-typescript/generator/convert');
    convertFiles(api);

    api.postProcessFiles(files => {
      for (const file in files) {
        if (/src\/main\./.test(file)) {
          files[file] = files[file].replace(
            /(export\sdefault\s.*)\(([^)]*)\)/m,
            `$1($2: any)`,
          );

          if (!/import.*'neuets'/.test(file)) {
            files[file] = `import 'neuets';\n` + files[file];
          }
        } else if (file === 'tsconfig.json') {
          const tsConfig = JSON.parse(files[file]);
          tsConfig.compilerOptions.paths['neuets'] = [
            'node_modules/@vueneue/ssr-core/neuets',
          ];
          files[file] = JSON.stringify(tsConfig, null, 2);
        }
      }
    });
  }
};
