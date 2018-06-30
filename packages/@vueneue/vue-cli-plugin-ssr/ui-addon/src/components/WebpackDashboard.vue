<template>
  <component v-if="addonComponent" ref="addonComponent" :is="addonComponent"/>
</template>

<script>
export default {
  inject: ['TaskDetails'],

  data() {
    return {
      addonComponent: null,
    };
  },

  created() {
    this.getComponent();
  },

  mounted() {
    if (!this.addonComponent) {
      const interval = setInterval(() => {
        this.getComponent();
        if (this.addonComponent) {
          clearInterval(interval);
        }
      }, 500);
    }
  },

  methods: {
    getComponent() {
      this.addonComponent = ClientAddonApi.components.get(
        'vue-webpack-dashboard',
      );
      if (this.addonComponent) {
        this.$nextTick(() => {
          this.setupComponent();
        });
      }
    },

    setupComponent() {
      if (this.$refs.addonComponent) {
        const component = this.$refs.addonComponent;

        // Set store variable to take new modes types
        Vue.set(component.$store.state, 'ssr-build', { stats: null });
        Vue.set(component.$store.state, 'ssr-serve', { stats: null });

        const mode = (this.mode =
          this.TaskDetails.task.command.indexOf('vue-cli-service ssr:serve') !==
          -1
            ? 'ssr-serve'
            : 'ssr-build');
        component.$store.commit('mode', mode);
        component.syncMode(mode);
      }
    },
  },
};
</script>
