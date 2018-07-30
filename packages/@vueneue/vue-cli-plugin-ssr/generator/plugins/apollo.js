module.exports = (api, packageOverride) => {
  if (api.hasPlugin('apollo')) {
    // Add fecth for node
    packageOverride.dependencies['isomorphic-fetch'] = '^2.2.1';

    // Render template
    api.render('../templates/apollo');

    api.postProcessFiles(files => {
      // Transform existing files
      for (const file in files) {
        if (file.indexOf('src/vue-apollo.') == 0) {
          files[file] = files[file].replace(
            /ssr:\s?false/,
            'ssr: process.server',
          );
        }
      }
    });
  }
};
