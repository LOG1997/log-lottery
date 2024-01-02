<script setup lang="ts">
import { ref } from 'vue';

defineProps<{ msg: string }>();

const count = ref(0);
const addCount = () => {
  count.value++;
};
</script>

<template>
  <div>
    <h1 class="text-4xl font-bold py-6">{{ msg }}</h1>

    <div class="card w-1200px">
      <button
        class="w-32 py-2 px-3 rounded-lg mx-auto my-3"
        type="button"
        @click="addCount"
      >
        count is {{ count }}
      </button>
      <p>
        Edit
        <code>components/HelloWorld.vue</code> to test HMR
      </p>
    </div>

    <p>
      Check out
      <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
        >create-vue</a
      >, the official Vue + Vite starter
    </p>
    <p>
      Install
      <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a>
      in your IDE for a better DX
    </p>
    <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
  </div>
</template>

<style scoped lang="scss">
// @import "@/style/global.scss";
.read-the-docs {
  color: #888;
}
button {
  background-color: cornflowerblue;
}
</style>
