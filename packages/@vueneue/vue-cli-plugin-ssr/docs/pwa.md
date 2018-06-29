# PWA plugin

The PWA built-in plugin will normally include `registerServiceWorker.js` in `src/main` like this:

```js
import './registerServiceWorker';
```

But this is not compatible with SSR, so you need to include it only on client side :

```js
if (process.client) {
  require('./registerServiceWorker');
}
```
