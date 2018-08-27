<template>
  <div>
    <h1>Error {{ code }}</h1>
    <p>Whoops !</p>

    <a
      v-if="!haveHistory"
      href="/"
      class="button"
      @click.prevent="gotoHome"
    >
      Go to home
    </a>

    <a
      v-else
      href="#"
      class="button"
      @click.prevent="$router.back()"
    >
      Go back
    </a>

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
      return null;
    },

    haveHistory() {
      return process.client && window.history.length > 0;
    },
  },

  methods: {
    gotoHome() {
      this.$store.commit('errorHandler/CLEAR');
      if (this.$router.currentRoute.path !== '/') {
        this.$router.replace('/');
      }
    },
  },
};
</script>
