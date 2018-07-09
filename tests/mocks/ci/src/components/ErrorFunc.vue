<template>
  <div>
    <button
      id="action"
      @click="action()"
    >
      action
    </button>
    <is-mounted/>
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
