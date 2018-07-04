---
extend: '@vue/cli-service/generator/template/src/App.vue'
replace:
  - !!js/regexp /<template>[^]*?<\/template>/
  - !!js/regexp /<script>[^]*?<\/script>/
---

<%# REPLACE %>
<template>
  <div id="app">
    <main-view/>
  </div>
</template>
<%# END_REPLACE %>

<%# REPLACE %>
<script>
import MainView from './vueneue/MainView';

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
<%# END_REPLACE %>
