<template>
  <div>
    <h1>Parent</h1>
    <div id="parent-value">{{ value }}</div>
    <div id="parent">{{ $store.state.parent }}</div>
    <router-view/>
    <is-mounted/>
  </div>
</template>

<script>
import { asyncTest } from '../utils';

export default {
  async asyncData() {
    return {
      value: await asyncTest('parent'),
    };
  },
};
</script>
