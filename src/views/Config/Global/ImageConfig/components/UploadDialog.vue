<script setup lang='ts'>
import type { IFileData } from '@/components/FileUpload/type'
import type { FILE_TYPE } from '@/constant/config'
import type { IImage, IImageType } from '@/types/storeType'
import { cloneDeep } from 'lodash-es'
import { v4 as uuidv4 } from 'uuid'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toast-notification'
import CustomDialog from '@/components/Dialog/index.vue'
import FileUpload from '@/components/FileUpload/index.vue'
import useStore from '@/store'

const props = withDefaults(defineProps<{ activeTabKey?: IImageType }>(), {
    activeTabKey: 'other',
})
const toast = useToast()
const { t } = useI18n()
const limitType = ref<keyof typeof FILE_TYPE>('image')
const visible = defineModel('visible', {
    type: Boolean,
    required: true,
})
const sourceConfig = useStore().sourceConfig
const imageData = ref<IFileData[]>([])

const fileName = computed({
    get() {
        return imageData.value[0]?.fileName || null
    },
    set(value) {
        if (imageData.value && value) {
            imageData.value[0].fileName = value
        }
    },
})
const uploadDialogRef = ref()

async function uploadFile(fileData: IFileData[] | null) {
    if (!fileData || fileData.length === 0) {
        imageData.value = []
        return
    }
    if (fileData.length === 1) {
        const isImage = /image*/.test(fileData[0]?.type || '')
        if (!isImage) {
            toast.open({
                message: t('error.notImage'),
                type: 'error',
                position: 'top-right',
            })
            return
        }
    }
    else {
        // 判断是否有图片
        const isImage = fileData.some(file => /image*/.test(file.type))
        if (!isImage) {
            toast.open({
                message: t('error.notImage'),
                type: 'error',
                position: 'top-right',
            })
            return
        }
    }
    imageData.value = fileData
}

function submitUpload() {
    if (imageData.value) {
        imageData.value.map((item: any) => {
            item.name = item.fileName
            item.url = 'Storage'
            item.db = props.activeTabKey
            item.id = item.fileName
            item.createTime = new Date().toISOString()
            item.type = 'user'
            return item
        })
        const isSuccess = sourceConfig.addImageSource(cloneDeep(imageData.value) as unknown as IImage[], props.activeTabKey)
        if (!isSuccess) {
            toast.open({
                message: t('error.uploadFail'),
                type: 'error',
                position: 'top-right',
            })
        }
        else {
            toast.open({
                message: t('error.uploadSuccess'),
                type: 'success',
                position: 'top-right',
            })
        }
    }
}
watch(visible, (newVal) => {
    if (newVal) {
        uploadDialogRef.value.showDialog()
    }
    else {
        imageData.value = []
        fileName.value = ''
    }
})
</script>

<template>
  <CustomDialog
    ref="uploadDialogRef"
    v-model:visible="visible"
    :title="t('dialog.uploadImageTitle')"
    :submit-func="submitUpload"
    class=""
  >
    <template #content>
      <div class="flex flex-col items-center gap-6 w-full px-12">
        <FileUpload v-if="visible" :limit-type="limitType" :is-directory="activeTabKey === 'avatar'" @upload-file="uploadFile" />
        <input v-model="fileName" :disabled="imageData === null" type="text" :placeholder="t('placeHolder.imageName')" class="input w-full">
      </div>
    </template>
  </CustomDialog>
</template>

<style scoped>

</style>
