<template>
  <div class="page page--home">
    <nav>
      <router-link to="/about">About</router-link>
    </nav>
    <img src="../assets/logo.png">
    <hello-world msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import HelloWorld from '../components/HelloWorld';

export default {
  head: {
    title: 'Home',
  },
  components: {
    HelloWorld,
  },
};
</script>
