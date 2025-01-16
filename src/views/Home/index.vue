<script setup lang="ts">
import type { IPersonConfig } from '@/types/storeType'
import type { Material } from 'three'
import StarsBackground from '@/components/StarsBackground/index.vue'
import { useElementPosition, useElementStyle } from '@/hooks/useElement'
import i18n from '@/locales/i18n'
import useStore from '@/store'
import { filterData, selectCard } from '@/utils'
import { rgba } from '@/utils/color'
import * as TWEEN from '@tweenjs/tween.js'
import confetti from 'canvas-confetti'
import { storeToRefs } from 'pinia'
import { Object3D, PerspectiveCamera, Scene, Vector3 } from 'three'
import { CSS3DObject, CSS3DRenderer } from 'three-css3d'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js'
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toast-notification'
import PrizeList from './PrizeList.vue'
import 'vue-toast-notification/dist/theme-sugar.css'

const { t } = useI18n()
const toast = useToast()
const router = useRouter()
const personConfig = useStore().personConfig
const globalConfig = useStore().globalConfig
const prizeConfig = useStore().prizeConfig

const { getAllPersonList: allPersonList, getNotPersonList: notPersonList, getNotThisPrizePersonList: notThisPrizePersonList,
} = storeToRefs(personConfig)
const { getCurrentPrize: currentPrize } = storeToRefs(prizeConfig)
const { getTopTitle: topTitle, getCardColor: cardColor, getPatterColor: patternColor, getPatternList: patternList, getTextColor: textColor, getLuckyColor: luckyColor, getCardSize: cardSize, getTextSize: textSize, getRowCount: rowCount, getBackground: homeBackground, getIsShowAvatar: isShowAvatar } = storeToRefs(globalConfig)
const tableData = ref<any[]>([])
const currentStatus = ref(0) // 0为初始状态， 1为抽奖准备状态，2为抽奖中状态，3为抽奖结束状态
const ballRotationY = ref(0)
const containerRef = ref<HTMLElement>()
const canOperate = ref(true)
const cameraZ = ref(3000)

const scene = ref()
const camera = ref()
const renderer = ref()
const controls = ref()
const objects = ref<any[]>([])
interface TargetType {
  grid: any[]
  helix: any[]
  table: any[]
  sphere: any[]
}
const targets: TargetType = {
  grid: [],
  helix: [],
  table: [],
  sphere: [],
}

const luckyTargets = ref<any[]>([])
const luckyCardList = ref<number[]>([])
const luckyCount = ref(10)
const personPool = ref<IPersonConfig[]>([])

