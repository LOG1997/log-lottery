<script setup lang="ts">
import { ref, onMounted,onUnmounted, watch } from 'vue'
import PrizeList from './PrizeList.vue'
import { useElementStyle, useElementPosition } from '@/hooks/useElement'
import StarsBackground from '@/components/StarsBackground/index.vue'
import confetti from 'canvas-confetti'
import * as THREE from 'three'
import {
    CSS3DRenderer, CSS3DObject
} from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import TWEEN from 'three/examples/jsm/libs/tween.module.js';
import useStore from '@/store'
import { storeToRefs } from 'pinia'
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';

const toast = useToast();
const personConfig = useStore().personConfig
const globalConfig = useStore().globalConfig
const prizeConfig = useStore().prizeConfig

const { getAlreadyPersonList: alreadyPersonList, getNotPersonList: notPersonList } = storeToRefs(personConfig)
const { getCurrentPrize: currentPrize } = storeToRefs(prizeConfig)
const {getTopTitle:topTitle, getCardColor: cardColor, getTextColor: textColor, getLuckyColor: luckyColor, getCardSize: cardSize, getTextSize: textSize, getRowCount: rowCount } = storeToRefs(globalConfig)
const tableData = ref(JSON.parse(JSON.stringify(alreadyPersonList.value)).concat(JSON.parse(JSON.stringify(notPersonList.value))))

const currentStatus = ref(0) // 0为初始状态， 1为抽奖准备状态，2为抽奖中状态，3为抽奖结束状态
const ballRotationY = ref(0)
const containerRef = ref<HTMLElement>()
// const LuckyViewRef= ref()
const canOperate = ref(true)
const cameraZ = ref(3000)

const scene = ref()
const camera = ref()
const renderer = ref()
const controls = ref()
const objects = ref<any[]>([])

const targets = {
    grid: <any[]>[],
    helix: <any[]>[],
    table: <any[]>[],
    sphere: <any[]>[]
};

