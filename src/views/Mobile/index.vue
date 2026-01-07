<script setup lang='ts'>
import { useViewModel } from './useViewModel'

const { qrCodeImg } = useViewModel()
</script>

<template>
  <div>
    二维码
    <img :src="qrCodeImg" alt="">
  </div>
</template>

<style scoped>

</style>