const intervalTimer = ref<any>(null)
// 填充数据，填满七行
function initTableData() {
  if (allPersonList.value.length <= 0) {
    return
  }
  const totalCount = rowCount.value * 7
  const originPersonData = JSON.parse(JSON.stringify(allPersonList.value))
  const originPersonLength = originPersonData.length
  if (originPersonLength < totalCount) {
    const repeatCount = Math.ceil(totalCount / originPersonLength)
    // 复制数据
    for (let i = 0; i < repeatCount; i++) {
      tableData.value = tableData.value.concat(JSON.parse(JSON.stringify(originPersonData)))
    }
  }
  else {
    tableData.value = originPersonData.slice(0, totalCount)
  }
  tableData.value = filterData(tableData.value.slice(0, totalCount), rowCount.value)
}
function init() {
  const felidView = 40
  const width = window.innerWidth
  const height = window.innerHeight
  const aspect = width / height
  const nearPlane = 1
  const farPlane = 10000
  const WebGLoutput = containerRef.value

  scene.value = new Scene()
  camera.value = new PerspectiveCamera(felidView, aspect, nearPlane, farPlane)
  camera.value.position.z = cameraZ.value
  renderer.value = new CSS3DRenderer()
  renderer.value.setSize(width, height * 0.9)
  renderer.value.domElement.style.position = 'absolute'
  // 垂直居中
  renderer.value.domElement.style.paddingTop = '50px'
  renderer.value.domElement.style.top = '50%'
  renderer.value.domElement.style.left = '50%'
  renderer.value.domElement.style.transform = 'translate(-50%, -50%)'
  WebGLoutput!.appendChild(renderer.value.domElement)

  controls.value = new TrackballControls(camera.value, renderer.value.domElement)
  controls.value.rotateSpeed = 1
  controls.value.staticMoving = true
  controls.value.minDistance = 500
  controls.value.maxDistance = 6000
  controls.value.addEventListener('change', render)

  const tableLen = tableData.value.length
  for (let i = 0; i < tableLen; i++) {
    let element = document.createElement('div')
    element.className = 'element-card'

    const number = document.createElement('div')
    number.className = 'card-id'
    number.textContent = tableData.value[i].uid
    if(isShowAvatar.value) number.style.display = 'none'
    element.appendChild(number)

    const symbol = document.createElement('div')
    symbol.className = 'card-name'
    symbol.textContent = tableData.value[i].name
    if(isShowAvatar.value) symbol.className = 'card-name card-avatar-name'
    element.appendChild(symbol)

    const detail = document.createElement('div')
    detail.className = 'card-detail'
    detail.innerHTML = `${tableData.value[i].department}<br/>${tableData.value[i].identity}`
    if(isShowAvatar.value) detail.style.display = 'none'
    element.appendChild(detail)

    const avatar = document.createElement('img');
    avatar.className = 'card-avatar';
    avatar.src = tableData.value[i].avatar;
    avatar.alt = 'avatar';
    avatar.style.width = '140px';
    avatar.style.height = '140px';
    if(!isShowAvatar.value) avatar.style.display = 'none'
    element.appendChild(avatar);

    element = useElementStyle(element, tableData.value[i], i, patternList.value, patternColor.value, cardColor.value, cardSize.value, textSize.value)
    const object = new CSS3DObject(element)
    object.position.x = Math.random() * 4000 - 2000
    object.position.y = Math.random() * 4000 - 2000
    object.position.z = Math.random() * 4000 - 2000
    scene.value.add(object)

    objects.value.push(object)
  }

  createTableVertices()
  createSphereVertices()
  createHelixVertices()

  function createTableVertices() {
    const tableLen = tableData.value.length

    for (let i = 0; i < tableLen; i++) {
      const object = new Object3D()

      object.position.x = tableData.value[i].x * (cardSize.value.width + 40) - rowCount.value * 90
      object.position.y = -tableData.value[i].y * (cardSize.value.height + 20) + 1000
      object.position.z = 0

      targets.table.push(object)
    }
  }

  function createSphereVertices() {
    let i = 0
    const objLength = objects.value.length
    const vector = new Vector3()

    for (; i < objLength; ++i) {
      const phi = Math.acos(-1 + (2 * i) / objLength)
      const theta = Math.sqrt(objLength * Math.PI) * phi
      const object = new Object3D()

      object.position.x = 800 * Math.cos(theta) * Math.sin(phi)
      object.position.y = 800 * Math.sin(theta) * Math.sin(phi)
      object.position.z = -800 * Math.cos(phi)

      // rotation object

      vector.copy(object.position).multiplyScalar(2)
      object.lookAt(vector)
      targets.sphere.push(object)
    }
  }
  function createHelixVertices() {
    let i = 0
    const vector = new Vector3()
    const objLength = objects.value.length
    for (; i < objLength; ++i) {
      const phi = i * 0.213 + Math.PI

      const object = new Object3D()

      object.position.x = 800 * Math.sin(phi)
      object.position.y = -(i * 8) + 450
      object.position.z = 800 * Math.cos(phi + Math.PI)

      object.scale.set(1.1, 1.1, 1.1)

      vector.x = object.position.x * 2
      vector.y = object.position.y
      vector.z = object.position.z * 2

      object.lookAt(vector)

      targets.helix.push(object)
    }
  }
  window.addEventListener('resize', onWindowResize, false)
  transform(targets.table, 1000)
  render()
}

