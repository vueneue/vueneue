<template>
  <div>
    <div id="value">{{ $store.state.middleware }}</div>
    <is-mounted/>
  </div>
</template>

<script>
import { store } from '../middlewares';

export default {
  middlewares: [store],
};
</script>
