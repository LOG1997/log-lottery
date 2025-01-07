<script setup lang="ts">
import ToTop from '@/components/ToTop/index.vue'
import { useScroll } from '@vueuse/core'
// import Header from './Header/index.vue';
// import Footer from './Footer/index.vue';
import { ref } from 'vue'

const mainContainer = ref<HTMLElement | null>(null)

const { y } = useScroll(mainContainer)

function scrollToTop() {
  y.value = 0
}
</script>

<template>
  <div class="w-screen">
    <!-- <header class="shadow-2xl head-container h-14">
      <Header></Header>
    </header> -->
    <ToTop v-if="y > 400" @click="scrollToTop" />
    <main ref="mainContainer" class="box-content w-screen h-screen overflow-x-hidden overflow-y-auto main-container">
      <router-view class="h-full main-container-content" />
    </main>
    <!-- <footer class="w-screen footer-container">
      <Footer></Footer>
    </footer> -->
  </div>
</template>

<style scoped lang="scss">

</style>
