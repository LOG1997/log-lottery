<!-- eslint-disable vue/no-parsing-error -->
<script setup lang='ts'>
import { ref } from 'vue';
import useStore from '@/store'
import { IPersonConfig } from '@/types/storeType';
import { storeToRefs } from 'pinia';
import DaiysuiTable from '@/components/DaiysuiTable/index.vue'

const personConfig = useStore().personConfig

const { getAlreadyPersonList: alreadyPersonList, getAlreadyPersonDetail: alreadyPersonDetail } = storeToRefs(personConfig)
// const personList = ref<any[]>(
//     alreadyPersonList
// )


// const deleteAll = () => {
//     personConfig.deleteAllPerson()
// }

const isDetail = ref(false)
const handleMoveNotPerson = (row: IPersonConfig) => {
    personConfig.moveAlreadyToNot(row)
}

const tableColumnsList = [
    {
        label: '编号',
        props: 'uid',
        sort: true
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
        label: '身份',
        props: 'identity',
    },
    {
        label: '奖品',
        props: 'prizeName',
        sort: true
    },
    {
        label: '操作',
        actions: [
            {
                label: '移入未中奖名单',
                type: 'btn-info',
                onClick: (row: IPersonConfig) => {
                    handleMoveNotPerson(row)
                }
            },
        ]
    },
]
const tableColumnsDetail = [
    {
        label: '编号',
        props: 'uid',
        sort: true
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
        label: '身份',
        props: 'identity',
    },
    {
        label: '奖品',
        props: 'prizeName',
        sort: true
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
                onClick: (row: IPersonConfig) => {
                    handleMoveNotPerson(row)
                }
            },

        ]
    },
]
</script>

<template>
    <div class="overflow-y-auto">
        
        <h2>已中奖人员管理</h2>
        <div class="flex items-center justify-start gap-10">
            <!-- <button class="btn btn-error btn-sm" @click="deleteAll">全部删除</button> -->
            <div>
                <span>中奖人数：</span>
                <span>{{ alreadyPersonList.length }}</span>
            </div>
            <div class="flex flex-col">
                <div class="form-control">
                    <label class="cursor-pointer label">
                        <span class="label-text">详细信息:</span>
                        <input type="checkbox" class="border-solid toggle toggle-primary border-1" v-model="isDetail" />
                    </label>
                </div>
            </div>
        </div>
        <DaiysuiTable v-if="!isDetail" :tableColumns="tableColumnsList" :data="alreadyPersonList"></DaiysuiTable>

        <DaiysuiTable v-if="isDetail" :tableColumns="tableColumnsDetail" :data="alreadyPersonDetail"></DaiysuiTable>
    </div>
</template>

<style lang='scss' scoped></style>