const luckyTargets = ref<any[]>([])
const luckyCardList = ref<any[]>([])
const currentPrizeValue=ref(JSON.parse(JSON.stringify(currentPrize.value)))
const init = () => {
    const felidView = 40;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspect = width / height;
    const nearPlane = 1;
    const farPlane = 10000;
    const WebGLoutput = containerRef.value

    scene.value = new THREE.Scene();
    camera.value = new THREE.PerspectiveCamera(felidView, aspect, nearPlane, farPlane);
    camera.value.position.z = cameraZ.value
    // 侦听camera position变化
    // watch(() => camera.value.position.z, (value) => {
    //     console.log('code line-63 \n\r😍 camara posi:\n\r',value);
    //     console.log('code line-63 \n\r😍 camara rrrr:\n\r',camera.value.rotation);

    //     cameraZ.value = value
    // })
    // watch(() => camera.value.rotation.z, (value) => {
    //     console.log('code line-68 \n\r😁 camraea rotation:\n\r',value);

    //     // cameraZ.value = value
    // })
    renderer.value = new CSS3DRenderer()
    renderer.value.setSize(width, height*0.9)
    renderer.value.domElement.style.position = 'absolute';
    // 垂直居中
    renderer.value.domElement.style.paddingTop = '50px'
    renderer.value.domElement.style.top = '50%';
    renderer.value.domElement.style.left = '50%';
    renderer.value.domElement.style.transform = 'translate(-50%, -50%)';
    WebGLoutput!.appendChild(renderer.value.domElement);

    controls.value = new TrackballControls(camera.value, renderer.value.domElement);
    controls.value.rotateSpeed = 1;
    controls.value.staticMoving = true;
    controls.value.minDistance = 500;
    controls.value.maxDistance = 6000;
    controls.value.addEventListener('change', render);

    const tableLen = tableData.value.length
    for (let i = 0; i < tableLen; i++) {
        let element = document.createElement('div');
        element.className = 'element-card';

        const number = document.createElement('div');
        number.className = 'card-id';
        // number.textContent = (i / 5 + 1).toString();
        number.textContent = tableData.value[i].uid;
        // number.style.fontSize = `${textSize * 0.5}px`;
        element.appendChild(number);

        const symbol = document.createElement('div');
        symbol.className = 'card-name';
        symbol.textContent = tableData.value[i].name;
        // symbol.style.textShadow = `0 0 12px ${rgba(cardColor, 0.95)}`
        // symbol.style.fontSize = `${textSize}px`;
        element.appendChild(symbol);

        const detail = document.createElement('div');
        detail.className = 'card-detail';
        detail.innerHTML = `${tableData.value[i].department}<br/>${tableData.value[i].other}`;
        // detail.style.fontSize = `${textSize * 0.5}px`;
        element.appendChild(detail);

        element = useElementStyle(element, cardColor.value, cardSize.value, textSize.value)
        const object = new CSS3DObject(element);
        object.position.x = Math.random() * 4000 - 2000;
        object.position.y = Math.random() * 4000 - 2000;
        object.position.z = Math.random() * 4000 - 2000;
        scene.value.add(object);

        objects.value.push(object);
    }

    createTableVertices();
    createSphereVertices();
    createHelixVertices();

    function createTableVertices() {
        const tableLen = tableData.value.length;

        for (let i = 0; i < tableLen; i++) {
            const object = new THREE.Object3D();

            object.position.x = tableData.value[i].x * (cardSize.value.width + 40) - rowCount.value * 90;
            object.position.y = -tableData.value[i].y * (cardSize.value.height + 20) + 1000;
            object.position.z = 0;

            targets.table.push(object);
        }
    }

    function createSphereVertices() {
        let i = 0;
        const objLength = objects.value.length;
        const vector = new THREE.Vector3();

        for (; i < objLength; ++i) {
            let phi = Math.acos(-1 + (2 * i) / objLength);
            let theta = Math.sqrt(objLength * Math.PI) * phi;
            const object = new THREE.Object3D();

            object.position.x = 800 * Math.cos(theta) * Math.sin(phi);
            object.position.y = 800 * Math.sin(theta) * Math.sin(phi);
            object.position.z = -800 * Math.cos(phi);

            // rotation object 

            vector.copy(object.position).multiplyScalar(2);
            object.lookAt(vector);
            targets.sphere.push(object);
        }
    }
    function createHelixVertices() {
        let i = 0;
        const vector = new THREE.Vector3();
        const objLength = objects.value.length;
        for (; i < objLength; ++i) {
            let phi = i * 0.213 + Math.PI;

            const object = new THREE.Object3D();

            object.position.x = 800 * Math.sin(phi);
            object.position.y = -(i * 8) + 450;
            object.position.z = 800 * Math.cos(phi + Math.PI);

            object.scale.set(1.1, 1.1, 1.1);

            vector.x = object.position.x * 2;
            vector.y = object.position.y;
            vector.z = object.position.z * 2;

            object.lookAt(vector);

            targets.helix.push(object);
        }
    }
    window.addEventListener('resize', onWindowResize, false);
    transform(targets.table, 1000)
    render();
}

