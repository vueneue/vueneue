<template>
  <div id="app">
    <main-view/>
  </div>
</template>

<script>
import MainView from './vueneue/components/MainView';

export default {
  components: {
    MainView,
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
body,
html {
  margin: 0;
  padding: 0;
  font-family: Arial, Helvetica, sans-serif;
}

h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

nav {
  padding: 10px;
}

.page {
  text-align: center;
}
</style>
