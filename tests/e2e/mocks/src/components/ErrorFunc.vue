<template>
  <div>
    <button
      id="action"
      @click="action()"
    >
      action
    </button>
  </div>
</template>

<script>
export default {
  methods: {
    action() {
      this.$error('func', 403);
    },
  },
};
</script>
