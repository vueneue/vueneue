<template>
  <div id="app">
    <app-view/>

    <ul>
      <li><router-link to="/">home</router-link></li>
      <li><router-link to="/async-data">async-data</router-link></li>
      <li><router-link to="/async-data-store">async-data-store</router-link></li>
      <li><router-link to="/async-data-error">async-data-error</router-link></li>
      <li><router-link to="/redirect">redirect</router-link></li>
      <li><router-link to="/helpers">helpers</router-link></li>
      <li><router-link to="/not-found">not-found</router-link></li>
      <li><router-link to="/global-middleware">global-middleware</router-link></li>
      <li><router-link to="/route-middleware">route-middleware</router-link></li>
      <li><router-link to="/middleware-redirect">middleware-redirect</router-link></li>
      <li><router-link to="/middleware-error">middleware-error</router-link></li>
      <li><router-link to="/middleware-error-func">middleware-error-func</router-link></li>
      <li><router-link to="/nested">nested</router-link></li>
      <li><router-link to="/plugin">plugin</router-link></li>
    </ul>

    <ul>
      <li><router-link to="/spa">home</router-link></li>
      <li><router-link to="/spa/async-data">async-data</router-link></li>
      <li><router-link to="/spa/async-data-store">async-data-store</router-link></li>
      <li><router-link to="/spa/async-data-error">async-data-error</router-link></li>
      <li><router-link to="/spa/redirect">redirect</router-link></li>
      <li><router-link to="/spa/helpers">helpers</router-link></li>
      <li><router-link to="/spa/not-found">not-found</router-link></li>
      <li><router-link to="/spa/global-middleware">global-middleware</router-link></li>
      <li><router-link to="/spa/route-middleware">route-middleware</router-link></li>
      <li><router-link to="/spa/middleware-redirect">middleware-redirect</router-link></li>
      <li><router-link to="/spa/middleware-error">middleware-error</router-link></li>
      <li><router-link to="/spa/middleware-error-func">middleware-error-func</router-link></li>
      <li><router-link to="/spa/nested">nested</router-link></li>
      <li><router-link to="/spa/plugin">plugin</router-link></li>
    </ul>
  </div>
</template>

<script>
import AppView from './AppView';

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
