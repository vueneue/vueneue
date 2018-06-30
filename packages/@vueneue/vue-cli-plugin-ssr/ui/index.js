const path = require('path');
const fs = require('fs-extra');

module.exports = api => {
  api.addClientAddon({
    id: 'org.vueneue.webpack.client-addon',
    path: path.join(__dirname, '../ui-addon-dist'),
  });

  const { setSharedData, removeSharedData } = api.namespace(
    'webpack-dashboard-',
  );

  let firstRun = true;
  let hadFailed = false;

  function resetSharedData(key) {
    setSharedData(`${key}-status`, null);
    setSharedData(`${key}-progress`, 0);
    setSharedData(`${key}-operations`, null);
    setSharedData(`${key}-stats`, null);
    setSharedData(`${key}-sizes`, null);
    setSharedData(`${key}-problems`, null);
  }

  async function onWebpackMessage({ data: message }) {
    if (message.webpackDashboardData) {
      const type = message.webpackDashboardData.type;
      for (const data of message.webpackDashboardData.value) {
        if (data.type === 'stats') {
          // Stats are read from a file
          const statsFile = path.resolve(
            process.cwd(),
            `./node_modules/.stats-${type}.json`,
          );
          const value = await fs.readJson(statsFile);
          setSharedData(`${type}-${data.type}`, value);
          await fs.remove(statsFile);
        } else if (data.type === 'progress') {
          setSharedData(`${type}-${data.type}`, data.value);
        } else {
          setSharedData(`${type}-${data.type}`, data.value);

          // Notifications
          if (type === 'ssr-serve' && data.type === 'status') {
            if (data.value === 'Failed') {
              api.notify({
                title: 'Build failed',
                message: 'The build has errors.',
                icon: 'error',
              });
              hadFailed = true;
            } else if (data.value === 'Success') {
              if (hadFailed) {
                api.notify({
                  title: 'Build fixed',
                  message: 'The build succeeded.',
                  icon: 'done',
                });
                hadFailed = false;
              } else if (firstRun) {
                api.notify({
                  title: 'App ready',
                  message: 'The build succeeded.',
                  icon: 'done',
                });
                firstRun = false;
              }
            }
          }
        }
      }
    }
  }

  // Init data
  api.onProjectOpen(() => {
    for (const key of ['ssr-serve', 'ssr-build']) {
      resetSharedData(key);
    }
  });

  // Tasks
  const views = {
    views: [
      {
        id: 'org.vueneue.webpack.views.dashboard',
        label: 'Dashboard',
        icon: 'dashboard',
        component: 'org.vueneue.webpack.components.dashboard',
      },
      {
        id: 'org.vueneue.webpack.views.analyzer',
        label: 'Analyzer',
        icon: 'donut_large',
        component: 'org.vueneue.webpack.components.analyzer',
      },
    ],
    defaultView: 'org.vueneue.webpack.views.dashboard',
  };

  api.describeTask({
    match: /vue-cli-service ssr:serve/,
    description: 'SSR: Start development server with HMR',
    icon: 'code',
    prompts: [
      {
        name: 'mode',
        type: 'list',
        default: 'development',
        choices: [
          {
            name: 'development',
            value: 'development',
          },
          {
            name: 'production',
            value: 'production',
          },
          {
            name: 'test',
            value: 'test',
          },
        ],
        description: 'Specify env',
      },
      {
        name: 'host',
        type: 'input',
        default: '0.0.0.0',
        description: 'Specify host',
      },
      {
        name: 'port',
        type: 'input',
        default: 3000,
        description: 'Specify port',
      },
    ],
    onBeforeRun: ({ answers, args }) => {
      // Args
      if (answers.mode) args.push('--mode', answers.mode);
      if (answers.host) args.push('--host', answers.host);
      if (answers.port) args.push('--port', answers.port);
      args.push('--dashboard');

      // Data
      removeSharedData('serve-url');
      resetSharedData('serve', true);
      firstRun = true;
      hadFailed = false;
    },
    onRun: () => {
      api.ipcOn(onWebpackMessage);
    },
    onExit: () => {
      api.ipcOff(onWebpackMessage);
      removeSharedData('serve-url');
    },
    ...views,
  });

  api.describeTask({
    match: /vue-cli-service ssr:build/,
    description: 'SSR: Make a production build',
    icon: 'archive',
    prompts: [
      {
        name: 'mode',
        type: 'list',
        default: 'production',
        choices: [
          {
            name: 'development',
            value: 'development',
          },
          {
            name: 'production',
            value: 'production',
          },
          {
            name: 'test',
            value: 'test',
          },
        ],
        description: 'Specify env',
      },
      {
        name: 'report',
        type: 'confirm',
        default: false,
        description: 'Generate report files',
      },
      {
        name: 'watch',
        type: 'confirm',
        default: false,
        description: 'Enable watch mode',
      },
    ],
    onBeforeRun: ({ answers, args }) => {
      // Args
      if (answers.mode) args.push('--mode', answers.mode);
      if (answers.report) args.push('--report', answers.report);
      if (answers.watch) args.push('--watch', answers.watch);
      args.push('--dashboard');

      // Data
      resetSharedData('ssr-build', true);
    },
    onRun: () => {
      api.ipcOn(onWebpackMessage);
    },
    onExit: () => {
      api.ipcOff(onWebpackMessage);
    },
    ...views,
  });

  api.describeTask({
    match: /vue-cli-service ssr:start/,
    description: 'SSR: Start production server',
    icon: 'send',
    prompts: [
      {
        name: 'mode',
        type: 'list',
        default: 'production',
        choices: [
          {
            name: 'development',
            value: 'development',
          },
          {
            name: 'production',
            value: 'production',
          },
          {
            name: 'test',
            value: 'test',
          },
        ],
        description: 'Specify env',
      },
      {
        name: 'host',
        type: 'input',
        default: '0.0.0.0',
        description: 'Specify host',
      },
      {
        name: 'port',
        type: 'input',
        default: 3000,
        description: 'Specify port',
      },
    ],
    onBeforeRun: ({ answers, args }) => {
      // Args
      if (answers.mode) args.push('--mode', answers.mode);
      if (answers.host) args.push('--host', answers.host);
      if (answers.port) args.push('--port', answers.port);
    },
  });

  // Open app button
  api.ipcOn(({ data }) => {
    if (data.vueServe) {
      setSharedData('serve-url', data.vueServe.url);
    }
  });
};