function transform(targets: any[], duration: number) {
  TWEEN.removeAll()
  if (intervalTimer.value) {
    clearInterval(intervalTimer.value)
    intervalTimer.value = null
    randomBallData('sphere')
  }

  return new Promise((resolve) => {
    const objLength = objects.value.length
    for (let i = 0; i < objLength; ++i) {
      const object = objects.value[i]
      const target = targets[i]
      new TWEEN.Tween(object.position)
        .to({ x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration)
        .easing(TWEEN.Easing.Exponential.InOut)
        .start()

      new TWEEN.Tween(object.rotation)
        .to({ x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration)
        .easing(TWEEN.Easing.Exponential.InOut)
        .start()
        .onComplete(() => {
          if (luckyCardList.value.length) {
            luckyCardList.value.forEach((cardIndex: any) => {
              const item = objects.value[cardIndex]
              useElementStyle(item.element, {} as any, i, patternList.value, patternColor.value, cardColor.value, cardSize.value, textSize.value, 'sphere')
            })
          }
          luckyTargets.value = []
          luckyCardList.value = []

          canOperate.value = true
        })
    }

    // 这个补间用来在位置与旋转补间同步执行，通过onUpdate在每次更新数据后渲染scene和camera
    new TWEEN.Tween({})
      .to({}, duration * 2)
      .onUpdate(render)
      .start()
      .onComplete(() => {
        canOperate.value = true
        resolve('')
      })
  })
}
function onWindowResize() {
  camera.value.aspect = window.innerWidth / window.innerHeight
  camera.value.updateProjectionMatrix()

  renderer.value.setSize(window.innerWidth, window.innerHeight)
  render()
}

/**
 * [animation update all tween && controls]
 */
function animation() {
  TWEEN.update()
  if (controls.value) {
    controls.value.update()
  }
  // 设置自动旋转
  // 设置相机位置
  requestAnimationFrame(animation)
}

// // 旋转的动画
function rollBall(rotateY: number, duration: number) {
  TWEEN.removeAll()

  return new Promise((resolve) => {
    scene.value.rotation.y = 0
    ballRotationY.value = Math.PI * rotateY * 1000
    const rotateObj = new TWEEN.Tween(scene.value.rotation)
    rotateObj
      .to(
        {
          // x: Math.PI * rotateX * 1000,
          x: 0,
          y: ballRotationY.value,
          // z: Math.PI * rotateZ * 1000
          z: 0,
        },
        duration * 1000,
      )
      .onUpdate(render)
      .start()
      .onStop(() => {
        resolve('')
      })
      .onComplete(() => {
        resolve('')
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
        z: 3000,
      },
      1000,
    )
    .onUpdate(render)
    .start()
    .onComplete(() => {
      new TWEEN.Tween(camera.value.rotation)
        .to(
          {
            x: 0,
            y: 0,
            z: 0,
          },
          1000,
        )
        .onUpdate(render)
        .start()
        .onComplete(() => {
          canOperate.value = true
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
  if (renderer.value) {
    renderer.value.render(scene.value, camera.value)
  }
}
async function enterLottery() {
  if (!canOperate.value) {
    return
  }
  if (!intervalTimer.value) {
    randomBallData()
  }
  if (patternList.value.length) {
    for (let i = 0; i < patternList.value.length; i++) {
      if (i < rowCount.value * 7) {
        objects.value[patternList.value[i] - 1].element.style.backgroundColor = rgba(cardColor.value, Math.random() * 0.5 + 0.25)
      }
    }
  }
  canOperate.value = false
  await transform(targets.sphere, 1000)
  currentStatus.value = 1
  rollBall(0.1, 2000)
}
// 开始抽奖
function startLottery() {
  if (!canOperate.value) {
    return
  }
  // 验证是否已抽完全部奖项
  if (currentPrize.value.isUsed || !currentPrize.value) {
    toast.open({
      message: i18n.global.t('error.personIsAllDone'),
      type: 'warning',
      position: 'top-right',
      duration: 10000,
    })

    return
  }
  personPool.value = currentPrize.value.isAll ? notThisPrizePersonList.value : notPersonList.value
  // 验证抽奖人数是否还够
  if (personPool.value.length < currentPrize.value.count - currentPrize.value.isUsedCount) {
    toast.open({
      message: i18n.global.t('error.personNotEnough'),
      type: 'warning',
      position: 'top-right',
      duration: 10000,
    })

    return
  }
  luckyCount.value = 10
  // 自定义抽奖个数

  let leftover = currentPrize.value.count - currentPrize.value.isUsedCount
  const customCount = currentPrize.value.separateCount
  if (customCount && customCount.enable && customCount.countList.length > 0) {
    for (let i = 0; i < customCount.countList.length; i++) {
      if (customCount.countList[i].isUsedCount < customCount.countList[i].count) {
        leftover = customCount.countList[i].count - customCount.countList[i].isUsedCount
        break
      }
    }
  }
  luckyCount.value = leftover < luckyCount.value ? leftover : luckyCount.value
  for (let i = 0; i < luckyCount.value; i++) {
    if (personPool.value.length > 0) {
      const randomIndex = Math.round(Math.random() * (personPool.value.length - 1))
      luckyTargets.value.push(personPool.value[randomIndex])
      personPool.value.splice(randomIndex, 1)
    }
  }

  toast.open({
    // message: `现在抽取${currentPrize.value.name} ${leftover}人`,
    message: i18n.global.t('error.startDraw', { count: currentPrize.value.name, leftover }),
    type: 'default',
    position: 'top-right',
    duration: 8000,
  })
  currentStatus.value = 2
  rollBall(10, 3000)
}

async function stopLottery() {
  if (!canOperate.value) {
    return
  }
  //   clearInterval(intervalTimer.value)
  //   intervalTimer.value = null
  canOperate.value = false
  rollBall(0, 1)

  const windowSize = { width: window.innerWidth, height: window.innerHeight }
  luckyTargets.value.forEach((person: IPersonConfig, index: number) => {
    const cardIndex = selectCard(luckyCardList.value, tableData.value.length, person.id)
    luckyCardList.value.push(cardIndex)
    const totalLuckyCount = luckyTargets.value.length
    const item = objects.value[cardIndex]
    const { xTable, yTable } = useElementPosition(item, rowCount.value, totalLuckyCount, { width: cardSize.value.width * 2, height: cardSize.value.height * 2 }, windowSize, index)
    new TWEEN.Tween(item.position)
      .to({
        x: xTable,
        y: yTable,
        z: 1000,
      }, 1200)
      .easing(TWEEN.Easing.Exponential.InOut)
      .onStart(() => {
        item.element = useElementStyle(item.element, person, cardIndex, patternList.value, patternColor.value, luckyColor.value, { width: cardSize.value.width * 2, height: cardSize.value.height * 2 }, textSize.value * 2, 'lucky')
      })
      .start()
      .onComplete(() => {
        canOperate.value = true
        currentStatus.value = 3
      })
    new TWEEN.Tween(item.rotation)
      .to({
        x: 0,
        y: 0,
        z: 0,
      }, 900)
      .easing(TWEEN.Easing.Exponential.InOut)
      .start()
      .onComplete(() => {
        confettiFire()
        resetCamera()
      })
  })
}
// 继续
async function continueLottery() {
  if (!canOperate.value) {
    return
  }

  const customCount = currentPrize.value.separateCount
  if (customCount && customCount.enable && customCount.countList.length > 0) {
    for (let i = 0; i < customCount.countList.length; i++) {
      if (customCount.countList[i].isUsedCount < customCount.countList[i].count) {
        customCount.countList[i].isUsedCount += luckyCount.value
        break
      }
    }
  }
  currentPrize.value.isUsedCount += luckyCount.value
  luckyCount.value = 0
  if (currentPrize.value.isUsedCount >= currentPrize.value.count) {
    currentPrize.value.isUsed = true
    currentPrize.value.isUsedCount = currentPrize.value.count
  }
  personConfig.addAlreadyPersonList(luckyTargets.value, currentPrize.value)
  prizeConfig.updatePrizeConfig(currentPrize.value)
  await enterLottery()
}
function quitLottery() {
  enterLottery()
  currentStatus.value = 0
}
// 庆祝动画
function confettiFire() {
  const duration = 3 * 1000
  const end = Date.now() + duration;
  (function frame() {
    // launch a few confetti from the left edge
    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
    })
    // and launch a few from the right edge
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
    })

    // keep going until we are out of time
    if (Date.now() < end) {
      requestAnimationFrame(frame)
    }
  }())
  centerFire(0.25, {
    spread: 26,
    startVelocity: 55,
  })
  centerFire(0.2, {
    spread: 60,
  })
  centerFire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  })
  centerFire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  })
  centerFire(0.1, {
    spread: 120,
    startVelocity: 45,
  })
}
function centerFire(particleRatio: number, opts: any) {
  const count = 200
  confetti({
    origin: { y: 0.7 },
    ...opts,
    particleCount: Math.floor(count * particleRatio),
  })
}

