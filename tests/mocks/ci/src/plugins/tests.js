import { asyncTest } from '../utils';

export default async context => {
  const { store, appCreated } = context;

  store.commit('setPlugin', await asyncTest('plugin'));

  appCreated(app => {
    if (app === context.app) {
      store.commit('setPluginAppCreated', 'yes');
    } else {
      store.commit('setPluginAppCreated', 'no');
    }
  });
};
