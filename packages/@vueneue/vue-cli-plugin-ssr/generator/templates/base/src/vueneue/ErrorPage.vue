<template>
  <div class="error-page default-layout">
    <h1>
      <span>Error {{ code }}</span>
    </h1>
    <div class="text-center">
      <p>Whoops !</p>
      <a
        href="/"
        class="button"
        @click.prevent="gotoHome"
      >
        Go to home
      </a>
    </div>
    <pre v-if="error && !isProduction">{{ error.stack || error.message || error }}</pre>
  </div>
</template>

<script>
export default {
  props: {
    statusCode: {
      type: Number,
      default: null,
    },
  },

  data: () => ({
    isProduction: process.prod,
  }),

  computed: {
    current() {
      return this.$store.state.errorHandler;
    },

    code() {
      if (this.statusCode) return this.statusCode;
      else if (this.current) return this.current.statusCode;
      return 500;
    },

    error() {
      if (this.current && this.current.error) return this.current.error;
    },
  },

  methods: {
    gotoHome() {
      this.$store.commit('errorHandler/CLEAR');
      if (this.$router.currentRoute.path != '/') {
        this.$router.replace('/');
      }
    },
  },
};
</script>