function setDefaultPersonList() {
  personConfig.setDefaultPersonList()
  // 刷新页面
  window.location.reload()
}
// 随机替换数据
function randomBallData(mod: 'default' | 'lucky' | 'sphere' = 'default') {
  // 两秒执行一次
  intervalTimer.value = setInterval(() => {
    // 产生随机数数组
    const indexLength = 4
    const cardRandomIndexArr: number[] = []
    const personRandomIndexArr: number[] = []
    for (let i = 0; i < indexLength; i++) {
      const randomCardIndex = Math.round(Math.random() * (tableData.value.length - 1))
      const randomPersonIndex = Math.round(Math.random() * (allPersonList.value.length - 1))
      if (luckyCardList.value.includes(randomCardIndex)) {
        continue
      }
      cardRandomIndexArr.push(randomCardIndex)
      personRandomIndexArr.push(randomPersonIndex)
    }
    for (let i = 0; i < cardRandomIndexArr.length; i++) {
      if (!objects.value[cardRandomIndexArr[i]]) {
        continue
      }
      objects.value[cardRandomIndexArr[i]].element = useElementStyle(objects.value[cardRandomIndexArr[i]].element, allPersonList.value[personRandomIndexArr[i]], cardRandomIndexArr[i], patternList.value, patternColor.value, cardColor.value, { width: cardSize.value.width, height: cardSize.value.height }, textSize.value, mod, 'change')
    }
  }, 200)
}
// 监听键盘
function listenKeyboard(e: any) {
  if ((e.keyCode !== 32 || e.keyCode !== 27) && !canOperate.value) {
    return
  }
  if (e.keyCode === 27 && currentStatus.value === 3) {
    quitLottery()
  }
  if (e.keyCode !== 32) {
    return
  }
  switch (currentStatus.value) {
    case 0:
      enterLottery()
      break
    case 1:
      startLottery()
      break
    case 2:
      stopLottery()
      break
    case 3:
      continueLottery()
      break
    default:
      break
  }
}

