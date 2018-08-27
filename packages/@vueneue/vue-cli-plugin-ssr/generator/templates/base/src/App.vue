<template>
  <div id="app">
    <app-view/>
  </div>
</template>

<script>
import AppView from './AppView.vue';

export default {
  components: {
    AppView,
  },
  head: {
    titleTemplate(title) {
      if (title) return `${title} | VueNeue`;
      return 'VueNeue';
    },
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ],
  },
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
