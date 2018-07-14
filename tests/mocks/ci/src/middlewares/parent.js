import { asyncTest } from '../utils';

export default async ({ store }) => {
  store.commit('setParent', await asyncTest('parent'));
};
