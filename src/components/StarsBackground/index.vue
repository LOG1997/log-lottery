<script setup lang='ts'>
import Sparticles from 'sparticles';
import { ref, onMounted, onUnmounted } from 'vue';
import { useElementSize } from '@vueuse/core';
import localforage from 'localforage'
const props = defineProps({
    homeBackground: {
        type: Object,
        default: () => ({
            id: '',
            name: '',
            url: ''
        })
    }
})
const imageDbStore = localforage.createInstance({
    name: 'imgStore'
})
const imgUrl = ref('')
const starRef = ref();

const { width, height } = useElementSize(starRef);
let options = ref({ shape: 'star', parallax: 1.2, rotate: true, twinkle: true, speed: 10, count: 200 });
function addSparticles(node: any, width: number, height: number) {
    new Sparticles(node, options.value, width, height);
}
// 页面大小改变时
const listenWindowSize = () => {
    window.addEventListener('resize', () => {
        if (width.value && height.value) {
            addSparticles(starRef.value, width.value, height.value);
        }
    });
}

const getImageStoreItem = async (item: any): Promise<string> => {
    let image = ''
    if (item.url == 'Storage') {
        const key = item.id;
        image = await imageDbStore.getItem(key) as string
    }
    else {
        image = item.url
    }


    return image
}
onMounted(() => {
    getImageStoreItem(props.homeBackground).then((image) => {
        imgUrl.value = image
    })
    addSparticles(starRef.value, width.value, height.value);
    listenWindowSize()
})
onUnmounted(() => {
    window.removeEventListener('resize', listenWindowSize)
})
</script>

<template>
    <div class="home-background w-screen h-screen overflow-hidden" v-if="homeBackground.url">
        <img :src="imgUrl" class="w-full h-full object-cover" alt="">
    </div>
    <div v-else class="w-screen h-screen overflow-hidden" ref="starRef">
    </div>
</template>

<style lang='scss' scoped>

</style>
