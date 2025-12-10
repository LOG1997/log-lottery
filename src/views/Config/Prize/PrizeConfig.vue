<script setup lang='ts'>
import type { IPrizeConfig } from '@/types/storeType'
import localforage from 'localforage'
import { cloneDeep } from 'lodash-es'
import { Grip } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { useI18n } from 'vue-i18n'
import EditSeparateDialog from '@/components/NumberSeparate/EditSeparateDialog.vue'
import PageHeader from '@/components/PageHeader/index.vue'
import i18n from '@/locales/i18n'
import useStore from '@/store'

const { t } = useI18n()
const imageDbStore = localforage.createInstance({
  name: 'imgStore',
})
const prizeConfig = useStore().prizeConfig
const globalConfig = useStore().globalConfig
const { getPrizeConfig: localPrizeList, getCurrentPrize: currentPrize } = storeToRefs(prizeConfig)

const { getImageList: localImageList } = storeToRefs(globalConfig)
const prizeList = ref(cloneDeep(localPrizeList.value))
const imgList = ref<any[]>([])

const selectedPrize = ref<IPrizeConfig | null>()

function addPrize() {
  const defaultPrizeCOnfig: IPrizeConfig = {
    id: new Date().getTime().toString(),
    name: i18n.global.t('data.prizeName'),
    sort: 0,
    isAll: false,
    count: 1,
    isUsedCount: 0,
    picture: {
      id: '',
      name: '',
      url: '',
    },
    separateCount: {
      enable: false,
      countList: [],
    },
    desc: '',
    isUsed: false,
    isShow: true,
    frequency: 1,
  }
  prizeConfig.addPrizeConfig(defaultPrizeCOnfig)
}

function selectPrize(item: IPrizeConfig) {
  selectedPrize.value = item
  selectedPrize.value.isUsedCount = 0
  selectedPrize.value.isUsed = false

  if (selectedPrize.value.separateCount.countList.length > 1) {
    return
  }
  selectedPrize.value.separateCount = {
    enable: true,
    countList: [
      {
        id: '0',
        count: item.count,
        isUsedCount: 0,
      },
    ],
  }
}

function changePrizeStatus(item: IPrizeConfig) {
  // if (item.isUsed == true) {
  //     item.isUsedCount = 0;
  //     if (item.separateCount && item.separateCount.countList.length) {
  //         item.separateCount.countList.forEach((countItem: any) => {
  //             countItem.isUsedCount = 0;
  //         })
  //     }
  // }
  // else {
  //     item.isUsedCount = item.count;
  //     if (item.separateCount && item.separateCount.countList.length) {
  //         item.separateCount.countList.forEach((countItem: any) => {
  //             countItem.isUsedCount = countItem.count;
  //         })
  //     }
  // }
  item.isUsed ? item.isUsedCount = 0 : item.isUsedCount = item.count
  item.separateCount.countList = []
  item.isUsed = !item.isUsed
}

function changePrizePerson(item: IPrizeConfig) {
  let indexPrize = -1
  for (let i = 0; i < prizeList.value.length; i++) {
    if (prizeList.value[i].id === item.id) {
      indexPrize = i
      break
    }
  }
  if (indexPrize > -1) {
    prizeList.value[indexPrize].separateCount.countList = []
    prizeList.value[indexPrize].isUsed ? prizeList.value[indexPrize].isUsedCount = prizeList.value[indexPrize].count : prizeList.value[indexPrize].isUsedCount = 0
  }
}
function submitData(value: any) {
  selectedPrize.value!.separateCount.countList = value
  selectedPrize.value = null
}
function resetDefault() {
  prizeConfig.resetDefault()
}

async function getImageDbStore() {
  const keys = await imageDbStore.keys()
  if (keys.length > 0) {
    imageDbStore.iterate((value, key) => {
      imgList.value.push({
        key,
        value,
      })
    })
  }
}

function delItem(item: IPrizeConfig) {
  prizeConfig.deletePrizeConfig(item.id)
}
async function delAll() {
  await prizeConfig.deleteAllPrizeConfig()
}
onMounted(() => {
  getImageDbStore()
})
watch(() => prizeList.value, (val: IPrizeConfig[]) => {
  prizeConfig.setPrizeConfig(val)
}, { deep: true })
</script>

