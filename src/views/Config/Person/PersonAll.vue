<!-- eslint-disable vue/no-parsing-error -->
<script setup lang='ts'>
import type { IPersonConfig } from '@/types/storeType'
import DaiysuiTable from '@/components/DaiysuiTable/index.vue'
import i18n from '@/locales/i18n'
import useStore from '@/store'
import { addOtherInfo } from '@/utils'
import { readFileBinary } from '@/utils/file'
import { fetchFingerprints, deleteFingerprintByName } from '@/api/lottery'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import * as XLSX from 'xlsx'

const { t } = useI18n()
const personConfig = useStore().personConfig
const themeStore = useStore().themeStore
const { getAllPersonList: allPersonList, getAlreadyPersonList: alreadyPersonList } = storeToRefs(personConfig)
const limitType = '.xlsx,.xls'

// 指纹映射表 (personName -> fingerprint)
const fingerprintMap = ref<Record<string, string>>({})

const resetDataDialog = ref()
const delAllDataDialog = ref()

// 加载指纹数据
async function loadFingerprints() {
  const themeId = themeStore.currentThemeId
  if (!themeId) return
  
  const fingerprints = await fetchFingerprints(themeId)
  fingerprintMap.value = {}
  fingerprints.forEach((fp: any) => {
    if (fp.person_name) {
      fingerprintMap.value[fp.person_name] = fp.fingerprint
    }
  })
}

async function handleFileChange(e: Event) {
  const dataBinary = await readFileBinary(((e.target as HTMLInputElement).files as FileList)[0]!)
  const workBook = XLSX.read(dataBinary, { type: 'binary', cellDates: true })
  const workSheet = workBook.Sheets[workBook.SheetNames[0]]
  const excelData = XLSX.utils.sheet_to_json(workSheet)
  const allData = addOtherInfo(excelData)
  personConfig.resetPerson()
  personConfig.addNotPersonList(allData)
}
function exportData() {
  let data = JSON.parse(JSON.stringify(allPersonList.value))
  // 排除一些字段
  for (let i = 0; i < data.length; i++) {
    delete data[i].x
    delete data[i].y
    delete data[i].id
    delete data[i].createTime
    delete data[i].updateTime
    delete data[i].prizeId
    // 修改字段名称
    if (data[i].isWin) {
      data[i].isWin = i18n.global.t('data.yes')
    }
    else {
      data[i].isWin = i18n.global.t('data.no')
    }
    // 格式化数组为
    data[i].prizeTime = data[i].prizeTime.join(',')
    data[i].prizeName = data[i].prizeName.join(',')
  }
  let dataString = JSON.stringify(data)
  dataString = dataString
    .replaceAll(/uid/g, i18n.global.t('data.number'))
    .replaceAll(/isWin/g, i18n.global.t('data.isWin'))
    .replaceAll(/department/g, i18n.global.t('data.department'))
    .replaceAll(/name/g, i18n.global.t('data.name'))
    .replaceAll(/identity/g, i18n.global.t('data.identity'))
    .replaceAll(/prizeName/g, i18n.global.t('data.prizeName'))
    .replaceAll(/prizeTime/g, i18n.global.t('data.prizeTime'))

  data = JSON.parse(dataString)

  if (data.length > 0) {
    const dataBinary = XLSX.utils.json_to_sheet(data)
    const dataBinaryBinary = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(dataBinaryBinary, dataBinary, 'Sheet1')
    XLSX.writeFile(dataBinaryBinary, 'data.xlsx')
  }
}

function resetData() {
  personConfig.resetAlreadyPerson()
}

function deleteAll() {
  personConfig.deleteAllPerson()
}

async function delPersonItem(row: IPersonConfig) {
  const themeId = themeStore.currentThemeId
  
  // 同时删除指纹记录
  if (themeId && row.name) {
    await deleteFingerprintByName(themeId, row.name)
    // 更新本地指纹映射
    delete fingerprintMap.value[row.name]
  }
  
  personConfig.deletePerson(row)
}

