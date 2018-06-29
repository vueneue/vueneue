# TypeScript plugin

Please add this config to your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "allowJs": true
  }
}
```

In `src/main.ts` you need to add `any` type on `ssrContext` variable:

```js
export function createApp(ssrContext: any) {
  // ...
}
```

## Vue class components

A small helper exists in `src/vueclass.ts` to use Vue class components:

```js
import { Vue, Component } from '@/vueclass';

@Component
export class SomePage extends Vue {
  async asyncData() {
    return {
      foo: 'bar',
    };
  }
}
```

You can use decorators from:

- vue-class-component
- vue-property-decorator
- vuex-class
