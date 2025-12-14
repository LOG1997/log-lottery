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
    <div class="stars-background">
        <!-- 渐变背景 -->
        <div class="gradient-bg"></div>
        
        <!-- 星星动画层 -->
        <div class="bg-animation">
            <div class="stars"></div>
            <div class="stars2"></div>
            <div class="stars3"></div>
        </div>
        
        <!-- 自定义背景图片 -->
        <div class="home-background" v-if="homeBackground.url">
            <img :src="imgUrl" class="w-full h-full object-cover" alt="">
        </div>
        
        <!-- Sparticles 粒子效果 -->
        <div v-if="!homeBackground.url" class="sparticles-layer" ref="starRef"></div>
    </div>
</template>

<style lang='scss' scoped>
.stars-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    z-index: -1;
}

// 渐变背景
.gradient-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
    z-index: 0;
}

// 背景星星动画
.bg-animation {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
}

.stars, .stars2, .stars3 {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: transparent;
}

.stars {
    background-image: radial-gradient(2px 2px at 20px 30px, #eee, transparent),
        radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent),
        radial-gradient(1px 1px at 90px 40px, #fff, transparent),
        radial-gradient(2px 2px at 160px 120px, rgba(255,255,255,0.9), transparent);
    background-size: 200px 200px;
    animation: twinkle 5s ease-in-out infinite;
}

.stars2 {
    background-image: radial-gradient(1px 1px at 50px 80px, #fff, transparent),
        radial-gradient(1px 1px at 100px 150px, rgba(255,255,255,0.7), transparent),
        radial-gradient(2px 2px at 180px 50px, #eee, transparent);
    background-size: 250px 250px;
    animation: twinkle 7s ease-in-out infinite;
    animation-delay: 1s;
}

.stars3 {
    background-image: radial-gradient(1px 1px at 30px 100px, rgba(255,255,255,0.6), transparent),
        radial-gradient(2px 2px at 120px 20px, #fff, transparent);
    background-size: 300px 300px;
    animation: twinkle 9s ease-in-out infinite;
    animation-delay: 2s;
}

@keyframes twinkle {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
}

// 自定义背景图片
.home-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0.6;
    }
}

// Sparticles 粒子层
.sparticles-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 3;
}
</style>
