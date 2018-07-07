<template>
  <div>
    <div id="value">{{ value }}</div>
    <is-mounted/>
  </div>
</template>

<script>
import { asyncTest } from '../utils';

export default {
  async asyncData() {
    return {
      value: await asyncTest('asyncData'),
    };
  },
};
</script>
