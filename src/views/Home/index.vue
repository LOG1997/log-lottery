<script setup lang="ts">
import { ref, onMounted } from 'vue'
// import { tableData2 as tableData } from './data'
import * as THREE from 'three'
import {
    CSS3DRenderer, CSS3DObject
} from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import TWEEN from 'three/examples/jsm/libs/tween.module.js';
import useStore from '@/store'

const personConfig=useStore().personConfig
const {getAlreadyPersonList:alreadyPersonList,getNotPersonList:notPersonList,getTableRowCount:rowCount}=personConfig
const tableData=ref(
    alreadyPersonList.concat(notPersonList)
)

const containerRef = ref<HTMLElement>()

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
        const element = document.createElement('div');
        element.className = 'element-card';
        element.style.backgroundColor = `rgba( 0, 127, 127, ${Math.random() * 0.5 + 0.25} )`;

        const number = document.createElement('div');
        number.className = 'card-id';
        // number.textContent = (i / 5 + 1).toString();
        number.textContent = tableData.value[i].uid;
        element.appendChild(number);

        const symbol = document.createElement('div');
        symbol.className = 'card-name';
        symbol.textContent = tableData.value[i].name;
        element.appendChild(symbol);

        const detail = document.createElement('div');
        detail.className = 'card-detail';
        detail.innerHTML = `${tableData.value[i].department}<br/>${tableData.value[i].other}`;
        element.appendChild(detail);

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

            object.position.x = tableData.value[i].x * 180 - rowCount*90;
            object.position.y = -tableData.value[i].y * 200 + 1000;
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
    transform(targets.table, 2000)
    render();
}

const transform = (targets: any[], duration: number) => {
    // TWEEN.removeAll();
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
    requestAnimationFrame(animation);
}


function render() {
    renderer.value.render(scene.value, camera.value);
}

onMounted(() => {
    init();
    animation();
});

</script>

<template>
    <div id="container" ref="containerRef">
        <!-- 选中菜单结构 start-->
        <div id="menu">
            <button id="table" @click="transform(targets.table, 2000)">TABLE</button>
            <button id="sphere" @click="transform(targets.sphere, 2000)">SPHERE</button>
            <button id="helix" @click="transform(targets.helix, 2000)">HELIX</button>
        </div>
        <!-- end -->
    </div>
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

button {
    border: none;
    background-color: transparent;
    color: rgba(127, 255, 255, 0.75);
    padding: 12px 24px;
    cursor: pointer;
    outline: 1px solid rgba(127, 255, 255, 0.75);
}

button:hover {
    background-color: rgba(127, 255, 255, 0.5);
}

button:active {
    background-color: rgba(127, 255, 255, 0.75);
}


</style>
