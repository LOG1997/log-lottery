<script setup lang='ts'>
import { toRefs } from 'vue'
import { useI18n } from 'vue-i18n'

import { useRouter } from 'vue-router'

interface Props {
  textSize: number
  textColor: string
  topTitle: string
  tableData: any[]
  setDefaultPersonList: () => void
  isInitialDone: boolean
}

const props = defineProps<Props>()
const router = useRouter()
const { tableData, textSize, textColor, topTitle, setDefaultPersonList } = toRefs(props)
const { t } = useI18n()
</script>

<template>
  <div class="absolute z-10 flex flex-col items-center justify-center -translate-x-1/2 left-1/2">
    <h2
      class="pt-12 m-0 mb-12 font-mono tracking-wide text-center leading-12 header-title"
      :style="{ fontSize: `${textSize * 1.5}px`, color: textColor }"
    >
      {{ topTitle }}
    </h2>
    <div v-if="isInitialDone" class="flex gap-3">
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
    <!-- 加载中 -->
    <div v-else class="flex gap-3 items-center">
      <span class="loading loading-spinner loading-xl" />
      <span>加载中</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.header-title {
    -webkit-animation: tracking-in-expand-fwd 0.8s cubic-bezier(0.215, 0.610, 0.355, 1.000) both;
    animation: tracking-in-expand-fwd 0.8s cubic-bezier(0.215, 0.610, 0.355, 1.000) both;
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
