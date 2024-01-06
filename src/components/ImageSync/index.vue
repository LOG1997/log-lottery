<script setup lang='ts'>
import {ref,onMounted} from 'vue'
import localforage from 'localforage'
const props=defineProps({
  imgItem: {
    type:Object,
    default:()=>({})
  },
})
const imageDbStore = localforage.createInstance({
    name: 'imgStore'
})

const imgUrl=ref('')


const getImageStoreItem=async (item:any)=>{
    const key=item.id;
     const image=await imageDbStore.getItem(key)
     
return image
}

onMounted(async ()=>{
    const image=await getImageStoreItem(props.imgItem)
    imgUrl.value=image
})
</script>

<template>
    <img :src="imgUrl" Alt="Image"/>
</template>

<style lang='scss' scoped>

</style>
