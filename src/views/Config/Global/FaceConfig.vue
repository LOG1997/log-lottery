<script setup lang='ts'>
import { ref, watch } from 'vue'
import useStore from '@/store'
import zod from 'zod';

const personConfig = useStore().personConfig
const { getTableRowCount: tableRowCount, getShowField} = personConfig

const formData = ref({
    rowCount: tableRowCount,
    showField: getShowField
})
const formErr = ref({
    rowCount: '',
})

const schema = zod.object({
    rowCount: zod.number({
        required_error: '必填项',
        invalid_type_error: '必须填入数字',
    })
        .min(1, '最小为1')
        .max(100, '最大为100')
    // 格式化


})
type ValidatePayload = zod.infer<typeof schema>
const payload: ValidatePayload = {
    rowCount: formData.value.rowCount,
}
const parseSchema = (props: ValidatePayload) => {
    return schema.parseAsync(props)
}


const handleChangeShowFields = (fieldItem: any) => {
    formData.value.showField.map((item)=>{
        if(item.label===fieldItem.label){
            item.value=!item.value
        }
    })
}

watch(() => formData.value.rowCount, () => {
    payload.rowCount = formData.value.rowCount
    parseSchema(payload).then(res => {
        console.log('code line-40 \n\r😀 res:\n\r', res);
        if(res.rowCount){
            personConfig.setTableRowCount(res.rowCount)
        }
    })
        .catch(err => {
            formErr.value.rowCount = err.issues[0].message
        })
})
watch(() => formData.value.showField, () => {
    personConfig.setShowFields(formData.value.showField)
},{deep:true})
</script>

<template>
    <div>
        <label class="w-full max-w-xs mb-10 form-control">
            <div class="label">
                <span class="label-text">列数</span>
            </div>
            <input type="number" v-model="formData.rowCount" placeholder="Type here"
                class="w-full max-w-xs input input-bordered" />
            <div class="help">
                <span class="text-sm text-red-400 help-text" v-if="formErr.rowCount">
                    {{ formErr.rowCount }}
                </span>
            </div>
        </label>
        <label class="w-full max-w-xs form-control">
            <div class="label">
                <span class="label-text">展示字段</span>
            </div>
            <ul class="flex gap-6 pl-0">
                <li v-for="item in formData.showField" :key="item" class="flex items-center gap-1">
                    <input type="checkbox" :checked="item.value" class="border-solid checkbox checkbox-primary border-1"   @change="handleChangeShowFields(item)"/>
                    <span class="label-text">{{ item.label }}</span>
                </li>
            </ul>
        </label>
    </div>
</template>

<style lang='scss' scoped></style>
