<!-- eslint-disable vue/no-parsing-error -->
<script setup lang='ts'>
import { ref } from 'vue';
import useStore from '@/store'
import { storeToRefs } from 'pinia';
import DaiysuiTable from '@/components/DaiysuiTable/index.vue'

const personConfig = useStore().personConfig

const { getAlreadyPersonList: alreadyPersonList } = storeToRefs(personConfig)
// const personList = ref<any[]>(
//     alreadyPersonList
// )


const deleteAll = () => {
    personConfig.deleteAllPerson()
}
const handleMoveNotPerson=(row:any)=>{
    personConfig.moveAlreadyToNot(row)
}

const tableColumns = [
    {
        label: '编号',
        props: 'uid',
    },
    {
        label: '姓名',
        props: 'name',
    },
    {
        label: '部门',
        props: 'department',
    },
    {
        label: '职位',
        props: 'other',
    },
    {
        label:'奖品',
        props:'prizeName'
    },
    {
        label: '中奖时间',
        props: 'prizeTime',

    },
    {
        label: '操作',
        actions: [
            {
                label: '移入未中奖名单',
                type: 'btn-info',
                onClick: (row: any) => {
                    handleMoveNotPerson(row)
                }
            },
            {
                label: '删除',
                type: 'btn-error',
                onClick: (row: any) => {
                    console.log('删除:', row)
                }
            },

        ]
    },
]
</script>

<template>
    <div class="overflow-y-auto">
        <div class="flex justify-center gap-3">
            <button class="btn btn-error btn-sm" @click="deleteAll">全部删除</button>
           
        </div>
        <DaiysuiTable :tableColumns="tableColumns" :data="alreadyPersonList"></DaiysuiTable>
    </div>
</template>

<style lang='scss' scoped></style>
