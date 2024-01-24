<script setup lang='ts'>
import { ref, watch, onMounted, toRefs } from 'vue'
import { Separate } from '@/types/storeType'


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

const emits = defineEmits(['clearData'])

const separatedNumberRef = ref()
const { separatedNumber, totalNumber } = toRefs(props)
const scaleList = ref<number[]>([])
const editScale = (item: number) => {
    if (item == totalNumber.value) {
        return
    }
    if (scaleList.value.includes(item)) {
        const index = scaleList.value.indexOf(item)
        scaleList.value.splice(index, 1)
        separatedNumber.value.splice(index, 1)
    }
    else {
        scaleList.value.push(item)
        scaleList.value.sort((a, b) => a - b)
    }
}
const clearData = () => {
    separatedNumberRef.value.close()
    emits('clearData')
}
watch(scaleList, (val: number[]) => {
    separatedNumber.value = []
    for (let i = 1; i < scaleList.value.length; i++) {
        separatedNumber.value[i-1] = {
            id: i.toString(),
            count: val[i] - val[i - 1],
            isUsedCount:0,
        }
    }
}, { deep: true })

watch(totalNumber, (val) => {
    if (val <= 0) {
        return
    }
    separatedNumberRef.value.showModal()
    scaleList.value = new Array(separatedNumber.value.length + 1).fill(totalNumber.value)
    console.log('code line-56 \n\r😀 scaleList.value:\n\r',scaleList.value);
    for (let i = separatedNumber.value.length - 1; i >= 0; i--) {
        scaleList.value[i] = scaleList.value[i + 1] - separatedNumber.value[i].count
    }
    if(scaleList.value[0]!==0){
        scaleList.value.unshift(0)
    }
    
    console.log('code line-56 \n\r😀 scaleList.value:\n\r',scaleList.value);
})
onMounted(() => {
    // 阻止esc事件
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            e.preventDefault()
        }
    })
})
</script>

<template>
    <dialog id="my_modal_1" ref="separatedNumberRef" class="z-50 overflow-hidden border-none modal">
        <div class="overflow-hidden modal-box">
            <h3 class="pb-6 text-lg font-bold">提示!</h3>
            <p class="pb-8">单次抽取只能抽取10位</p>
            <div class="flex justify-between px-3 text-center separated-number">
                <div v-for="item in props.totalNumber" :key="item"
                    class="relative flex flex-col items-center cursor-pointer">
                    <div class="absolute mb-12 text-center tooltip -top-5 hover:text-lg" data-tip="左键切割右键取消"
                        @click.left="editScale(item)">
                        <span> {{ item }}</span>
                    </div>
                    <div class="text-center" :class="scaleList.includes(item) ? 'text-red-500 font-extrabold' : ''">|</div>
                </div>
            </div>
            <div class="modal-action">
                <form method="dialog">
                    <!-- if there is a button in form, it will close the modal -->
                    <button class="btn" @click="clearData">关闭</button>
                </form>
            </div>
        </div>
    </dialog>
</template>

<style lang='scss' scoped></style>
