import { asyncTest } from './utils';

export const child = async ({ store }) => {
  store.commit('setMiddleware', await asyncTest('child'));
};

export const error = async () => {
  throw new Error('middleware');
};

export const errorFunc = async ({ error }) => {
  error('middleware-error-func', 403);
};

export const global = async ({ store }) => {
  store.commit('setMiddleware', await asyncTest('globalMiddleware'));
};

export const parent = async ({ store }) => {
  store.commit('setParent', await asyncTest('parent'));
};

export const redirect = async ({ redirect }) => {
  redirect('/');
};

export const store = async ({ store }) => {
  store.commit('setMiddleware', await asyncTest('routeMiddleware'));
};
