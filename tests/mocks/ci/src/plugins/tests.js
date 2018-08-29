import { asyncTest } from '../utils';

export default async ({ store, appCreated }) => {
  store.commit('setPlugin', await asyncTest('plugin'));

  appCreated(({ store }) => {
    store.commit('setPluginAppCreated', 'yes');
  });
};
