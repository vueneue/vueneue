import { asyncTest } from '../utils';

export default async ({ store }) => {
  store.commit('setMiddleware', await asyncTest('globalMiddleware'));
};
