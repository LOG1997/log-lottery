<script setup lang='ts'>
import localforage from 'localforage'
import { onMounted, ref } from 'vue'

const props = defineProps({
  imgItem: {
    type: Object,
    default: () => ({}),
  },
})
const imageDbStore = localforage.createInstance({
  name: 'imgStore',
})

const imgUrl = ref('')

async function getImageStoreItem(item: any): Promise<string> {
  let image = ''
  if (item.url === 'Storage') {
    const key = item.id
    image = await imageDbStore.getItem(key) as string
  }
  else {
    image = item.url
  }

  return image
}

onMounted(async () => {
  const image = await getImageStoreItem(props.imgItem)
  imgUrl.value = image
})
</script>

<template>
  <img :src="imgUrl" alt="Image" class="object-cover h-full rounded-xl">
</template>

<style lang='scss' scoped>

</style>
