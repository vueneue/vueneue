<template>
  <div class="main-view">
    <!-- Router View -->
    <router-view
      v-if="!error"
      :key="$route.fullPath"
    />
    <!-- Error Page -->
    <error-page
      v-else
    />
  </div>
</template>

<script>
import ErrorPage from './ErrorPage.vue';
export default {
  components: {
    ErrorPage,
  },

  computed: {
    error() {
      return this.$store.state.errorHandler.error;
    },
  },
};
</script>