<template>
  <div>
    <PageHeader :title="t('viewTitle.prizeManagement')">
      <template #buttons>
        <div class="flex w-full gap-3">
          <button class="btn btn-info btn-sm" @click="addPrize">
            {{ t('button.add') }}
          </button>
          <button class="btn btn-info btn-sm" @click="resetDefault">
            {{ t('button.resetDefault') }}
          </button>
          <button class="btn btn-error btn-sm" @click="delAll">
            {{ t('button.allDelete') }}
          </button>
        </div>
      </template>
      <template #alerts>
        <div role="alert" class="w-full my-4 alert alert-info">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-6 h-6 stroke-current shrink-0">
            <path
              stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{{ t('dialog.tipResetPrize') }}</span>
        </div>
      </template>
    </PageHeader>
    <VueDraggable
      v-model="prizeList"
      :animation="150"
      handle=".handle"
      class="p-0 m-0"
    >
      <div
        v-for="item in prizeList" :key="item.id" class="flex items-center justify-center gap-10 py-5"
        :class="currentPrize.id === item.id ? 'border-1 border-dotted rounded-xl' : null"
      >
        <label class="flex items-center justify-center max-w-xs px-2 handle form-control">
          <Grip class="w-10 h-10 cursor-move handle" />
        </label>
        <label class="w-1/2 max-w-xs form-control">
          <div class="label">
            <span class="label-text">{{ t('table.prizeName') }}</span>
          </div>
          <input
            v-model="item.name" type="text" :placeholder="t('placeHolder.name')"
            class="w-full max-w-xs input-sm input input-bordered"
          >
        </label>
        <label class="flex items-center w-1/2 max-w-xs gap-2 form-control">
          <div class="label">
            <span class="label-text">{{ t('table.fullParticipation') }}</span>
          </div>
          <input
            type="checkbox" :checked="item.isAll" class="border-solid checkbox checkbox-secondary border-1"
            @change="item.isAll = !item.isAll"
          >
        </label>
        <label class="w-1/2 max-w-xs form-control">
          <div class="label">
            <span class="label-text">{{ t('table.numberParticipants') }}</span>
          </div>
          <input
            v-model="item.count" type="number" :placeholder="t('placeHolder.winnerCount')" class="w-full max-w-xs p-0 m-0 input-sm input input-bordered"
            @change="changePrizePerson(item)"
          >
          <div class="tooltip tooltip-bottom" :data-tip="`${t('table.isDone') + item.isUsedCount}/${item.count}`">
            <progress class="w-full progress" :value="item.isUsedCount" :max="item.count" />
          </div>
        </label>
        <label class="flex items-center w-1/2 max-w-xs gap-2 form-control">
          <div class="label">
            <span class="label-text">{{ t('table.isDone') }}</span>
          </div>
          <input
            type="checkbox" :checked="item.isUsed" class="border-solid checkbox checkbox-secondary border-1"
            @change="changePrizeStatus(item)"
          >
        </label>
        <label class="w-full max-w-xs form-control">
          <div class="label">
            <span class="label-text">{{ t('table.image') }}</span>
          </div>
          <select v-model="item.picture" class="truncate select select-warning select-sm">
            <option v-if="item.picture.id" :value="{ id: '', name: '', url: '' }">❌</option>
            <option disabled selected>{{ t('table.selectPicture') }}</option>
            <option v-for="picItem in localImageList" :key="picItem.id" :title="picItem.name" class="w-full max-w-full" :value="picItem">
              <span class="truncate w-option-xs">{{ picItem.name }}</span>
            </option>
          </select>
        </label>
        <label v-if="item.separateCount" class="w-full max-w-xs form-control">
          <div class="label">
            <span class="label-text">{{ t('table.onceNumber') }}</span>
          </div>
          <div class="flex justify-start w-full h-full" @click="selectPrize(item)">
            <ul
              v-if="item.separateCount.countList.length"
              class="flex flex-wrap w-full h-full gap-1 p-0 pt-1 m-0 cursor-pointer"
            >
              <li
                v-for="se in item.separateCount.countList"
                :key="se.id" class="relative flex items-center justify-center w-8 h-8 bg-slate-600/60 separated"
              >
                <div
                  class="flex items-center justify-center w-full h-full tooltip"
                  :data-tip="`${t('tooltip.doneCount') + se.isUsedCount}/${se.count}`"
                >
                  <div
                    class="absolute left-0 z-50 h-full bg-blue-300/80"
                    :style="`width:${se.isUsedCount * 100 / se.count}%`"
                  />
                  <span>{{ se.count }}</span>
                </div>
              </li>
            </ul>
            <button v-else class="btn btn-secondary btn-xs">{{ t('button.setting') }}</button>
          </div>
        </label>
        <label class="w-full max-w-xs form-control">
          <div class="label">
            <span class="label-text">{{ t('table.operation') }}</span>
          </div>
          <div class="flex gap-2">
            <button class="btn btn-error btn-xs" @click="delItem(item)">{{ t('button.delete') }}</button>
          </div>
        </label>
      </div>
    </VueDraggable>
    <EditSeparateDialog
      :total-number="selectedPrize?.count" :separated-number="selectedPrize?.separateCount.countList"
      @submit-data="submitData"
    />
  </div>
</template>

<style lang='scss' scoped></style>
