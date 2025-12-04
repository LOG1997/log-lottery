<script setup lang='ts'>
import type { IFileData } from '@/components/ImageUpload/type'
import localforage from 'localforage'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import CustomDialog from '@/components/Dialog/index.vue'
import ImageUpload from '@/components/ImageUpload/index.vue'
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
    imageDbStore.iterate((value, key) => {
      globalConfig.addImage({
        id: key,
        name: key,
        url: 'Storage',
      })
    })
  }
}
function submitUpload() {
  if (imageData.value) {
    const { dataUrl, fileName } = imageData.value
    console.log(dataUrl, fileName)
    imageDbStore.setItem(`${new Date().getTime().toString()}+${fileName}`, dataUrl)
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
    title="图片上传"
    :submit-func="submitUpload"
    class=""
  >
    <template #content>
      <div class="flex flex-col items-center gap-6 w-full px-12">
        <ImageUpload v-if="visible" :limit-type="limitType" @upload-file="uploadFile" />
        <input v-model="fileName" :disabled="imageData === null" type="text" placeholder="图片名称" class="input w-full">
      </div>
    </template>
  </CustomDialog>
</template>

<style scoped>

</style>
