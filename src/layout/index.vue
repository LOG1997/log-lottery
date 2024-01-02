<script setup lang="ts">
import Header from './Header/index.vue';
import Footer from './Footer/index.vue';
</script>

<template>
  <div class="w-screen">
    <header class="shadow-2xl head-container h-14">
      <Header></Header>
    </header>
    <main class="main-container w-screen box-content min-h-[calc(100vh-10rem)]">
      <router-view class="main-container-content"></router-view>
    </main>
    <footer class="w-screen footer-container">
      <Footer></Footer>
    </footer>
  </div>
</template>
<style scoped lang="scss">

</style>
