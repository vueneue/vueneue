<template>
  <div id="mounted">{{ isMounted }}</div>
</template>

<script>
export default {
  data() {
    return {
      isMounted: false,
    };
  },

  mounted() {
    this.isMounted = true;
  },
};
</script>
