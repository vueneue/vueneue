<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
      For guide and recipes on how to configure / customize this project,<br>
      check out the
      <a
        href="https://cli.vuejs.org"
        target="_blank">vue-cli documentation</a>.
    </p>
    <h3>Essential Links</h3>
    <ul>
      <li><a
        href="https://vuejs.org"
        target="_blank">Core Docs</a></li>
      <li><a
        href="https://forum.vuejs.org"
        target="_blank">Forum</a></li>
      <li><a
        href="https://chat.vuejs.org"
        target="_blank">Community Chat</a></li>
      <li><a
        href="https://twitter.com/vuejs"
        target="_blank">Twitter</a></li>
    </ul>
    <h3>Ecosystem</h3>
    <ul>
      <li><a
        href="https://router.vuejs.org"
        target="_blank">vue-router</a></li>
      <li><a
        href="https://vuex.vuejs.org"
        target="_blank">vuex</a></li>
      <li><a
        href="https://github.com/vuejs/vue-devtools#vue-devtools"
        target="_blank">vue-devtools</a></li>
      <li><a
        href="https://vue-loader.vuejs.org"
        target="_blank">vue-loader</a></li>
      <li><a
        href="https://github.com/vuejs/awesome-vue"
        target="_blank">awesome-vue</a></li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    msg: {
      type: String,
      default: '',
    },
  },
};
</script>
