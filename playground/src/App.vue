<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import viteSvg from '/vite.svg'
import vueSvg from './assets/vue.svg'
console.log("喵");
</script>

<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <!-- <img :src="viteSvg" class="logo" alt="Vite logo" /> -->
      <viteSvg class="logo " />
      <vueSvg />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
