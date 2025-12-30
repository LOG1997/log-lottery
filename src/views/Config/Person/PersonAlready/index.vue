<script setup lang='ts'>
import { useI18n } from 'vue-i18n'
import DaiysuiTable from '@/components/DaiysuiTable/index.vue'
import PageHeader from '@/components/PageHeader/index.vue'
import { useViewModel } from './useViewModel'

const { t } = useI18n()

const { alreadyPersonList, alreadyPersonDetail, isDetail, tableColumnsList, tableColumnsDetail } = useViewModel()
</script>

<template>
  <div class="overflow-y-auto">
    <PageHeader :title="t('viewTitle.winnerManagement')">
      <template #buttons>
        <div class="flex items-center justify-start gap-10">
          <div>
            <span>{{ t('table.luckyPeopleNumber') }}：</span>
            <span>{{ alreadyPersonList.length }}</span>
          </div>

          <div class="flex flex-col">
            <div class="form-control">
              <label class="label flex items-center gap-2">
                <p class="label-text">{{ t('table.detail') }}:</p>
                <div class="flex items-center">
                  <!-- <Switch v-model="isDetail" class="cursor-pointer" /> -->
                  <input v-model="isDetail" type="checkbox" :checked="isDetail" class="toggle toggle-primary">
                </div>
              </label>
            </div>
          </div>
        </div>
      </template>
    </PageHeader>

    <DaiysuiTable v-if="!isDetail" :table-columns="tableColumnsList" :data="alreadyPersonList" />

    <DaiysuiTable v-if="isDetail" :table-columns="tableColumnsDetail" :data="alreadyPersonDetail" />
  </div>
</template>

<style lang='scss' scoped></style>
