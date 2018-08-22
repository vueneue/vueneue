<template>
  <div>
    <button
      id="error"
      @click="$error('func', 403)"
    >
      error
    </button>
    <button
      id="redirect"
      @click="$redirect('/')"
    >
      redirect
    </button>
    <is-mounted/>
  </div>
</template>
