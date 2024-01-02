<script setup lang="ts">
import { footerList } from './config';
const skip = (url: string) => {
  window.open(url);
};
</script>
<template>
  <div class="footer-container">
    <ul class="flex justify-center">
      <li
        v-for="item in footerList.data"
        :key="item.id"
        @click="skip(item.url)"
        class="flex items-center gap-1 cursor-pointer"
      >
        <svg-icon :name="item.icon"></svg-icon>
        <p>{{ item.name }}</p>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">

</style>
