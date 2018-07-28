<template>
  <div>
    <h1>Home</h1>
    <div id="value">{{ $store.state.httpRequest }}</div>
    <is-mounted/>
  </div>
</template>

<style scoped>
h1 {
  color: red;
}
</style>
