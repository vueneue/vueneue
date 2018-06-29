const { clientAddonConfig } = require('@vue/cli-ui');

module.exports = {
  ...clientAddonConfig({
    id: 'org.vueneue.webpack.client-addon',
    // Development port (default 8042)
    port: 8042,
  }),
};
