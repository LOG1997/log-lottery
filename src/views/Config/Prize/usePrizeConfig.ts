import type { IPrizeConfig } from '@/types/storeType'
import localforage from 'localforage'
import { cloneDeep } from 'lodash-es'
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch } from 'vue'
import { useToast } from 'vue-toast-notification'
import * as XLSX from 'xlsx'
import i18n from '@/locales/i18n'
import useStore from '@/store'

export function usePrizeConfig() {
    const toast = useToast()
    const imageDbStore = localforage.createInstance({
        name: 'imgStore',
    })
    const prizeConfig = useStore().prizeConfig
    const globalConfig = useStore().globalConfig
    const { getPrizeConfig: localPrizeList, getCurrentPrize: currentPrize } = storeToRefs(prizeConfig)

    const { getImageList: localImageList } = storeToRefs(globalConfig)
    const imgList = ref<any[]>([])

    const prizeList = ref(cloneDeep(localPrizeList.value))
    const selectedPrize = ref<IPrizeConfig | null>()

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
        toast.success(i18n.global.t('error.deleteSuccess'))
    }
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
        prizeList.value.push(defaultPrizeCOnfig)
        toast.success(i18n.global.t('error.success'))
    }
    function resetDefault() {
        prizeConfig.resetDefault()
        prizeList.value = cloneDeep(localPrizeList.value)
        toast.success(i18n.global.t('error.success'))
    }
    async function delAll() {
        prizeList.value = []
        toast.success(i18n.global.t('error.success'))
    }
    onMounted(() => {
        getImageDbStore()
    })
    watch(() => prizeList.value, (val: IPrizeConfig[]) => {
        prizeConfig.setPrizeConfig(val)
    }, { deep: true })

    function exportExcel() {
        const data = prizeList.value.map(item => ({
            [i18n.global.t('table.prizeName')]: item.name,
            [i18n.global.t('table.numberParticipants')]: item.count,
        }))
        const ws = XLSX.utils.json_to_sheet(data)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
        const date = new Date().toISOString().split('T')[0]
        XLSX.writeFile(wb, `${i18n.global.t('button.prizeExportFileName')}_${date}.xlsx`)
        toast.success(i18n.global.t('error.success'))
    }

    function downloadTemplate() {
        const data = [
            {
                [i18n.global.t('table.prizeName')]: i18n.global.t('button.prizeTemplateExample'),
                [i18n.global.t('table.numberParticipants')]: 1,
            },
        ]
        const ws = XLSX.utils.json_to_sheet(data)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
        XLSX.writeFile(wb, i18n.global.t('button.prizeTemplateFileName'))
        toast.success(i18n.global.t('error.success'))
    }

    function importExcel() {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = '.xlsx,.xls'
        input.onchange = (e: Event) => {
            const file = (e.target as HTMLInputElement).files?.[0]
            if (!file)
                return
            const reader = new FileReader()
            reader.onload = (event) => {
                const data = new Uint8Array(event.target?.result as ArrayBuffer)
                const workbook = XLSX.read(data, { type: 'array' })
                const sheetName = workbook.SheetNames[0]
                const sheet = workbook.Sheets[sheetName]
                const jsonData = XLSX.utils.sheet_to_json(sheet)

                const newPrizes: IPrizeConfig[] = jsonData.map((row: any) => ({
                    id: new Date().getTime().toString() + Math.random().toString(36).slice(2),
                    name: row[i18n.global.t('table.prizeName')] || i18n.global.t('data.prizeName'),
                    sort: 0,
                    isAll: false,
                    count: Number(row[i18n.global.t('table.numberParticipants')]) || 1,
                    isUsedCount: 0,
                    picture: { id: '', name: '', url: '' },
                    separateCount: { enable: false, countList: [] },
                    desc: '',
                    isUsed: false,
                    isShow: true,
                    frequency: 1,
                }))

                prizeList.value = [...prizeList.value, ...newPrizes]
                toast.success(i18n.global.t('error.success'))
            }
            reader.readAsArrayBuffer(file)
        }
        input.click()
    }

    return {
        addPrize,
        resetDefault,
        delAll,
        delItem,
        prizeList,
        currentPrize,
        selectedPrize,
        submitData,
        changePrizePerson,
        changePrizeStatus,
        selectPrize,
        localImageList,
        exportExcel,
        importExcel,
        downloadTemplate,
    }
}
