<script setup lang='ts'>
interface Props {
    fileType: 'img' | 'audio' | 'video' | 'json' | 'file'
}
const props = withDefaults(defineProps<Props>(), {

})
</script>

<template>
  <div>
    <img src="" alt="">
  </div>
</template>

<style scoped>

</style>
