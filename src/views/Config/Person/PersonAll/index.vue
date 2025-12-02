<!-- eslint-disable vue/no-parsing-error -->
<script setup lang='ts'>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import DaiysuiTable from '@/components/DaiysuiTable/index.vue'
import CustomDialog from '@/components/Dialog/index.vue'
import PageHeader from '@/components/PageHeader/index.vue'
import { useViewModel } from './useViewModel'

const resetDataDialogRef = ref()
const delAllDataDialogRef = ref()
const exportInputFileRef = ref()
const { resetData, deleteAll, handleFileChange, exportData, alreadyPersonList, allPersonList, tableColumns } = useViewModel({ exportInputFileRef })
const { t } = useI18n()
const limitType = '.xlsx,.xls'
</script>

<template>
  <CustomDialog
    ref="resetDataDialogRef"
    :title="t('dialog.titleTip')"
    :desc="t('dialog.dialogResetWinner')"
    :submit-func="resetData"
  />
  <CustomDialog
    ref="delAllDataDialogRef"
    :title="t('dialog.titleTip')"
    :desc="t('dialog.dialogDelAllPerson')"
    :submit-func="deleteAll"
  />

  <div class="min-w-1000px">
    <PageHeader :title="t('viewTitle.personManagement')">
      <template #buttons>
        <div class="flex gap-3">
          <button class="btn btn-error btn-sm" @click="delAllDataDialogRef.showDialog()">
            {{ t('button.allDelete') }}
          </button>
          <div class="tooltip tooltip-bottom" :data-tip="t('tooltip.downloadTemplateTip')">
            <a
              class="no-underline btn btn-secondary btn-sm" :download="t('data.xlsxName')" target="_blank"
              :href="`/log-lottery/${t('data.xlsxName')}`"
            >{{ t('button.downloadTemplate') }}</a>
          </div>
          <div class="">
            <label for="explore">
              <div class="tooltip tooltip-bottom" :data-tip="t('tooltip.uploadExcelTip')">
                <input
                  id="explore" ref="exportInputFileRef" type="file" class="" style="display: none"
                  :accept="limitType" @change="handleFileChange"
                >

                <span class="btn btn-primary btn-sm">{{ t('button.importData') }}</span>
              </div>
            </label>
          </div>
          <button class="btn btn-error btn-sm" @click="resetDataDialogRef.showDialog()">
            {{ t('button.resetData') }}
          </button>
          <button class="btn btn-accent btn-sm" @click="exportData">
            {{ t('button.exportResult') }}
          </button>
          <div>
            <span>{{ t('table.luckyPeopleNumber') }}:</span>
            <span>{{ alreadyPersonList.length }}</span>
            <span>&nbsp;/&nbsp;</span>
            <span>{{ allPersonList.length }}</span>
          </div>
        </div>
      </template>
    </PageHeader>

    <DaiysuiTable :table-columns="tableColumns" :data="allPersonList" />
  </div>
</template>

<style lang='scss' scoped></style>
