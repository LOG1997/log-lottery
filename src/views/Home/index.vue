<script setup lang="ts">
import { ref } from 'vue';
import HelloWorld from '../../components/HelloWorld.vue';
import useStore from '@/store/index';
import { useRouter } from 'vue-router';
import { IUser } from '@/types/user';

import { getData } from '@/api/main';
const store = useStore();
const router = useRouter();
const data = ref<any>(null);
const fetchData = async () => {
  const res = await getData({});
  data.value = res;
  console.log('😊data.value:', data.value);
};
store.user.setUserList();
// eslint-disable-next-line no-undef
let user = ref<IUser[]>([]);
const getUser = () => {
  user.value = store.user.getUserList;
  console.log('😊user.value:', user.value);
};
const skip = (url: string) => {
  router.push({
    path: url,
    query: { id: 1 },
  });
};
</script>

<template>
  <div class="flex justify-center">
    <!-- <svg-icon :name="'menu'" class="cursor-pointer svgMenu"></svg-icon> -->
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="../../assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <div class="flex justify-center gap-6">
    <button class="btn btn-primary" @click="getUser">pinia test</button>
    <button class="btn btn-outline btn-secondary" @click="skip('about')"> router test</button>
    <button class="btn glass" @click="fetchData">fetch</button>

  </div>
  <HelloWorld
    class="flex flex-col items-center mx-auto text-center flex-column"
    msg="Vite + Vue"
  />
</template>

<style scoped lang="scss">


.logo {
  height: 10em;
  padding: 1.5em;
  will-change: filter;
  z-index: 0;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}


</style>