const transform = (targets: any[], duration: number) => {
    TWEEN.removeAll();
    const objLength = objects.value.length;
    for (let i = 0; i < objLength; ++i) {
        let object = objects.value[i];
        let target = targets[i];
        new TWEEN.Tween(object.position)
            .to({ x: target.position.x, y: target.position.y, z: target.position.z },
                Math.random() * duration + duration)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();


        new TWEEN.Tween(object.rotation)
            .to({ x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start()
            .onComplete(() => {
                if (luckyCardList.value.length) {
                    luckyCardList.value.forEach((item: any) => {
                        return useElementStyle(item.element, cardColor.value, cardSize.value, textSize.value)
                    })
                }
                luckyCardList.value = [];

                canOperate.value = true
            });
    }

    // 这个补间用来在位置与旋转补间同步执行，通过onUpdate在每次更新数据后渲染scene和camera
    new TWEEN.Tween({})
        .to({}, duration * 2)
        .onUpdate(render)
        .start();
    // 整体自动旋转
}
function onWindowResize() {
    camera.value.aspect = window.innerWidth / window.innerHeight
    camera.value.updateProjectionMatrix();

    renderer.value.setSize(window.innerWidth, window.innerHeight);
    render();
}

/**
* [animation update all tween && controls]
*/
function animation() {
    TWEEN.update();
    controls.value.update();
    // 设置自动旋转
    // console.log('animation',controls.value.target);
    // 设置相机位置
    requestAnimationFrame(animation);
}

// // 旋转的动画
function rollBall(rotateY: number, duration: number) {
    TWEEN.removeAll();

    return new Promise((resolve) => {
        scene.value.rotation.y = 0;
        ballRotationY.value = Math.PI * rotateY * 1000
        const rotateObj = new TWEEN.Tween(scene.value.rotation);
        rotateObj
            .to(
                {
                    // x: Math.PI * rotateX * 1000,
                    x: 0,
                    y: ballRotationY.value,
                    // z: Math.PI * rotateZ * 1000
                    z: 0
                },
                duration * 1000
            )
            .onUpdate(render)
            .start()
            .onStop(() => {
                resolve('')
            })
            .onComplete(() => {
                resolve('')
                canOperate.value = true
            })
    })
}
// 将视野转回正面
function resetCamera() {
    new TWEEN.Tween(camera.value.position)
        .to(
            {
                x: 0,
                y: 0,
                z: 3000
            },
            1000
        )
        .onUpdate(render)
        .start()
        .onComplete(() => {
            new TWEEN.Tween(camera.value.rotation)
                .to(
                    {
                        x: 0,
                        y: 0,
                        z: 0
                    },
                    1000
                )
                .onUpdate(render)
                .start()
                .onComplete(() => {
                    canOperate.value = true // 相机恢复原位
                    // camera.value.lookAt(scene.value.position)
                    camera.value.position.y = 0
                    camera.value.position.x = 0
                    camera.value.position.z = 3000
                    camera.value.rotation.x = 0
                    camera.value.rotation.y = 0
                    camera.value.rotation.z = -0
                    controls.value.reset()
                })
        })
}

function render() {
    renderer.value.render(scene.value, camera.value);
}
const enterLottery = async () => {
    if (!canOperate.value) {
        return
    }
    canOperate.value = false
    transform(targets.sphere, 1000)
    currentStatus.value = 1
    setTimeout(() => {
        rollBall(0.1, 2000)
    }, 2000)
}
// 开始抽奖
const startLottery = () => {
    if (!canOperate.value) {
        return
    }
    currentStatus.value = 2
    rollBall(10, 3000)
}

const stopLottery = async () => {
    if (!canOperate.value) {
        return
    }
    canOperate.value = false
    TWEEN.removeAll();
    rollBall(0, 1)
    currentStatus.value = 0
    const notPersonListLength = notPersonList.value.length;
    
    // 每次最多抽十个
    let luckyCount = 10
    const leftover = currentPrize.value.count - currentPrize.value.isUsedCount
    leftover < luckyCount ? luckyCount = leftover : luckyCount
    if (notPersonListLength < luckyCount) {
        toast.open({
            message: '抽奖人数不够',
            type: 'warning',
            position: 'top-right',
            duration: 10000
        })

        return;
    }

    
    for (let i = 0; i < luckyCount; i++) {
        if (notPersonListLength > 0) {
            const randomIndex = Math.floor(Math.random() * notPersonListLength);
            luckyTargets.value.push(notPersonList.value[randomIndex])

            let LuckyCard = objects.value[randomIndex]
            luckyCardList.value.push(LuckyCard)
        }
    }
    const luckyCardListLength = luckyCardList.value.length;
    const windowSize = { width: window.innerWidth, height: window.innerHeight }
    luckyCardListLength && luckyCardList.value.forEach((item: any, index: number) => {
        item.element = useElementStyle(item.element, luckyColor.value, { width: cardSize.value.width * 2, height: cardSize.value.height * 2 }, textSize.value * 2, 'lucky')
        item = useElementPosition(item, rowCount.value, { width: cardSize.value.width * 2, height: cardSize.value.height * 2 }, windowSize, index)
        new TWEEN.Tween(item.position)
            .to({
                x: item.x,
                y: item.y,
                z: 1000
            }, 700)
            .start()
        new TWEEN.Tween(item.rotation)
            .to({
                x: 0,
                y: 0,
                z: 0
            }, 600)
            .start()
            .onComplete(() => {
                confettiFire()
                resetCamera()
            })
    })
    currentPrizeValue.value.isUsedCount += luckyCount
    if(currentPrizeValue.value.isUsedCount>=currentPrizeValue.value.count){
        currentPrizeValue.value.isUsed=true
    }
    prizeConfig.setCurrentPrize(currentPrizeValue.value)
    prizeConfig.updatePrizeConfig(currentPrizeValue.value)
    personConfig.addAlreadyPersonList(luckyTargets.value, currentPrize.value)
}
// 庆祝动画
const confettiFire = () => {
    var duration = 3 * 1000;
    var end = Date.now() + duration;
    (function frame() {
        // launch a few confetti from the left edge
        confetti({
            particleCount: 2,
            angle: 60,
            spread: 55,
            origin: { x: 0 }
        });
        // and launch a few from the right edge
        confetti({
            particleCount: 2,
            angle: 120,
            spread: 55,
            origin: { x: 1 }
        });

        // keep going until we are out of time
        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
    centerFire(0.25, {
        spread: 26,
        startVelocity: 55,
    });
    centerFire(0.2, {
        spread: 60,
    });
    centerFire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8
    });
    centerFire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2
    });
    centerFire(0.1, {
        spread: 120,
        startVelocity: 45,
    });
}
const centerFire = (particleRatio: number, opts: any) => {
    const count = 200
    confetti({
        origin: { y: 0.7 },
        ...opts,
        particleCount: Math.floor(count * particleRatio)
    });
}
// 监听空格键
const listenSpaceKey=()=>{
    window.addEventListener('keydown', (e) => {
        console.log('code line-468 \n\r😒 e:\n\r',e);
        // 
        
        if (e.code !== 'Space') {
            return
        }
        if(currentStatus.value==0){
            enterLottery()
        }
        else if(currentStatus.value==1){
            startLottery()
        }
        else if(currentStatus.value==2){
            stopLottery()
        }
    })
}
onMounted(() => {
    init();
    animation();
    containerRef.value!.style.color = `${textColor}`
    listenSpaceKey()
});
onUnmounted(() => {
    window.removeEventListener('keydown', listenSpaceKey)
})
watch(()=>currentPrizeValue.value.isUsed,(val)=>{
    if(val){
        currentPrizeValue.value=JSON.parse(JSON.stringify(currentPrize.value))
    }
})
</script>

