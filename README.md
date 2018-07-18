<p align="center">
  <img src="https://s3.eu-west-2.amazonaws.com/yabab/vueneue.png" alt="VueNeue">
  <br>
  <strong>A new start to build SSR (Server-side rendered) applications with Vue CLI 3.x</strong>
</p>

[![npm version](https://badge.fury.io/js/%40vueneue%2Fvue-cli-plugin-ssr.svg)](https://badge.fury.io/js/%40vueneue%2Fvue-cli-plugin-ssr)
[![TravisCI](https://travis-ci.org/vueneue/vueneue.svg?branch=master)](https://travis-ci.org/vueneue/vueneue)
[![CircleCI](https://circleci.com/gh/vueneue/vueneue/tree/master.svg?style=shield)](https://circleci.com/gh/vueneue/vueneue)
[![AppVeyor](https://ci.appveyor.com/api/projects/status/99ekpjp0nrgnpkwu/branch/master?svg=true)](https://ci.appveyor.com/project/chymz/vueneue/branch/master)

## Documentation

https://vueneue.github.io/docs/

## Packages

- `@vueneue/vue-cli-plugin-ssr`: Vue CLI plugin to quick start a SSR application
- `@vueneue/ssr-core`: Contain main sources for SSR
- `@vueneue/ssr-server`: Koa server used to render pages

## Quick start

**Install**

```bash
vue add @vueneue/ssr
```

This plugins add 4 commands to run or build your application in SSR mode:

**Start a development server with HMR**

```bash
npm run ssr:serve
```

**Build for production**

```bash
npm run ssr:build
```

**Start in production mode** (need a `npm run ssr:build` before)

```bash
npm run ssr:start
```

**Generate static website**

```bash
npm run generate
```

## License

**MIT**: see LICENSE file
