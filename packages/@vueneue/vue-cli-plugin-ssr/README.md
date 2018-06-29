# @vueneue/vue-cli-plugin-ssr

> A Vue CLI plugin to build SSR (Server-side rendered) applications

![npm (scoped)](https://img.shields.io/npm/v/@vueneue/vue-cli-plugin-ssr.svg?style=flat-square)
![Travis](https://img.shields.io/travis/vueneue/ssr.svg?style=flat-square)

This plugin is heavly based on my personnal [Vue starter](https://github.com/chymz/vue-starter)
but ready for Vue CLI 3.x

## Getting started

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

## Docs

- [TypeScript plugin](docs/typescript.md)
- [PWA plugin](docs/pwa.md)
- [Apollo plugin](docs/apollo.md)

## Features

- Server side rendering
- `asyncData()` to inject data to component or to set data to Vuex (https://chymz.github.io/vue-starter/guide/getting-started.html#async-data-on-page)
- Error dedicated page
- Middlewares system (https://chymz.github.io/vue-starter/guide/getting-started.html#middlewares)
- Vuex action on http request (https://chymz.github.io/vue-starter/guide/ssr.html#onhttprequest-store-action)
- Init function (https://chymz.github.io/vue-starter/guide/getting-started.html#initialize-function)
- Vue UI integration

## Planned features

- Dockerfiles
- Accessibility tools
- Critical CSS
- Pre-rendering (to build static files)
- Others vue cli plugins support
  - Built-in plugins
  - vue-i18n
  - vue-apollo

## Todo list

See [TODO.md](TODO.md)

## License

**MIT**: see [LICENSE](LICENSE) file
