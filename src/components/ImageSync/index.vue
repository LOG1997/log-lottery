<script setup lang='ts'>
import type { IImage } from '@/types/storeType'
import { onMounted, ref } from 'vue'
import { useIndexDb } from '@/hooks/useIndexDb'

interface IProps {
    imgItem: IImage
}
const props = defineProps<IProps>()
const { imageDbStore } = useIndexDb()

const imgUrl = ref('')

async function getImageStoreItem(item: IImage): Promise<string> {
    let image = ''
    if (item.type === 'user') {
        const { id, db: dbName } = item
        const imageData = await imageDbStore.getItem(dbName as string, id as string)
        image = URL.createObjectURL(imageData?.data as Blob)
    }
    else {
        image = item.url as string
    }

    return image
}

onMounted(async () => {
    imgUrl.value = await getImageStoreItem(props.imgItem)
})
</script>

<template>
  <img :src="imgUrl" alt="Image" class="object-cover h-full rounded-xl">
</template>

<style lang='scss' scoped>

</style>
