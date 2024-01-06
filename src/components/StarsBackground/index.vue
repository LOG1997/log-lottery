<script setup lang='ts'>
import Sparticles from 'sparticles';
import {ref,onMounted,onUnmounted} from 'vue';
import { useElementSize } from '@vueuse/core';

const starRef=ref();

const { width, height}=useElementSize(starRef);
let options = ref({ shape: 'star',parallax:1.2,rotate:true,twinkle:true, speed: 10,count:200 });
function addSparticles(node:any,width:number,height:number) {
     new Sparticles(node, options.value,width,height);
}
// 页面大小改变时
const listenWindowSize=()=>{
    window.addEventListener('resize',()=>{
        if (width.value && height.value) {
            addSparticles(starRef.value,width.value,height.value);
        }
    });
}

onMounted(()=>{
    addSparticles(starRef.value,width.value,height.value);
    listenWindowSize()
})
onUnmounted(()=>{
    window.removeEventListener('resize',listenWindowSize)
})

</script>

<template>
    <div class="w-screen h-screen overflow-hidden bg-transparent" ref="starRef">
    </div>
</template>

<style lang='scss' scoped></style>
