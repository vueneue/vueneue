<template>
  <div>
    <h2>Child</h2>
    <div id="value">{{ value }}</div>
    <div id="middleware">{{ $store.state.middleware }}</div>
    <is-mounted id="child-mounted"/>
  </div>
</template>

<script>
import { asyncTest } from '../utils';

export default {
  async asyncData() {
    return {
      value: await asyncTest('child'),
    };
  },
};
</script>
