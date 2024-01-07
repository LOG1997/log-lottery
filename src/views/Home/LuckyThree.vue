<script setup lang="ts">
import { ref, onMounted,computed,watch,toRef } from 'vue'
// import { tableData2 as tableData } from './data'
import { rgba } from '@/utils/color'

import {filterData} from '@/utils'
import * as THREE from 'three'
import {
    CSS3DRenderer, CSS3DObject
} from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import TWEEN from 'three/examples/jsm/libs/tween.module.js';
import useStore from '@/store'

const props=defineProps({
    luckyPersonList:{
        type:Array as ()=>Array<any>,
        default:()=>{[]}
    }
})

// const emits=defineEmits()=

const globalConfig = useStore().globalConfig

const { getLuckyColor: luckyCardColor, getTextColor: textColor, getCardSize: cardSize, getTextSize: textSize, getRowCount: rowCount } = globalConfig
const tableData = computed(()=>{
    console.log('pppppprops:',props.luckyPersonList)
    const cloneData=toRef(props.luckyPersonList)
    
    console.log(props.luckyPersonList,cloneData.value)
    const luckyList=filterData(cloneData.value,Math.floor(rowCount/2))
    console.log('lucskskskskksks:',luckyList)
    
return luckyList
})


const luckyContainerRef = ref<HTMLElement>()

const scene = ref()
const camera = ref()
const renderer = ref()
const controls = ref()
const objects = ref<any[]>([])

const targets = {
    table: <any[]>[],
};


const init = () => {
    const felidView = 40;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspect = width / height;
    const nearPlane = 1;
    const farPlane = 10000;
    const WebGLoutput = luckyContainerRef.value

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
        const element = document.createElement('div');
        element.className = 'lucky-element-card';
        // element.style.backgroundColor = `rgba( 0, 127, 127, ${Math.random() * 0.5 + 0.25} )`;
        element.style.backgroundColor = rgba(luckyCardColor, Math.random() * 0.5 + 0.25)
        element.style.border = `1px solid ${rgba(luckyCardColor, 0.25)}`
        element.style.boxShadow = `0 0 12px ${rgba(luckyCardColor, 0.5)}`
        // hover style
        element.addEventListener('mouseover', function () {
            this.style.border = `1px solid ${rgba(luckyCardColor, 0.75)}`
            this.style.boxShadow = `0 0 12px ${rgba(luckyCardColor, 0.75)}`
        })
        element.addEventListener('mouseout', function () {
            this.style.border = `1px solid ${rgba(luckyCardColor, 0.25)}`
            this.style.boxShadow = `0 0 12px ${rgba(luckyCardColor, 0.5)}`
        })
        element.style.width = `${cardSize.width*2}px`;
        element.style.height = `${cardSize.height*2}px`;

        // element.style.color=localTheme.detail.primary

        const number = document.createElement('div');
        number.className = 'lucky-card-id';
        // number.textContent = (i / 5 + 1).toString();
        number.textContent = tableData.value[i].uid;
        number.style.fontSize = `${textSize}px`;
        element.appendChild(number);

        const symbol = document.createElement('div');
        symbol.className = 'lucky-card-name';
        symbol.textContent = tableData.value[i].name;
        symbol.style.textShadow = `0 0 12px ${rgba(luckyCardColor, 0.95)}`
        symbol.style.fontSize = `${textSize*2}px`;
        element.appendChild(symbol);

        const detail = document.createElement('div');
        detail.className = 'lucky-card-detail';
        detail.innerHTML = `${tableData.value[i].department}<br/>${tableData.value[i].other}`;
        detail.style.fontSize = `${textSize}px`;
        element.appendChild(detail);

        const object = new CSS3DObject(element);
        object.position.x = Math.random() * 4000 - 2000;
        object.position.y = Math.random() * 4000 - 2000;
        object.position.z = Math.random() * 4000 - 2000;
        scene.value.add(object);

        objects.value.push(object);
    }

    createTableVertices();

    function createTableVertices() {
        const tableLen = tableData.value.length;

        for (let i = 0; i < tableLen; i++) {
            const object = new THREE.Object3D();

            object.position.x = tableData.value[i].x * (cardSize.width*2 + 40) - rowCount * 90;
            object.position.y = -tableData.value[i].y * (cardSize.height*2 + 20) + 1000;
            object.position.z = 0;

            targets.table.push(object);
        }
    }

    window.addEventListener('resize', onWindowResize, false);
    transform(targets.table, 2000)
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
            .start();
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


function render() {
    renderer.value.render(scene.value, camera.value);
}

const submit=()=>{
    tableData.value.length=0;
}
onMounted(() => {
});

watch(()=>props.luckyPersonList,()=>{
    luckyContainerRef.value!.style.zIndex='100'
    init();
    animation();
    luckyContainerRef.value!.style.color = `${textColor}`

    console.log('tableData',tableData.value)
},{deep:true})

</script>

<template>
<div class="absolute top-0 w-full h-full bg-gray-400/10 -z-50" ref="luckyContainerRef">
    <button class="btn glass" @click="submit">确定</button>
</div>

</template>

<style scoped lang="scss">

</style>
