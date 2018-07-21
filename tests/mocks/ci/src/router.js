import Vue from 'vue';
import Router from 'vue-router';
import { asyncTest } from './utils';
import IsMounted from './components/IsMounted';

Vue.component('is-mounted', IsMounted);

export default () => {
  return new Router({
    mode: process.ssr ? 'history' : 'hash',
    routes: [
      {
        path: '/',
        component: () => import('./components/Home'),
      },
      {
        path: '/on-http-request-error',
        component: () => import('./components/OnHttpRequestError'),
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
        component: () => import('./components/MiddlewaresGlobal'),
      },
      {
        path: '/route-middleware',
        component: () => import('./components/Middlewares'),
      },
      {
        path: '/middleware-redirect',
        component: () => import('./components/MiddlewaresRedirect'),
      },
      {
        path: '/middleware-error',
        component: () => import('./components/MiddlewaresError'),
      },
      {
        path: '/middleware-error-func',
        component: () => import('./components/MiddlewaresErrorFunc'),
      },
      {
        path: '/nested',
        component: () => import('./components/Parent'),
        children: [
          {
            path: '/',
            component: () => import('./components/NestedAsyncData'),
          },
        ],
      },
      {
        path: '/plugin',
        component: () => import('./components/PluginTest'),
      },
      /**
       * SPA routes
       */
      {
        path: '/spa',
        component: () => import('./components/Spa'),
        children: [
          {
            path: '',
            component: () => import('./components/Home'),
          },
          {
            path: 'on-http-request-error',
            component: () => import('./components/OnHttpRequestError'),
          },
          {
            path: 'async-data',
            component: () => import('./components/AsyncData'),
          },
          {
            path: 'async-data-store',
            component: () => import('./components/AsyncDataStore'),
          },
          {
            path: 'async-data-error',
            component: () => import('./components/AsyncDataError'),
          },
          {
            path: 'redirect',
            component: () => import('./components/Redirect'),
          },
          {
            path: 'error',
            component: () => import('./components/ErrorFunc'),
          },
          {
            path: 'global-middleware',
            component: () => import('./components/MiddlewaresGlobal'),
          },
          {
            path: 'route-middleware',
            component: () => import('./components/Middlewares'),
          },
          {
            path: 'middleware-redirect',
            component: () => import('./components/MiddlewaresRedirect'),
          },
          {
            path: 'middleware-error',
            component: () => import('./components/MiddlewaresError'),
          },
          {
            path: 'middleware-error-func',
            component: () => import('./components/MiddlewaresErrorFunc'),
          },
          {
            path: 'nested',
            component: () => import('./components/Parent'),
            children: [
              {
                path: '/',
                component: () => import('./components/NestedAsyncData'),
              },
            ],
          },
          {
            path: 'plugin',
            component: () => import('./components/PluginTest'),
          },
        ],
      },
    ],
  });
};
