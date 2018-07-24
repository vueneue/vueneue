<template>
  <div>
    <button
      id="error"
      @click="$error('func', 403)"
    >
      error
    </button>
    <is-mounted/>
  </div>
</template>
