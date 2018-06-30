<p align="center">
  <img src="https://s3.eu-west-2.amazonaws.com/yabab/vueneue.png" alt="VueNeue">
  <br>
  <strong>A new start to build SSR (Server-side rendered) applications with Vue CLI 3.x</strong>
</p>

![npm (scoped)](https://img.shields.io/npm/v/@vueneue/vue-cli-plugin-ssr.svg?style=flat-square)
![Travis](https://img.shields.io/travis/vueneue/vueneue.svg?style=flat-square)

## Documentation

https://vueneue.github.io/docs/

## Packages

- `@vueneue/vue-cli-plugin-ssr`: Vue CLI plugin to quick start a SSR application
- `@vueneue/ssr-server`: Koa server used by SSR plugin to render pages

## Quick start

**Install**

```bash
vue add @vueneue/ssr
```

This plugins add 3 commands to run or build your application in SSR mode:

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

## License

**MIT**: see LICENSE file
