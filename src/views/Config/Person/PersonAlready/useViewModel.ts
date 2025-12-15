import type { IPersonConfig } from '@/types/storeType'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import useStore from '@/store'
import { tableColumns } from './columns'

export function useViewModel() {
    const personConfig = useStore().personConfig

    const { getAlreadyPersonList: alreadyPersonList, getAlreadyPersonDetail: alreadyPersonDetail } = storeToRefs(personConfig)

    const isDetail = ref(false)
    function handleMoveNotPerson(row: IPersonConfig) {
        personConfig.moveAlreadyToNot(row)
    }

    const tableColumnsList = tableColumns({ showPrizeTime: false, handleDeletePerson: handleMoveNotPerson })
    const tableColumnsDetail = tableColumns({ showPrizeTime: true, handleDeletePerson: handleMoveNotPerson })
    return {
        alreadyPersonList,
        alreadyPersonDetail,
        isDetail,
        tableColumnsList,
        tableColumnsDetail,
    }
}
