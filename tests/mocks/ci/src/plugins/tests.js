import { asyncTest } from '../utils';

export default async ({ store }) => {
  store.commit('setPlugin', await asyncTest('plugin'));
};
