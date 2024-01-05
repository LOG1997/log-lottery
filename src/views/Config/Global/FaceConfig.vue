<script setup lang='ts'>
import { ref, watch, onMounted } from 'vue'
import useStore from '@/store'
import { themeChange } from 'theme-change';
import zod from 'zod';
import daisyuiThemes from 'daisyui/src/theming/themes'
import { ColorPicker } from 'vue3-colorpicker';
import 'vue3-colorpicker/style.css';
import {isRgbOrRgba,isHex} from '@/utils/color'

const personConfig = useStore().personConfig
const globalConfig = useStore().globalConfig
const { getTheme: localTheme, getCardColor: cardColor,getTextColor:textColor,getCardSize:cardSize,getTextSize: textSize} = globalConfig
const { getTableRowCount: tableRowCount, getShowField } = personConfig
const colorPickerRef = ref()

interface ThemeDaType {
    [key: string]: any
}
const themeValue = ref(localTheme.name)
const cardColorValue = ref(cardColor)
const textColorValue = ref(textColor)
const cardSizeValue = ref(cardSize)
const textSizeValue = ref(textSize)
const themeList = ref(Object.keys(daisyuiThemes))
const daisyuiThemeList = ref<ThemeDaType>(daisyuiThemes)
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


// const handleChangeShowFields = (fieldItem: any) => {
//     formData.value.showField.map((item) => {
//         if (item.label === fieldItem.label) {
//             item.value = !item.value
//         }
//     })
// }

watch(() => formData.value.rowCount, () => {
    payload.rowCount = formData.value.rowCount
    parseSchema(payload).then(res => {
        if (res.rowCount) {
            personConfig.setTableRowCount(res.rowCount)
        }
    })
        .catch(err => {
            formErr.value.rowCount = err.issues[0].message
        })
})
watch(() => formData.value.showField, () => {
    personConfig.setShowFields(formData.value.showField)
}, { deep: true })

watch(themeValue, (val: any) => {
    const selectedThemeDetail = daisyuiThemeList.value[val]
    globalConfig.setTheme({ name: val, detail: selectedThemeDetail })
    themeChange(val)
    if(selectedThemeDetail.primary&&(isHex(selectedThemeDetail.primary)||isRgbOrRgba(selectedThemeDetail.primary))){
        globalConfig.setCardColor(selectedThemeDetail.primary)
        cardColorValue.value=selectedThemeDetail.primary
    }
}, { deep: true })

watch(cardColorValue, (val: string) => {
    globalConfig.setCardColor(val)
}, { deep: true })

watch(textColorValue, (val: string) => {
    globalConfig.setTextColor(val)
}, { deep: true })

watch(cardSizeValue, (val: { width: number; height: number; }) => {
    globalConfig.setCardSize(val)
}, { deep: true })
onMounted(() => {
})
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
        <!-- <label class="w-full max-w-xs form-control">
            <div class="label">
                <span class="label-text">展示字段</span>
            </div>
            <ul class="flex gap-6 pl-0">
                <li v-for="item in formData.showField" :key="item" class="flex items-center gap-1">
                    <input type="checkbox" :checked="item.value" class="border-solid checkbox checkbox-primary border-1"
                        @change="handleChangeShowFields(item)" />
                    <span class="label-text">{{ item.label }}</span>
                </li>
            </ul>
        </label> -->
        <label class="w-full max-w-xs form-control">
            <div class="label">
                <span class="label-text">选择主题</span>
            </div>
            <select data-choose-theme class="w-full max-w-xs border-solid select border-1" v-model="themeValue">
                <option disabled selected>选取主题</option>
                <option v-for="(item, index) in themeList" :key="index" :value="item">{{ item }}</option>
            </select>
        </label>
        <label class="w-full max-w-xs form-control">
            <div class="label">
                <span class="label-text">卡片颜色</span>
            </div>
            <ColorPicker ref="colorPickerRef" v-model="cardColorValue" v-model:pure-color="cardColorValue"></ColorPicker>
        </label>
        
        <label class="w-full max-w-xs form-control">
            <div class="label">
                <span class="label-text">文字颜色</span>
            </div>
            <ColorPicker ref="colorPickerRef" v-model="textColorValue" v-model:pure-color="textColorValue"></ColorPicker>
        </label>
        <label class="flex flex-row w-full max-w-xs gap-10 mb-10 form-control">
            <div>
            <div class="label">
                <span class="label-text">卡片宽度</span>
            </div>
            <input type="number" v-model="cardSizeValue.width" placeholder="Type here"
                class="w-full max-w-xs input input-bordered" />
            <div class="help">
                <span class="text-sm text-red-400 help-text" v-if="formErr.rowCount">
                    {{ formErr.rowCount }}
                </span>
            </div>
        </div>
        <div>
            <div class="label">
                <span class="label-text">卡片高度</span>
            </div>
            <input type="number" v-model="cardSizeValue.height" placeholder="Type here"
                class="w-full max-w-xs input input-bordered" />
            <div class="help">
                <span class="text-sm text-red-400 help-text" v-if="formErr.rowCount">
                    {{ formErr.rowCount }}
                </span>
            </div>
        </div>
        </label>
        <label class="w-full max-w-xs mb-10 form-control">
            <div class="label">
                <span class="label-text">文字大小</span>
            </div>
            <input type="number" v-model="textSizeValue" placeholder="Type here"
                class="w-full max-w-xs input input-bordered" />
        </label>
    </div>
</template>

<style lang='scss' scoped></style>
