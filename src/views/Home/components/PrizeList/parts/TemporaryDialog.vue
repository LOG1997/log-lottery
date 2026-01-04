<script setup lang='ts'>
import type { IImage, IPrizeConfig } from '@/types/storeType'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

defineProps<{
    changePersonCount: () => void
    selectPrize: (prize: IPrizeConfig) => void
    localImageList: IImage[]
    submitTemporaryPrize: () => void
    addTemporaryPrize: () => void
    submitData: (separatedNumber: any) => void
}>()
const { t } = useI18n()
const dialogRef = ref<HTMLDialogElement | null>(null)
const temporaryPrize = defineModel<IPrizeConfig>('temporaryPrize', { required: true })
const selectedPrize = defineModel<IPrizeConfig | null>('selectedPrize', { required: true })
function showDialog() {
    dialogRef.value?.showModal()
}
defineExpose({
    showDialog,
    closed,
})
</script>

<template>
  <EditSeparateDialog
    :total-number="selectedPrize?.count" :separated-number="selectedPrize?.separateCount.countList"
    @submit-data="submitData"
  />
  <dialog id="my_modal_1" ref="dialogRef" class="border-none modal">
    <div class="modal-box">
      <h3 class="text-lg font-bold">
        {{ t('dialog.titleTemporary') }}
      </h3>
      <div class="flex flex-col gap-3">
        <label class="flex w-full max-w-xs">
          <div class="label">
            <span class="label-text">{{ t('table.name') }}:</span>
          </div>
          <input
            v-model="temporaryPrize.name" type="text" :placeholder="t('placeHolder.name')"
            class="max-w-xs input-sm input input-bordered"
          >
        </label>
        <label class="flex w-full max-w-xs">
          <div class="label">
            <span class="label-text">{{ t('table.fullParticipation') }}</span>
          </div>
          <input
            type="checkbox" :checked="temporaryPrize.isAll"
            class="mt-2 border-solid checkbox checkbox-secondary border"
            @change="temporaryPrize.isAll = !temporaryPrize.isAll"
          >
        </label>
        <label class="flex w-full max-w-xs">
          <div class="label">
            <span class="label-text">{{ t('table.setLuckyNumber') }}</span>
          </div>
          <input
            v-model="temporaryPrize.count" type="number" :placeholder="t('placeHolder.winnerCount')" class="max-w-xs input-sm input input-bordered"
            @change="changePersonCount"
          >
        </label>
        <label class="flex w-full max-w-xs">
          <div class="label">
            <span class="label-text">{{ t('table.luckyPeopleNumber') }}</span>
          </div>
          <input
            v-model="temporaryPrize.isUsedCount" disabled type="number" :placeholder="t('placeHolder.winnerCount')"
            class="max-w-xs input-sm input input-bordered"
          >
        </label>
        <label v-if="temporaryPrize.separateCount" class="flex w-full max-w-xs">
          <div class="label">
            <span class="label-text">{{ t('table.onceNumber') }}</span>
          </div>
          <div class="flex justify-start h-full" @click="selectPrize(temporaryPrize)">
            <ul
              v-if="temporaryPrize.separateCount.countList.length"
              class="flex flex-wrap w-full h-full gap-1 p-0 pt-1 m-0 cursor-pointer"
            >
              <li
                v-for="se in temporaryPrize.separateCount.countList"
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
        <label class="flex w-full max-w-xs">
          <div class="label">
            <span class="label-text">{{ t('table.image') }}</span>
          </div>
          <select v-model="temporaryPrize.picture" class="flex-1 w-12 select select-warning select-sm">
            <option v-if="temporaryPrize.picture.id" :value="{ id: '', name: '', url: '' }">❌
            </option>
            <option disabled selected>{{ t('table.selectPicture') }}</option>
            <option v-for="picItem in localImageList" :key="picItem.id" class="w-auto" :value="picItem">{{
              picItem.name }}
            </option>
          </select>
        </label>
      </div>
      <div class="modal-action">
        <form method="dialog" class="flex gap-3">
          <button class="btn btn-sm" @click="submitTemporaryPrize">
            {{ t('button.confirm') }}
          </button>
          <button class="btn btn-sm">
            {{ t('button.cancel') }}
          </button>
        </form>
      </div>
    </div>
  </dialog>
</template>

<style scoped>

</style>
