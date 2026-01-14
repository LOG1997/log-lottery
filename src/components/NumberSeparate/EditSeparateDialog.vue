<script setup lang='ts'>
import type { Separate } from '@/types/storeType'
import { useVirtualList } from '@vueuse/core'
import { computed, onMounted, ref, toRefs, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
    totalNumber: {
        type: Number,
        default: 0,
    },
    separatedNumber: {
        type: Array<Separate>,
        default: [],
    },
})
const emits = defineEmits(['submitData'])
const { t } = useI18n()
const separatedNumberRef = ref()
const { separatedNumber, totalNumber } = toRefs(props)
const scaleList = ref<number[]>([])

const ITEMS_PER_ROW = 10
const ROW_HEIGHT = 52

// Group numbers into rows for virtual list
const rows = computed(() => {
    const result: number[][] = []
    for (let i = 0; i < props.totalNumber; i += ITEMS_PER_ROW) {
        const row: number[] = []
        for (let j = i; j < Math.min(i + ITEMS_PER_ROW, props.totalNumber); j++) {
            row.push(j + 1)
        }
        result.push(row)
    }
    return result
})

const { list, containerProps, wrapperProps } = useVirtualList(rows, {
    itemHeight: ROW_HEIGHT,
})

function editScale(item: number) {
    if (item === totalNumber.value) {
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
function clearData() {
    emits('submitData', separatedNumber.value)
    separatedNumberRef.value.close()
}
watch(scaleList, (val: number[]) => {
    separatedNumber.value.length = 0
    for (let i = 1; i < scaleList.value.length; i++) {
        separatedNumber.value[i - 1] = {
            id: i.toString(),
            count: val[i] - val[i - 1],
            isUsedCount: 0,
        }
    }
}, { deep: true })

watch(totalNumber, (val) => {
    if (val <= 0) {
        return
    }
    separatedNumberRef.value.showModal()
    // scaleList.value = [0, val]
    scaleList.value = Array.from({ length: separatedNumber.value.length + 1 }).fill(totalNumber.value) as number[]
    for (let i = separatedNumber.value.length - 1; i >= 0; i--) {
        scaleList.value[i] = scaleList.value[i + 1] - separatedNumber.value[i].count
    }
    if (scaleList.value[0] !== 0) {
        scaleList.value.unshift(0)
    }
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
    <div class="overflow-hidden modal-box max-h-[70vh] flex flex-col">
      <h3 class="pb-4 text-lg font-bold shrink-0">
        {{ t('dialog.titleTip') }}
      </h3>
      <p class="pb-4 shrink-0">
        {{ t('dialog.dialogSingleDrawLimit') }}
      </p>
      <!-- Virtual scrolling container -->
      <div
        v-bind="containerProps"
        class="flex-1 min-h-0 px-3 overflow-y-auto"
        style="max-height: calc(70vh - 180px);"
      >
        <div v-bind="wrapperProps">
          <div
            v-for="{ data: row, index } in list"
            :key="index"
            class="grid grid-cols-10 gap-1 text-center pb-2"
            :style="{ height: `${ROW_HEIGHT}px` }"
          >
            <div
              v-for="item in row"
              :key="item"
              class="flex flex-col items-center justify-start cursor-pointer rounded hover:bg-base-200 transition-colors pt-1"
              :data-tip="t('tooltip.leftClick')"
              @click.left="editScale(item)"
            >
              <span>{{ item }}</span>
              <span :class="scaleList.includes(item) ? 'text-red-500 font-extrabold' : ''" class="leading-none">|</span>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-action shrink-0">
        <form method="dialog">
          <!-- if there is a button in form, it will close the modal -->
          <button class="btn" @click="clearData">
            {{ t('button.close') }}
          </button>
        </form>
      </div>
    </div>
  </dialog>
</template>

<style lang='scss' scoped></style>
