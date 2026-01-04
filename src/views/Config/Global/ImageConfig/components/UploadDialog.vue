<script setup lang='ts'>
import type { IFileData } from '@/components/FileUpload/type'
import localforage from 'localforage'
import { v4 as uuidv4 } from 'uuid'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import CustomDialog from '@/components/Dialog/index.vue'
import FileUpload from '@/components/FileUpload/index.vue'
import useStore from '@/store'

const { t } = useI18n()
const limitType = ref('image/*')
const imgUploadToast = ref(0) // 0是不显示，1是成功，2是失败,3是不是图片
const visible = defineModel('visible', {
    type: Boolean,
    required: true,
})
const globalConfig = useStore().globalConfig
const imageDbStore = localforage.createInstance({
    name: 'imgStore',
})
const imageData = ref<IFileData | null>(null)

const fileName = computed({
    get() {
        return imageData.value?.fileName || null
    },
    set(value) {
        if (imageData.value && value) {
            imageData.value.fileName = value
        }
    },
})
const uploadDialogRef = ref()

async function uploadFile(fileData: IFileData | null) {
    if (!fileData) {
        imageData.value = null
        return
    }
    const isImage = /image*/.test(fileData?.type || '')
    if (!isImage) {
        imgUploadToast.value = 3
        return
    }
    imageData.value = fileData
}
async function getImageDbStore() {
    const keys = await imageDbStore.keys()
    if (keys.length > 0) {
        imageDbStore.iterate((value: { fileName: string, data: Blob }, key: string) => {
            globalConfig.addImage({
                id: key,
                name: value.fileName,
                url: 'Storage',
            })
        })
    }
}
function submitUpload() {
    if (imageData.value) {
        const { data, fileName } = imageData.value
        const uniqueId = uuidv4()
        imageDbStore.setItem(uniqueId, {
            data,
            fileName,
        })
            .then(() => {
                imgUploadToast.value = 1
                getImageDbStore()
            })
            .catch(() => {
                imgUploadToast.value = 2
            })
    }
}
watch(visible, (newVal) => {
    if (newVal) {
        uploadDialogRef.value.showDialog()
    }
})
</script>

<template>
  <div class="toast toast-top toast-end">
    <div v-if="imgUploadToast === 2" class="alert alert-error">
      <span>{{ t('error.uploadFail') }}</span>
    </div>
    <div v-if="imgUploadToast === 1" class="alert alert-success">
      <span>{{ t('error.uploadSuccess') }}</span>
    </div>
    <div v-if="imgUploadToast === 3" class="alert alert-error">
      <span>{{ t('error.notImage') }}</span>
    </div>
  </div>
  <CustomDialog
    ref="uploadDialogRef"
    v-model:visible="visible"
    :title="t('dialog.uploadImageTitle')"
    :submit-func="submitUpload"
    class=""
  >
    <template #content>
      <div class="flex flex-col items-center gap-6 w-full px-12">
        <FileUpload v-if="visible" :limit-type="limitType" @upload-file="uploadFile" />
        <input v-model="fileName" :disabled="imageData === null" type="text" :placeholder="t('placeHolder.imageName')" class="input w-full">
      </div>
    </template>
  </CustomDialog>
</template>

<style scoped>

</style>
