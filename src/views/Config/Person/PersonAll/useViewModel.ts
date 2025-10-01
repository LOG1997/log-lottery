import type { IPersonConfig } from '@/types/storeType'
import { storeToRefs } from 'pinia'
import * as XLSX from 'xlsx'
import i18n from '@/locales/i18n'
import useStore from '@/store'
import { readFileBinary } from '@/utils/file'
import ImportExcelWorker from './importExcel.worker?worker'

export function useViewModel() {
    const worker: Worker | null = new ImportExcelWorker()
    const personConfig = useStore().personConfig
    const { getAllPersonList: allPersonList, getAlreadyPersonList: alreadyPersonList } = storeToRefs(personConfig)
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
            label: i18n.global.t('data.isWin'),
            props: 'isWin',
            formatValue(row: IPersonConfig) {
                return row.isWin ? i18n.global.t('data.yes') : i18n.global.t('data.no')
            },
        },
        {
            label: i18n.global.t('data.operation'),
            actions: [
                // {
                //     label: '编辑',
                //     type: 'btn-info',
                //     onClick: (row: any) => {
                //         delPersonItem(row)
                //     }
                // },
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
    /// 向worker发送消息
    function sendWorkerMessage(message: any) {
        if (worker) {
            worker.postMessage(message)
        }
    }
    /// 开始导入
    function startWorker(data: Event) {
        sendWorkerMessage({ type: 'start', data })
    }
    /**
     * 获取用户数据
     */
    async function handleFileChange(e: Event) {
        //   worker = new ImportExcelWorker()
        if (worker) {
            worker.onmessage = (e) => {
                if (e.data.type === 'done') {
                    personConfig.resetPerson()
                    personConfig.addNotPersonList(e.data.data)
                }
            }
        }
        const dataBinary = await readFileBinary(((e.target as HTMLInputElement).files as FileList)[0]!)
        startWorker(dataBinary)
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
    return {
        resetData,
        deleteAll,
        handleFileChange,
        exportData,
        alreadyPersonList,
        allPersonList,
        tableColumns,
    }
}
