<script setup lang="ts">
import { ref, onMounted } from 'vue'
// import { tableData2 as tableData } from './data'
import { rgba } from '@/utils/color'
// import PlayMusic from './PlayMusic.vue'
import PrizeList from './PrizeList.vue'
import { useElementStyle } from '@/hooks/useElement'
import StarsBackground from '@/components/StarsBackground/index.vue'
import LuckyView from './LuckyThree.vue'
import * as THREE from 'three'
import {
    CSS3DRenderer, CSS3DObject
} from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import TWEEN from 'three/examples/jsm/libs/tween.module.js';
import useStore from '@/store'


const personConfig = useStore().personConfig
const globalConfig = useStore().globalConfig
const prizeConfig = useStore().prizeConfig

const { getAlreadyPersonList: alreadyPersonList, getNotPersonList: notPersonList } = personConfig
const { getCurrentPrize: currentPrize } = prizeConfig
const { getCardColor: cardColor, getTextColor: textColor, getCardSize: cardSize, getTextSize: textSize, getRowCount: rowCount } = globalConfig
const tableData = ref(
    alreadyPersonList.concat(notPersonList)
)

const currentStatus = ref(0) // 0为初始状态， 1为抽奖准备状态，2为抽奖中状态，3为抽奖结束状态
const ballRotationY = ref(0)
const containerRef = ref<HTMLElement>()
// const LuckyViewRef= ref()

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
    camera.value.position.z = 3000;

    renderer.value = new CSS3DRenderer()
    renderer.value.setSize(width, height)
    renderer.value.domElement.style.position = 'absolute';
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
        // element.style.backgroundColor = `rgba( 0, 127, 127, ${Math.random() * 0.5 + 0.25} )`;
        // element.style.backgroundColor = rgba(cardColor, Math.random() * 0.5 + 0.25)
        // element.style.border = `1px solid ${rgba(cardColor, 0.25)}`
        // element.style.boxShadow = `0 0 12px ${rgba(cardColor, 0.5)}`
        // element.style.width = `${cardSize.width}px`;
        // element.style.height = `${cardSize.height}px`;
        // element.addEventListener('mouseover', function () {
        //     console.log(this)
        //     this.style.border = `1px solid ${rgba(cardColor, 0.75)}`
        //     this.style.boxShadow = `0 0 12px ${rgba(cardColor, 0.75)}`
        // })
        // element.addEventListener('mouseout', function () {
        //     this.style.border = `1px solid ${rgba(cardColor, 0.25)}`
        //     this.style.boxShadow = `0 0 12px ${rgba(cardColor, 0.5)}`
        // })
        // hover style


        // element.style.color=localTheme.detail.primary

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

        element = useElementStyle(element, cardColor, cardSize, textSize)
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

            object.position.x = tableData.value[i].x * (cardSize.width + 40) - rowCount * 90;
            object.position.y = -tableData.value[i].y * (cardSize.height + 20) + 1000;
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
                        return useElementStyle(item.element, cardColor, { width: cardSize.width, height: cardSize.height }, textSize)
                    })
                }
                luckyCardList.value = [];
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

// // 自动旋转的动画
function rollBall(rotateY: number, duration: number, mod: 'default' | 'restore' = 'default') {
    TWEEN.removeAll();

    return new Promise((resolve, reject) => {
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
                scene.value.rotation.y = 0;
                resolve('')
            })
            .onComplete(() => {
                resolve('')
            })
    })
}


function render() {
    renderer.value.render(scene.value, camera.value);
}
const enterLottery = async () => {
    transform(targets.sphere, 1000)
    currentStatus.value = 1
    // setTimeout(() => {
    //     rollBall(0.1,3000)
    // }, 3000)
}
// 开始抽奖
const startLottery = () => {
    currentStatus.value = 2
    rollBall(10, 3000)
}

const stopLottery = async () => {
    TWEEN.removeAll();
    rollBall(0, 1)
    // scene正面
    currentStatus.value = 0
    // 从notPersonList随机抽取currentPrize.count个
    const notPersonListLength = notPersonList.length;
    for (let i = 0; i < currentPrize.count; i++) {
        if (notPersonListLength > 0) {
            const randomIndex = Math.floor(Math.random() * notPersonListLength);
            luckyTargets.value.push(notPersonList[randomIndex])

            let LuckyCard = objects.value[randomIndex]
            console.log(LuckyCard)
            LuckyCard.element = useElementStyle(LuckyCard.element, '#ffd700', { width: cardSize.width * 2, height: cardSize.height * 2 }, textSize * 2, 'lucky')
            // 重新设置位置
            LuckyCard.position.x = 100
            LuckyCard.position.y = 300
            LuckyCard.position.z = 0
            // LuckyCard.rotation.x = 0
            // LuckyCard.rotation.y = 0
            // LuckyCard.rotation.z = 0
            new TWEEN.Tween(LuckyCard.position)
                .to({
                    x: LuckyCard.x,
                    y: LuckyCard.y,
                    z: 1200
                }, 1000)
                .start()
            new TWEEN.Tween(LuckyCard.rotation)
                .to({
                    x: 0,
                    y: 0,
                    z: 0
                }, 1000)
                .start()
            luckyCardList.value.push(LuckyCard)
        }
    }

    personConfig.addAlreadyPersonList(luckyTargets.value)
}

onMounted(() => {
    init();
    animation();
    containerRef.value!.style.color = `${textColor}`
});

</script>

<template>
    <div id="container" ref="containerRef">
        <!-- 选中菜单结构 start-->
        <div id="menu">
            <button class="btn glass" @click="enterLottery" v-if="currentStatus == 0">进入抽奖</button>

            <button class="btn glass" @click="startLottery" v-if="currentStatus == 1">开始</button>

            <button class="btn glass" @click="stopLottery" v-if="currentStatus == 2">结束</button>
            <button id="table" @click="transform(targets.table, 2000)">TABLE</button>
            <button id="helix" @click="transform(targets.helix, 2000)">HELIX</button>

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