function cleanup() {
//   animationRunning.value = false
  clearInterval(intervalTimer.value)
  intervalTimer.value = null
  if (scene.value) {
    scene.value.traverse((object: Object3D) => {
      if ((object as any).material) {
        if (Array.isArray((object as any).material)) {
          (object as any).material.forEach((material: Material) => {
            material.dispose()
          })
        }
        else {
          (object as any).material.dispose()
        }
      }
      if ((object as any).geometry) {
        (object as any).geometry.dispose()
      }
      if ((object as any).texture) {
        (object as any).texture.dispose()
      }
    })
    scene.value.clear()
  }

  if (objects.value) {
    objects.value.forEach((object) => {
      if (object.element) {
        object.element.remove()
      }
    })
    objects.value = []
  }

  if (controls.value) {
    controls.value.removeEventListener('change')
    controls.value.dispose()
  }
  //   移除所有事件监听
  window.removeEventListener('resize', onWindowResize)
  scene.value = null
  camera.value = null
  renderer.value = null
  controls.value = null
}
onMounted(() => {
  initTableData()
  init()
  animation()
  containerRef.value!.style.color = `${textColor}`
  randomBallData()
  window.addEventListener('keydown', listenKeyboard)
})
onUnmounted(() => {
  nextTick(() => {
    cleanup()
  })
  clearInterval(intervalTimer.value)
  intervalTimer.value = null
  window.removeEventListener('keydown', listenKeyboard)
})
</script>

<template>
  <div class="absolute z-10 flex flex-col items-center justify-center -translate-x-1/2 left-1/2">
    <h2
      class="pt-12 m-0 mb-12 font-mono tracking-wide text-center leading-12 header-title"
      :style="{ fontSize: `${textSize * 1.5}px`, color: textColor }"
    >
      {{ topTitle }}
    </h2>
    <div class="flex gap-3">
      <button
        v-if="tableData.length <= 0" class="cursor-pointer btn btn-outline btn-secondary btn-lg"
        @click="router.push('config')"
      >
        {{ t('button.noInfoAndImport') }}
      </button>
      <button
        v-if="tableData.length <= 0" class="cursor-pointer btn btn-outline btn-secondary btn-lg"
        @click="setDefaultPersonList"
      >
        {{ t('button.useDefault') }}
      </button>
    </div>
  </div>
  <div id="container" ref="containerRef" class="3dContainer">
    <!-- 选中菜单结构 start -->
    <div id="menu">
      <button v-if="currentStatus === 0 && tableData.length > 0" class="btn-end " @click="enterLottery">
        {{ t('button.enterLottery') }}
      </button>

      <div v-if="currentStatus === 1" class="start">
        <button class="btn-start" @click="startLottery">
          <strong>{{ t('button.start') }}</strong>
          <div id="container-stars">
            <div id="stars" />
          </div>

          <div id="glow">
            <div class="circle" />
            <div class="circle" />
          </div>
        </button>
      </div>

      <button v-if="currentStatus === 2" class="btn-end btn glass btn-lg" @click="stopLottery">
        {{ t('button.selectLucky') }}
      </button>

      <div v-if="currentStatus === 3" class="flex justify-center gap-6 enStop">
        <div class="start">
          <button class="btn-start" @click="continueLottery">
            <strong>{{ t('button.continue') }}</strong>
            <div id="container-stars">
              <div id="stars" />
            </div>

            <div id="glow">
              <div class="circle" />
              <div class="circle" />
            </div>
          </button>
        </div>

        <div class="start">
          <button class="btn-cancel" @click="quitLottery">
            <strong>{{ t('button.cancel') }}</strong>
            <div id="container-stars">
              <div id="stars" />
            </div>

            <div id="glow">
              <div class="circle" />
              <div class="circle" />
            </div>
          </button>
        </div>
      </div>
    </div>
    <!-- end -->
  </div>
  <StarsBackground :home-background="homeBackground" />
  <PrizeList class="absolute left-0 top-32" />
