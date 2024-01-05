<!-- eslint-disable vue/no-parsing-error -->
<script setup lang='ts'>
import { ref } from 'vue';
import useStore from '@/store'
import * as XLSX from 'xlsx'
import { readFile } from '@/utils/file'
import DaiysuiTable from '@/components/DaiysuiTable/index.vue'

const personConfig = useStore().personConfig

const { getAlreadyPersonList: alreadyPersonList, getNotPersonList: notPersonList ,getTableRowCount:rowCount} = personConfig
const limitType = '.xlsx,.xls'
const excelData = ref<any[]>([])
const personList = ref<any[]>(
    notPersonList.concat(alreadyPersonList)
)
const handleFileChange = async (e: any) => {
    let dataBinary = await readFile(e.target.files[0])
    let workBook = XLSX.read(dataBinary, { type: 'binary', cellDates: true })
    let workSheet = workBook.Sheets[workBook.SheetNames[0]]
    excelData.value = XLSX.utils.sheet_to_json(workSheet)
    personList.value = filterData(excelData.value)

    personConfig.resetPerson()
    personConfig.addNotPersonList(personList.value)
}

const filterData = (tableData: any[]) => {
    const dataLength = tableData.length
    let j = 0;
    for (let i = 0; i < dataLength; i++) {
        if (i % rowCount === 0) {
            j++;
        }
        tableData[i].x = i % rowCount + 1;
        tableData[i].y = j;
        tableData[i].id = i;
        // 是否中奖
        tableData[i].isWin = false
    }
    
return personList.value = tableData
}
const deleteAll = () => {
    personConfig.deleteAllPerson()
    personList.value = notPersonList.concat(alreadyPersonList)
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
        label:'是否已中奖',
        props: 'isWin',
        formatValue(row: any) {
            return row.isWin? '是' : '否'
        }
    },
    {
        label: '操作',
        actions: [
            {
                label: '编辑',
                type: 'btn-info',
                onClick: (row: any) => {
                    console.log('编辑:', row)
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
    <div class="">
        <div class="flex justify-center gap-3">
            <button class="btn btn-error btn-sm" @click="deleteAll">全部删除</button>
            <div class="">
                <label for="explore">
                <input type="file"
                    class=""
                    id="explore"
                    style="display: none"
                    @change="handleFileChange" :accept="limitType" />
                    <span class="btn btn-primary btn-sm">上传文件</span>
                </label>
                <!-- <button class="btn btn-primary btn-sm">上传excel</button> -->

            </div>
        </div>
        <DaiysuiTable :tableColumns="tableColumns" :data="personList"></DaiysuiTable>
    </div>
</template>

<style lang='scss' scoped></style>