// 获取用户的指纹（截取前8位显示）
function getFingerprint(name: string): string {
  const fp = fingerprintMap.value[name]
  return fp ? fp.substring(0, 8) + '...' : '-'
}

const tableColumns = [
  {
    label: i18n.global.t('data.number'),
    props: 'uid',
  },
  {
    label: i18n.global.t('data.name'),
    props: 'name',
  },
  {
    label: i18n.global.t('data.department'),
    props: 'department',
  },
  {
    label: i18n.global.t('data.avatar'),
    props: 'avatar',
    formatValue(row: any) {
      return row.avatar ? `<img src="${row.avatar}" alt="avatar" style="width: 50px; height: 50px;"/>` : '-'
    },
  },
  {
    label: i18n.global.t('data.identity'),
    props: 'identity',
  },
  {
    label: i18n.global.t('data.fingerprint'),
    props: 'name',
    formatValue(row: IPersonConfig) {
      return `<span class="text-xs font-mono opacity-70" title="${fingerprintMap.value[row.name] || ''}">${getFingerprint(row.name)}</span>`
    },
  },
  {
    label: i18n.global.t('data.isWin'),
    props: 'isWin',
    formatValue(row: IPersonConfig) {
      return row.isWin ? i18n.global.t('data.yes') : i18n.global.t('data.no')
    },
  },
  {
    label: i18n.global.t('data.operation'),
    actions: [
      {
        label: i18n.global.t('data.delete'),
        type: 'btn-error',
        onClick: (row: IPersonConfig) => {
          delPersonItem(row)
        },
      },
    ],
  },
]

onMounted(() => {
  loadFingerprints()
})
</script>

<template>
  <dialog id="my_modal_1" ref="resetDataDialog" class="border-none modal">
    <div class="modal-box">
      <h3 class="text-lg font-bold">
        {{ t('dialog.titleTip') }}
      </h3>
      <p class="py-4">
        {{ t('dialog.dialogResetWinner') }}
      </p>
      <div class="modal-action">
        <form method="dialog" class="flex gap-3">
          <!-- if there is a button in form, it will close the modal -->
          <button class="btn" @click="resetDataDialog.close()">
            {{ t('button.cancel') }}
          </button>
          <button class="btn" @click="resetData">
            {{ t('button.confirm') }}
          </button>
        </form>
      </div>
    </div>
  </dialog>
  <dialog id="my_modal_1" ref="delAllDataDialog" class="border-none modal">
    <div class="modal-box">
      <h3 class="text-lg font-bold">
        {{ t('dialog.titleTip') }}
      </h3>
      <p class="py-4">
        {{ t('dialog.dialogDelAllPerson') }}
      </p>
      <div class="modal-action">
        <form method="dialog" class="flex gap-3">
          <!-- if there is a button in form, it will close the modal -->
          <button class="btn" @click="delAllDataDialog.close()">
            {{ t('button.cancel') }}
          </button>
          <button class="btn" @click="deleteAll">
            {{ t('button.confirm') }}
          </button>
        </form>
      </div>
    </div>
  </dialog>
  <div class="min-w-1000px">
    <h2>{{ t('viewTitle.personManagement') }}</h2>
    <div class="flex gap-3">
      <button class="btn btn-error btn-sm" @click="delAllDataDialog.showModal()">
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
              id="explore" type="file" class="" style="display: none" :accept="limitType"
              @change="handleFileChange"
            >

            <span class="btn btn-primary btn-sm">{{ t('button.importData') }}</span>
          </div>
        </label>
      </div>
      <button class="btn btn-error btn-sm" @click="resetDataDialog.showModal()">
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
    <DaiysuiTable :table-columns="tableColumns" :data="allPersonList" />
  </div>
</template>

<style lang='scss' scoped></style>
