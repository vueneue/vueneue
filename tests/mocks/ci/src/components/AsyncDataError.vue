<template>
  <div>
    <div id="value">{{ $store.state.value }}</div>
  </div>
</template>

<script>
import { asyncTest } from '../utils';

export default {
  async asyncData() {
    await asyncTest(null, new Error('asyncDataError'));
  },
};
</script>