</template>

<style scoped lang="scss">
#menu {
    position: absolute;
    z-index: 100;
    width: 100%;
    bottom: 50px;
    text-align: center;
    margin: 0 auto;
    font-size: 32px;
}

.header-title {
    -webkit-animation: tracking-in-expand-fwd 0.8s cubic-bezier(0.215, 0.610, 0.355, 1.000) both;
    animation: tracking-in-expand-fwd 0.8s cubic-bezier(0.215, 0.610, 0.355, 1.000) both;
}

.start {
    // 居中
    display: flex;
    justify-content: center;
}

.btn-start {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 13rem;
    overflow: hidden;
    height: 3rem;
    background-size: 300% 300%;
    backdrop-filter: blur(1rem);
    border-radius: 5rem;
    transition: 0.5s;
    animation: gradient_301 5s ease infinite;
    border: double 4px transparent;
    background-image: linear-gradient(#212121, #212121), linear-gradient(137.48deg, #ffdb3b 10%, #FE53BB 45%, #8F51EA 67%, #0044ff 87%);
    background-origin: border-box;
    background-clip: content-box, border-box;
    -webkit-animation: pulsate-fwd 1.2s ease-in-out infinite both;
    animation: pulsate-fwd 1.2s ease-in-out infinite both;
}

.btn-cancel {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 13rem;
    overflow: hidden;
    height: 3rem;
    background-size: 300% 300%;
    backdrop-filter: blur(1rem);
    border-radius: 5rem;
    transition: 0.5s;
    animation: gradient_301 5s ease infinite;
    border: double 4px transparent;
    background-image: linear-gradient(#212121, #212121), linear-gradient(137.48deg, #ffdb3b 10%, #FE53BB 45%, #8F51EA 67%, #0044ff 87%);
    background-origin: border-box;
    background-clip: content-box, border-box;
}

#container-stars {
    position: absolute;
    z-index: -1;
    width: 100%;
    height: 100%;
    overflow: hidden;
    transition: 0.5s;
    backdrop-filter: blur(1rem);
    border-radius: 5rem;
}

strong {
    z-index: 2;
    font-family: 'Avalors Personal Use';
    font-size: 12px;
    letter-spacing: 5px;
    color: #FFFFFF;
    text-shadow: 0 0 4px white;
}

#glow {
    position: absolute;
    display: flex;
    width: 12rem;
}

.circle {
    width: 100%;
    height: 30px;
    filter: blur(2rem);
    animation: pulse_3011 4s infinite;
    z-index: -1;
}

.circle:nth-of-type(1) {
    background: rgba(254, 83, 186, 0.636);
}

.circle:nth-of-type(2) {
    background: rgba(142, 81, 234, 0.704);
}

.btn-start:hover #container-stars {
    z-index: 1;
    background-color: #212121;
}

.btn-start:hover {
    transform: scale(1.1)
}

.btn-start:active {
    border: double 4px #FE53BB;
    background-origin: border-box;
    background-clip: content-box, border-box;
    animation: none;
}

.btn-start:active .circle {
    background: #FE53BB;
}

#stars {
    position: relative;
    background: transparent;
    width: 200rem;
    height: 200rem;
}

#stars::after {
    content: "";
    position: absolute;
    top: -10rem;
    left: -100rem;
    width: 100%;
    height: 100%;
    animation: animStarRotate 90s linear infinite;
}

