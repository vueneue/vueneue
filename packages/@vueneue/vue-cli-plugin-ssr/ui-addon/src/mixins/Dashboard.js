export default {
  beforeCreate() {
    // Set store variable to take new modes types
    Vue.set(this.$store.state, 'ssr-build', {
      stats: null,
    });
    Vue.set(this.$store.state, 'ssr-serve', {
      stats: null,
    });
  },

  created() {
    const mode = (this.mode =
      this.TaskDetails.task.command.indexOf('vue-cli-service ssr:serve') !== -1
        ? 'ssr-serve'
        : 'ssr-build');
    this.$store.commit('mode', mode);
    this.syncMode(mode);
  },
};
