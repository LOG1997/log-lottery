<!-- eslint-disable vue/no-parsing-error -->
<script setup lang='ts'>
import { ref, onMounted } from 'vue';
import useStore from '@/store'
import { IPersonConfig } from '@/types/storeType';
import { storeToRefs } from 'pinia'
import * as XLSX from 'xlsx'
import { readFileBinary } from '@/utils/file'
import { filterData, addOtherInfo } from '@/utils'
import DaiysuiTable from '@/components/DaiysuiTable/index.vue'

const personConfig = useStore().personConfig
const globalConfig = useStore().globalConfig
const { getAllPersonList: allPersonList, getAlreadyPersonList: alreadyPersonList } = storeToRefs(personConfig)
const { getRowCount: rowCount } = storeToRefs(globalConfig)
const limitType = '.xlsx,.xls'
const excelData = ref<any[]>([])
// const personList = ref<any[]>([])

const resetDataDialog=ref()
const delAllDataDialog=ref()

const handleFileChange = async (e: Event) => {
    let dataBinary = await readFileBinary(((e.target as HTMLInputElement).files as FileList)[0]!)
    let workBook = XLSX.read(dataBinary, { type: 'binary', cellDates: true })
    let workSheet = workBook.Sheets[workBook.SheetNames[0]]
    excelData.value = XLSX.utils.sheet_to_json(workSheet)
    const uploadData = filterData(excelData.value, rowCount.value)
    const allData = addOtherInfo(uploadData);
    personConfig.resetPerson()
    personConfig.addNotPersonList(allData)
}
const exportData = () => {
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
            data[i].isWin = '是'
        } else {
            data[i].isWin = '否'
        }
        // 格式化数组为
        data[i].prizeTime=data[i].prizeTime.join(',')
        data[i].prizeName=data[i].prizeName.join(',')
    }
    let dataString = JSON.stringify(data)
    dataString = dataString
        .replaceAll(/uid/g, '编号')
        .replaceAll(/isWin/g, '是否中奖')
        .replaceAll(/department/g, '部门')
        .replaceAll(/name/g, '姓名')
        .replaceAll(/identity/g, '身份')
        .replaceAll(/prizeName/g, '获奖')
        .replaceAll(/prizeTime/g, '获奖时间')

    data = JSON.parse(dataString)

    if (data.length > 0) {
        const dataBinary = XLSX.utils.json_to_sheet(data)
        const dataBinaryBinary = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(dataBinaryBinary, dataBinary, 'Sheet1')
        XLSX.writeFile(dataBinaryBinary, 'data.xlsx')
    }
}

const resetData = () => {
    personConfig.resetAlreadyPerson()
}

const deleteAll = () => {
    personConfig.deleteAllPerson()
}

const delPersonItem = (row: IPersonConfig) => {
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
        formatValue(row: IPersonConfig) {
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
                onClick: (row: IPersonConfig) => {
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
    <dialog id="my_modal_1" ref="resetDataDialog" class="border-none modal">
        <div class="modal-box">
            <h3 class="text-lg font-bold">提示!</h3>
            <p class="py-4">该操作会清空人员中奖信息，是否继续？</p>
            <div class="modal-action">
                <form method="dialog" class="flex gap-3">
                    <!-- if there is a button in form, it will close the modal -->
                    <button class="btn" @click="resetDataDialog.close()">取消</button>
                    <button class="btn" @click="resetData">确定</button>
                </form>
            </div>
        </div>
    </dialog>
    <dialog id="my_modal_1" ref="delAllDataDialog" class="border-none modal">
        <div class="modal-box">
            <h3 class="text-lg font-bold">提示!</h3>
            <p class="py-4">该操作会删除所有人员数据，是否继续？</p>
            <div class="modal-action">
                <form method="dialog" class="flex gap-3">
                    <!-- if there is a button in form, it will close the modal -->
                    <button class="btn" @click="delAllDataDialog.close()">取消</button>
                    <button class="btn" @click="deleteAll">确定</button>
                </form>
            </div>
        </div>
    </dialog>
    <div class="min-w-1000px">
        
        <h2>人员管理</h2>
        <div class="flex gap-3">
            <button class="btn btn-error btn-sm" @click="delAllDataDialog.showModal()">全部删除</button>
            <div class="tooltip tooltip-bottom" data-tip="下载文件后，请在excel中填写数据，并保存为xlsx格式">
                <a class="no-underline btn btn-secondary btn-sm" download="人口登记表.xlsx" target="_blank"
                    href="/log-lottery/人口登记表.xlsx">下载模板</a>
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
            <button class="btn btn-error btn-sm" @click="resetDataDialog.showModal()">重置人员数据</button>
            <button class="btn btn-accent btn-sm" @click="exportData">导出结果</button>
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