#stars::after {
    background-image: radial-gradient(#ffffff 1px, transparent 1%);
    background-size: 50px 50px;
}

#stars::before {
    content: "";
    position: absolute;
    top: 0;
    left: -50%;
    width: 170%;
    height: 500%;
    animation: animStar 60s linear infinite;
}

#stars::before {
    background-image: radial-gradient(#ffffff 1px, transparent 1%);
    background-size: 50px 50px;
    opacity: 0.5;
}

@keyframes animStar {
    from {
        transform: translateY(0);
    }

    to {
        transform: translateY(-135rem);
    }
}

@keyframes animStarRotate {
    from {
        transform: rotate(360deg);
    }

    to {
        transform: rotate(0);
    }
}

@keyframes gradient_301 {
    0% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0% 50%;
    }
}

@keyframes pulse_3011 {
    0% {
        transform: scale(0.75);
        box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7);
    }

    70% {
        transform: scale(1);
        box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
    }

    100% {
        transform: scale(0.75);
        box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
    }
}

.btn-end {
    -webkit-animation: pulsate-fwd 0.9s ease-in-out infinite both;
    animation: pulsate-fwd 0.9s ease-in-out infinite both;
    cursor: pointer;
}

.btn-end {
    --glow-color: rgb(217, 176, 255);
    --glow-spread-color: rgba(191, 123, 255, 0.781);
    --enhanced-glow-color: rgb(231, 206, 255);
    --btn-color: rgb(100, 61, 136);
    border: .25em solid var(--glow-color);
    padding: 1em 3em;
    color: var(--glow-color);
    font-size: 15px;
    font-weight: bold;
    background-color: var(--btn-color);
    border-radius: 1em;
    outline: none;
    box-shadow: 0 0 1em .25em var(--glow-color),
        0 0 4em 1em var(--glow-spread-color),
        inset 0 0 .75em .25em var(--glow-color);
    text-shadow: 0 0 .5em var(--glow-color);
    position: relative;
    transition: all 0.3s;
    -webkit-animation: swing-in-top-fwd 0.5s cubic-bezier(0.175, 0.885, 0.320, 1.275) both;
    animation: swing-in-top-fwd 0.5s cubic-bezier(0.175, 0.885, 0.320, 1.275) both;
}

.btn-end::after {
    pointer-events: none;
    content: "";
    position: absolute;
    top: 120%;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: var(--glow-spread-color);
    filter: blur(2em);
    opacity: .7;
    transform: perspective(1.5em) rotateX(35deg) scale(1, .6);
}

.btn-end:hover {
    color: var(--btn-color);
    background-color: var(--glow-color);
    box-shadow: 0 0 1em .25em var(--glow-color),
        0 0 4em 2em var(--glow-spread-color),
        inset 0 0 .75em .25em var(--glow-color);
}

.btn-end:active {
    box-shadow: 0 0 0.6em .25em var(--glow-color),
        0 0 2.5em 2em var(--glow-spread-color),
        inset 0 0 .5em .25em var(--glow-color);
}

// 按钮动画
@-webkit-keyframes pulsate-fwd {
    0% {
        -webkit-transform: scale(1);
        transform: scale(1);
    }

    50% {
        -webkit-transform: scale(1.1);
        transform: scale(1.1);
    }

    100% {
        -webkit-transform: scale(1);
        transform: scale(1);
    }
}

@keyframes pulsate-fwd {
    0% {
        -webkit-transform: scale(1);
        transform: scale(1);
    }

    50% {
        -webkit-transform: scale(1.2);
        transform: scale(1.2);
    }

    100% {
        -webkit-transform: scale(1);
        transform: scale(1);
    }
}

@-webkit-keyframes tracking-in-expand-fwd {
    0% {
        letter-spacing: -0.5em;
        -webkit-transform: translateZ(-700px);
        transform: translateZ(-700px);
        opacity: 0;
    }

    40% {
        opacity: 0.6;
    }

    100% {
        -webkit-transform: translateZ(0);
        transform: translateZ(0);
        opacity: 1;
    }
}

@keyframes tracking-in-expand-fwd {
    0% {
        letter-spacing: -0.5em;
        -webkit-transform: translateZ(-700px);
        transform: translateZ(-700px);
        opacity: 0;
    }

    40% {
        opacity: 0.6;
    }

    100% {
        -webkit-transform: translateZ(0);
        transform: translateZ(0);
        opacity: 1;
    }
}
</style>
