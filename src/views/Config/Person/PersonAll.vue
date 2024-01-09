<!-- eslint-disable vue/no-parsing-error -->
<script setup lang='ts'>
import { ref, onMounted } from 'vue';
import useStore from '@/store'
import { storeToRefs } from 'pinia'
import * as XLSX from 'xlsx'
import { readFile } from '@/utils/file'
import { filterData, addOtherInfo } from '@/utils'
import DaiysuiTable from '@/components/DaiysuiTable/index.vue'

const personConfig = useStore().personConfig
const globalConfig = useStore().globalConfig
const { getAllPersonList: allPersonList,getAlreadyPersonList:alreadyPersonList } = storeToRefs(personConfig)
const { getRowCount: rowCount } = storeToRefs(globalConfig)
const limitType = '.xlsx,.xls'
const excelData = ref<any[]>([])
// const personList = ref<any[]>([])


const handleFileChange = async (e: any) => {
    let dataBinary = await readFile(e.target.files[0])
    let workBook = XLSX.read(dataBinary, { type: 'binary', cellDates: true })
    let workSheet = workBook.Sheets[workBook.SheetNames[0]]
    excelData.value = XLSX.utils.sheet_to_json(workSheet)
    const uploadData = filterData(excelData.value, rowCount.value)
    const allData = addOtherInfo(uploadData);
    personConfig.resetPerson()
    personConfig.addNotPersonList(allData)
}

const deleteAll = () => {
    personConfig.deleteAllPerson()
}

const delPersonItem = (row: any) => {
    personConfig.deletePerson(row)
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
        label: '身份',
        props: 'identity',
    },
    {
        label: '是否已中奖',
        props: 'isWin',
        formatValue(row: any) {
            return row.isWin ? '是' : '否'
        }
    },
    {
        label: '操作',
        actions: [
            // {
            //     label: '编辑',
            //     type: 'btn-info',
            //     onClick: (row: any) => {
            //         delPersonItem(row)
            //     }
            // },
            {
                label: '删除',
                type: 'btn-error',
                onClick: (row: any) => {
                    delPersonItem(row)
                }
            },

        ]
    },
]
onMounted(() => {
})
</script>

<template>
    <div class="min-w-1000px">
        <div class="flex gap-3 justify-">
            <button class="btn btn-error btn-sm" @click="deleteAll">全部删除</button>
            <div class="tooltip tooltip-bottom" data-tip="下载文件后，请在excel中填写数据，并保存为xlsx格式">
                <a class="no-underline btn btn-secondary btn-sm" download="人口登记表.xlsx" target="_blank" href="/log-lottery/人口登记表.xlsx">下载模板</a>
            </div>
            <div class="">
                <label for="explore">

                    <div class="tooltip tooltip-bottom" data-tip="上传修改好的excel文件">
                        <input type="file" class="" id="explore" style="display: none" @change="handleFileChange"
                            :accept="limitType" />

                        <span class="btn btn-primary btn-sm">上传文件</span>
                    </div>
                </label>
                <!-- <button class="btn btn-primary btn-sm">上传excel</button> -->

            </div>
            <div>
                <span>中奖人数：</span>
                <span>{{ alreadyPersonList.length }}</span>
                <span>&nbsp;/&nbsp;</span>
                <span>{{ allPersonList.length }}</span>
            </div>
        </div>
        <DaiysuiTable :tableColumns="tableColumns" :data="allPersonList"></DaiysuiTable>
    </div>
</template>

<style lang='scss' scoped></style>
