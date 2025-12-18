import type { Ref } from 'vue'
import type { IPersonConfig } from '@/types/storeType'
import { storeToRefs } from 'pinia'
import { inject, ref } from 'vue'
import { toast } from 'vue-sonner'
import * as XLSX from 'xlsx'
import { loadingKey } from '@/components/Loading'
import i18n from '@/locales/i18n'
import useStore from '@/store'
import { readFileBinary, readLocalFileAsArraybuffer } from '@/utils/file'
import { tableColumns } from './columns'
import ImportExcelWorker from './importExcel.worker?worker'

export function useViewModel({ exportInputFileRef }: { exportInputFileRef: Ref<HTMLInputElement> }) {
    const worker: Worker | null = new ImportExcelWorker()
    const loading = inject(loadingKey)
    const personConfig = useStore().personConfig
    const { getAllPersonList: allPersonList, getAlreadyPersonList: alreadyPersonList } = storeToRefs(personConfig)
    const tableColumnList = tableColumns({ handleDeletePerson: delPersonItem })
    const addPersonModalVisible = ref(false)
    const singlePersonData = ref<IPersonConfig>({
        uid: '',
        name: '',
        department: '',
        avatar?: '',
        identity: '',
    })
    async function getExcelTemplateContent() {
        const locale = i18n.global.locale.value
        if (locale === 'zhCn') {
            const templateData = await readLocalFileAsArraybuffer('/log-lottery/人口登记表-zhCn.xlsx')
            return templateData
        }
        else {
            const templateData = await readLocalFileAsArraybuffer('/log-lottery/personListTemplate-en.xlsx')
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
                    // 导入成功后清空file input
                    clearFileInput()
                }
                if (e.data.type === 'error') {
                    toast.warning(e.data.message || '导入错误')
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
    /// 导出数据
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

    function delPersonItem(row: IPersonConfig) {
        personConfig.deletePerson(row)
    }
    function addOnePerson(addOnePersonDrawerRef: any, event: any) {
        console.log('addOnePerson')
        event.preventDefault()

        console.log('addOnePerson1')

        // 表单验证通过，执行添加人员逻辑
        // 这里假设 addOnePerson 返回一个 Promise，表示操作完成
        // Promise.resolve(addOnePerson()).then(() => {
        //     // 成功后关闭抽屉
        addOnePersonDrawerRef.closeDrawer()

        //     // 可选：重置表单
        //     form.reset()
        // }).catch((error) => {
        //     // 处理可能的错误情况
        //     console.error('添加人员失败:', error)
        // })
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
    }
}
