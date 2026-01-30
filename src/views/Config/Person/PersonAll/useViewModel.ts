import type { Ref } from 'vue'
import type { IPersonConfig } from '@/types/storeType'
import { cloneDeep } from 'lodash-es'
import { storeToRefs } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import { inject, ref, toRaw } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toast-notification'
import * as XLSX from 'xlsx'
import { loadingKey } from '@/components/Loading'
import i18n from '@/locales/i18n'
import useStore from '@/store'
import { addOtherInfo } from '@/utils'
import { readFileBinary, readLocalFileAsArraybuffer } from '@/utils/file'
import { tableColumns } from './columns'
import ImportExcelWorker from './importExcel.worker?worker'

type IBasePersonConfig = Pick<IPersonConfig, 'uid' | 'name' | 'department' | 'identity' | 'avatar'>

export function useViewModel({ exportInputFileRef }: { exportInputFileRef: Ref<HTMLInputElement> }) {
    const { t } = useI18n()
    const baseUrl = import.meta.env.BASE_URL.replace('./', '/')
    const toast = useToast()
    const worker: Worker | null = new ImportExcelWorker()
    const loading = inject(loadingKey)
    const personConfig = useStore().personConfig
    const { getAllPersonList: allPersonList, getAlreadyPersonList: alreadyPersonList } = storeToRefs(personConfig)
    const tableColumnList = tableColumns({ handleDeletePerson: delPersonItem })
    const addPersonModalVisible = ref(false)
    const singlePersonData = ref<IBasePersonConfig>({
        uid: '',
        name: '',
        department: '',
        avatar: '',
        identity: '',
    })
    async function getExcelTemplateContent() {
        const locale = i18n.global.locale.value
        if (locale === 'zhCn') {
            const templateData = await readLocalFileAsArraybuffer(`${baseUrl}人口登记表-zhCn.xlsx`)
            return templateData
        }
        else {
            const templateData = await readLocalFileAsArraybuffer(`${baseUrl}personListTemplate-en.xlsx`)
            return templateData
        }
    }
    /// 向worker发送消息
    function sendWorkerMessage(message: any) {
        if (worker) {
            worker.postMessage(message)
        }
    }
    /// 开始导入
    async function startWorker(data: string) {
        loading?.show()
        getExcelTemplateContent()
        sendWorkerMessage({ type: 'start', data, templateData: await getExcelTemplateContent() })
    }
    /**
     * 获取用户数据
     */
    async function handleFileChange(e: Event) {
        if (worker) {
            worker.onmessage = (e) => {
                if (e.data.type === 'done') {
                    personConfig.resetPerson()
                    personConfig.addNotPersonList(e.data.data)
                    // 提示导入成功
                    toast.open({
                        message: t('error.importSuccess'),
                        type: 'success',
                        position: 'top-right',
                    })
                    // 导入成功后清空file input
                    clearFileInput()
                }
                if (e.data.type === 'error') {
                    if (e.data.message === 'not right template') {
                        toast.open({
                            message: t('error.excelFileError'),
                            type: 'error',
                            position: 'top-right',
                        })
                        return
                    }
                    toast.open({
                        message: e.data.message || t('error.importFail'),
                        type: 'error',
                        position: 'top-right',
                    })
                    // toast.warning(e.data.message || '导入错误')
                }
                loading?.hide()
            }
        }
        const dataBinary = await readFileBinary(((e.target as HTMLInputElement).files as FileList)[0]!)
        startWorker(dataBinary)
    }
    // 清空file input
    function clearFileInput() {
        if (exportInputFileRef.value) {
            exportInputFileRef.value.value = ''
        }
    }
    function downloadTemplate() {
        // 下载
        const templateFileName = i18n.global.t('data.xlsxName')
        const fileUrl = `${baseUrl}${templateFileName}`
        fetch(fileUrl)
            .then(res => res.blob())
            .then((blob) => {
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = templateFileName
                a.click()
                toast.open({
                    message: t('error.downloadSuccess'),
                    type: 'success',
                    position: 'top-right',
                })
            })
    }

    // 导出数据
    function exportData() {
        const fieldConfig = [
            { originKey: 'uid', newKey: i18n.global.t('data.number') },
            { originKey: 'isWin', newKey: i18n.global.t('data.isWin'), handler: (obj: any) => obj.isWin ? i18n.global.t('data.yes') : i18n.global.t('data.no') },
            { originKey: 'department', newKey: i18n.global.t('data.department') },
            { originKey: 'avatar', newKey: i18n.global.t('data.avatar') },
            { originKey: 'name', newKey: i18n.global.t('data.name') },
            { originKey: 'identity', newKey: i18n.global.t('data.identity') },
            { originKey: 'prizeName', newKey: i18n.global.t('data.prizeName'), handler: (obj: any) => obj.prizeName.join(',') },
            { originKey: 'prizeTime', newKey: i18n.global.t('data.prizeTime'), handler: (obj: any) => obj.prizeTime.join(',') },
        ]
        const allowFieldKeys = fieldConfig.map(item => item.originKey)
        const originPersonData = cloneDeep(allPersonList.value)

        const data = originPersonData.map((item: any) => {
            const newItem = Object.fromEntries(
                Object.entries(item).filter(([key]) => allowFieldKeys.includes(key)),
            )
            fieldConfig.forEach(({ originKey, newKey, handler }) => {
                if (handler) {
                    newItem[originKey] = handler(item)
                }
                newItem[newKey] = newItem[originKey]
                delete newItem[originKey]
            })
            return newItem
        })
        if (data.length > 0) {
            const dataBinary = XLSX.utils.json_to_sheet(data)
            const dataBinaryBinary = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(dataBinaryBinary, dataBinary, 'Sheet1')
            XLSX.writeFile(dataBinaryBinary, 'data.xlsx')
            toast.open({
                message: t('error.exportSuccess'),
                type: 'success',
                position: 'top-right',
            })
        }
    }

    function resetData() {
        personConfig.resetAlreadyPerson()
    }

    function deleteAll() {
        personConfig.deleteAllPerson()
    }

    function delPersonItem(row: IPersonConfig) {
        personConfig.deletePerson(row)
    }
    function addOnePerson(addOnePersonDrawerRef: any, event: any) {
        event.preventDefault()
        // 表单中的验证信息清除

        const personData = addOtherInfo([toRaw(singlePersonData.value)])
        personData[0].id = uuidv4()
        personConfig.addOnePerson(personData)
        // singlePersonData.value = {} as IBasePersonConfig
        addOnePersonDrawerRef.closeDrawer()
        singlePersonData.value = {} as IBasePersonConfig
    }

    return {
        resetData,
        deleteAll,
        handleFileChange,
        exportData,
        alreadyPersonList,
        allPersonList,
        tableColumnList,
        addOnePerson,
        addPersonModalVisible,
        singlePersonData,
        downloadTemplate,
    }
}
