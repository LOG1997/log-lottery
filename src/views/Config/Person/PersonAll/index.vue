<!-- eslint-disable vue/no-parsing-error -->
<script setup lang='ts'>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import DaiysuiTable from '@/components/DaiysuiTable/index.vue'
import CustomDialog from '@/components/Dialog/index.vue'
import CustomDrawer from '@/components/Drawer/index.vue'
import PageHeader from '@/components/PageHeader/index.vue'
import { useViewModel } from './useViewModel'

const resetDataDialogRef = ref()
const delAllDataDialogRef = ref()
const exportInputFileRef = ref()
const addOnePersonDrawerRef = ref()
const { resetData, deleteAll, handleFileChange, exportData, addOnePerson, singlePersonData, alreadyPersonList, allPersonList, tableColumnList } = useViewModel({ exportInputFileRef })
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
  <CustomDrawer ref="addOnePersonDrawerRef">
    <template #content>
      <form class="fieldset rounded-box w-xs p-4" @submit="(e) => addOnePerson(addOnePersonDrawerRef, e)">
        <label class="fieldset">
          <span class="label">编号</span>
          <input v-model="singlePersonData" type="password" class="input validator" placeholder="编号">
        </label>
        <fieldset class="fieldset">
          <label class="label" required>姓名<span class="text-red-500">*</span></label>
          <input type="text" class="input validator" placeholder="姓名" required minlength="1">
          <p class="validator-hint hidden">
            请填写姓名
          </p>
        </fieldset>
        <label class="fieldset">
          <span class="label">部门</span>
          <input type="password" class="input validator" placeholder="部门">
        </label>
        <label class="fieldset">
          <span class="label">头像</span>
          <input type="password" class="input validator" placeholder="头像">
        </label>
        <label class="fieldset">
          <span class="label">身份</span>
          <input type="password" class="input validator" placeholder="身份">
        </label>
        <button class="btn btn-neutral mt-4" type="submit">
          确定
        </button>
        <button class="btn btn-ghost mt-1" type="reset" @click="addOnePersonDrawerRef.closeDrawer()">
          取消
        </button>
      </form>
    </template>
  </CustomDrawer>

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
          <button class="btn btn-neutral btn-sm" @click="addOnePersonDrawerRef.showDrawer()">
            添加
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

    <DaiysuiTable :table-columns="tableColumnList" :data="allPersonList" />
  </div>
</template>

<style lang='scss' scoped></style>
