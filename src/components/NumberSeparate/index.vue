<script setup lang='ts'>
import { Separate } from '@/types/storeType'
import { ref, onMounted, watch, toRefs } from 'vue';
const props = defineProps({
    totalNumber: {
        type: Number,
        default: 0
    },
    separatedNumber: {
        type: Array<Separate>,
        default: []
    }
})
const separatedNumberRef = ref()
const { separatedNumber, totalNumber } = toRefs(props)
const scaleList = ref<number[]>([])
const openEdit = () => {
    console.log('openedit',separatedNumberRef.value)
    separatedNumberRef.value.showModal()
}

const addScale = (item: number) => {
    if (scaleList.value.includes(item)) {
        return
    }
    scaleList.value.push(item)
    scaleList.value.sort((a, b) => a - b)
}
const delScale = (item: number) => {
    if (!scaleList.value.includes(item)) {
        return
    }
    scaleList.value.splice(scaleList.value.indexOf(item), 1)
}
watch(scaleList, (val: number[]) => {
    separatedNumber.value = []
    for (let i = 1; i < scaleList.value.length; i++) {
        separatedNumber.value[i - 1] = {
            id: i.toString(),
            isUsed: false,
            num: val[i]-val[i-1]
        }
    }
}, { deep: true })
onMounted(() => {
    scaleList.value = new Array(separatedNumber.value.length + 1).fill(totalNumber.value)
    for (let i = separatedNumber.value.length - 1; i >= 0; i--) {
        scaleList.value[i] = scaleList.value[i + 1] - separatedNumber.value[i].num
    }
})
</script>

<template>
    <ul class="flex flex-wrap w-full h-full gap-1 cursor-pointer" @click="openEdit">
        <li class="flex items-center justify-center w-8 h-8 bg-slate-900/60 separated" v-for="item in separatedNumber"
            :key="item.id">
            <span>{{ item.num }}</span>
        </li>
    </ul>
    <dialog id="my_modal_1" ref="separatedNumberRef" class="z-50 overflow-hidden border-none modal">
        <div class="overflow-hidden modal-box">
            <h3 class="pb-12 text-lg font-bold">提示!</h3>
            <div class="flex justify-between px-3 text-center separated-number">
                <div v-for="item in props.totalNumber" :key="item"
                    class="relative flex flex-col items-center cursor-pointer">
                    <div class="absolute mb-12 text-center tooltip -top-5 hover:text-lg" data-tip="左键切割右键取消"
                        @click.left="addScale(item)" @click.right.prevent="delScale(item)">
                        <span> {{ item }}</span>
                    </div>
                    <div class="text-center" :class="scaleList.includes(item) ? 'text-red-500' : ''">|</div>
                </div>
            </div>
            <div class="modal-action">
                <form method="dialog">
                    <!-- if there is a button in form, it will close the modal -->
                    <button class="btn">退出</button>
                </form>
            </div>
        </div>
    </dialog>
</template>

<style lang='scss' scoped>
.separated-number {
    border-bottom: 1px solid;
}
</style>
