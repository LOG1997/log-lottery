<script setup lang="ts">
// import Header from './Header/index.vue';
// import Footer from './Footer/index.vue';
</script>

<template>
  <div class="w-screen">
    <!-- <header class="shadow-2xl head-container h-14">
      <Header></Header>
    </header> -->
    <main class="box-content w-screen h-screen overflow-x-hidden overflow-y-auto main-container">
      <router-view class="h-full main-container-content"></router-view>
    </main>
    <!-- <footer class="w-screen footer-container">
      <Footer></Footer>
    </footer> -->
  </div>
</template>
<style scoped lang="scss">

</style>
