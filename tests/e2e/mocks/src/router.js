import { asyncTest } from './utils';

import Router from 'vue-router';

export default () => {
  return new Router({
    mode: process.ssr ? 'history' : 'hash',
    routes: [
      {
        path: '/',
        component: () => import('./components/Home'),
      },
      {
        path: '/async-data',
        component: () => import('./components/AsyncData'),
      },
      {
        path: '/async-data-store',
        component: () => import('./components/AsyncDataStore'),
      },
      {
        path: '/async-data-error',
        component: () => import('./components/AsyncDataError'),
      },
      {
        path: '/redirect',
        component: () => import('./components/Redirect'),
      },
      {
        path: '/error',
        component: () => import('./components/ErrorFunc'),
      },
      {
        path: '/global-middleware',
        component: () => import('./components/Middlewares'),
      },
      {
        path: '/route-middleware',
        component: () => import('./components/Middlewares'),
        meta: {
          middlewares: [
            async ({ store }) => {
              store.commit('setMiddleware', await asyncTest('routeMiddleware'));
            },
          ],
        },
      },
      {
        path: '/middleware-redirect',
        component: () => import('./components/Middlewares'),
        meta: {
          middlewares: [
            async ({ redirect }) => {
              redirect('/');
            },
          ],
        },
      },
      {
        path: '/middleware-error',
        component: () => import('./components/Middlewares'),
        meta: {
          middlewares: [
            async () => {
              throw new Error('middleware');
            },
          ],
        },
      },
      {
        path: '/middleware-error-func',
        component: () => import('./components/Middlewares'),
        meta: {
          middlewares: [
            async ({ error }) => {
              error('middleware-error-func', 403);
            },
          ],
        },
      },
      {
        path: '/nested',
        component: () => import('./components/Parent'),
        meta: {
          middlewares: [
            async ({ store }) => {
              store.commit('setParent', await asyncTest('parent'));
            },
          ],
        },
        children: [
          {
            path: '/',
            component: () => import('./components/NestedAsyncData'),
            meta: {
              middlewares: [
                async ({ store }) => {
                  store.commit('setMiddleware', await asyncTest('child'));
                },
              ],
            },
          },
        ],
      },
    ],
  });
};
