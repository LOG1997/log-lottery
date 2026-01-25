<script setup lang='ts'>
import type { IFileData } from '@/components/FileUpload/type'
import type { IImage, IImageType } from '@/types/storeType'
import JSZip from 'jszip'
import { cloneDeep } from 'lodash-es'
import { v4 as uuidv4 } from 'uuid'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toast-notification'
import CustomDialog from '@/components/Dialog/index.vue'
import FileUpload from '@/components/FileUpload/index.vue'
import { FILE_TYPE } from '@/constant/config'
import useStore from '@/store'
import { compressorImage, getFileExtension } from '@/utils/file'

type LimitTYpe = 'image' | 'zip' | 'folder' | ''
type InnerLimitType = 'image' | ''
const props = withDefaults(defineProps<{ activeTabKey?: IImageType }>(), {
    activeTabKey: 'other',
})
const toast = useToast()
const { t } = useI18n()
const limitType = ref<LimitTYpe>('image')
const innerLimitType = ref<InnerLimitType>('image')
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
    if (limitType.value === 'image') {
        const isRightType = FILE_TYPE[limitType.value].includes(fileData[0]?.type || '')
        if (!isRightType) {
            toast.open({
                message: t('error.notType'),
                type: 'error',
                position: 'top-right',
            })
            return
        }
        imageData.value = fileData
    }
    else if (limitType.value === 'folder') {
        // 判断是否有图片
        const isRightType = FILE_TYPE[innerLimitType.value].includes(fileData[0]?.type || '')
        if (!isRightType) {
            toast.open({
                message: t('error.notImage'),
                type: 'error',
                position: 'top-right',
            })
            return
        }
        imageData.value = fileData
    }
    else if (limitType.value === 'zip') {
        const zipFiles = await JSZip.loadAsync(fileData[0].data)
        zipFiles.forEach(async (relativePath, zipFile) => {
            if (zipFile.dir) {
                return
            }
            const fileBlob = await zipFile.async('blob')
            let resFile = fileBlob
            const fileSize = fileBlob.size
            if (fileSize > 1024 * 20) {
                const fileObject = new File([fileBlob], zipFile.name, { type: 'image/jpeg' })
                const compressorFileBlob = await compressorImage(fileObject, {
                    quality: 0.1,
                    maxWidth: 1024,
                    mimeType: 'image/webp',
                })
                resFile = compressorFileBlob
            }

            const fileName = zipFile.name
            const fileType = getFileExtension(fileName)
            const isRightType = FILE_TYPE[innerLimitType.value].includes(fileType)
            if (isRightType) {
                imageData.value.push({
                    data: resFile,
                    fileName,
                    type: fileType,
                })
            }
            // const fileName = file.name
            // const fileType = getFileExtension(fileName)
            // const isRightType = FILE_TYPE[innerLimitType.value].includes(fileType)
        })
    }
}

function submitUpload() {
    if (imageData.value) {
        imageData.value.map((item: any) => {
            item.name = item.fileName
            item.url = 'Storage'
            item.db = props.activeTabKey
            item.id = limitType.value === 'image' ? uuidv4() : item.fileName
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
watch(() => props.activeTabKey, (newVal) => {
    if (newVal === 'avatar') {
        limitType.value = 'zip'
        innerLimitType.value = 'image'
    }
    else {
        limitType.value = 'image'
        innerLimitType.value = ''
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
        <FileUpload v-if="visible" :limit-type="limitType" :inner-limit-type="innerLimitType" @upload-file="uploadFile" />
        <input v-model="fileName" :disabled="imageData === null" type="text" :placeholder="t('placeHolder.imageName')" class="input w-full">
      </div>
    </template>
  </CustomDialog>
</template>

<style scoped>

</style>