<template>
    
    <h2 class="absolute w-full pt-12 m-0 font-mono tracking-wide text-center leading-12" :style="{fontSize:textSize*1.5+'px',color:textColor}">{{ topTitle }}</h2>
    <div id="container" ref="containerRef" class="3dContainer">
        
        <!-- 选中菜单结构 start-->
        <div id="menu">
            <button class="btn glass" @click="enterLottery" v-if="currentStatus == 0">进入抽奖</button>

            <button class="btn glass" @click="startLottery" v-if="currentStatus == 1">开始</button>

            <button class="btn glass" @click="stopLottery" v-if="currentStatus == 2">结束</button>


            <!--   <button id="table" @click="transform(targets.table, 2000)">TABLE</button> -->
            <!--  <button id="helix" @click="transform(targets.helix, 2000)">HELIX</button> -->

        </div>
        <!-- end -->
    </div>
    <StarsBackground></StarsBackground>

    <!-- <LuckyView :luckyPersonList="luckyTargets"  ref="LuckyViewRef"></LuckyView> -->
    <!-- <PlayMusic class="absolute right-0 bottom-1/2"></PlayMusic> -->
    <PrizeList class="absolute left-0 top-32"></PrizeList>
</template>

<style scoped lang="scss">
#menu {
    position: absolute;
    z-index: 100;
    width: 100%;
    bottom: 50px;
    text-align: center;
    font-size: 32px;
}
</style>
