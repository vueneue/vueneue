# Apollo plugin

**Temporary fix**

1.  Add vue-apollo client to transpile dependencies in `vue.config.js`

```js
module.exports = {
  // ...
  transpileDependencies: [/vue-cli-plugin-apollo\/graphql-client\/dist/],
  // ...
};
```

2.  Install `isomorphic-fetch`

```bash
npm i -S isomorphic-fetch
```

3.  Change configuration in `src/vue-apollo.js`

```js
// Add isomorphic-fetch to build
import 'isomorphic-fetch';
// ...
const defaultOptions = {
  // ...
  // Enable SSR on server side
  ssr: !!process.server,
  // ...
};
// ...
```

4.  Comment `localStorage` lines in `src/vue-apollo.js`
