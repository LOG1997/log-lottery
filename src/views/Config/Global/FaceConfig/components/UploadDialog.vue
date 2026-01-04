<script setup lang='ts'>
import type { IFileData } from '@/components/FileUpload/type'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toast-notification'
import CustomDialog from '@/components/Dialog/index.vue'
import FileUpload from '@/components/FileUpload/index.vue'

interface Props {
    importAllConfigData: (data: any) => void
}

const props = defineProps<Props>()
const toast = useToast()
const limitType = ref('application/json')
const visible = defineModel('visible', {
    type: Boolean,
    required: true,
})
const jsonFileData = ref<IFileData | null>(null)
const { t } = useI18n()
const uploadDialogRef = ref()

async function uploadFile(fileData: IFileData | null) {
    if (!fileData) {
        jsonFileData.value = null
        return
    }
    const isJson = /application\/json/.test(fileData?.type || '')
    if (!isJson) {
        toast.open({
            message: t('error.notJsonFile'),
            type: 'error',
            position: 'top-right',
        })
        return
    }
    jsonFileData.value = fileData
}

function submitUpload() {
    if (jsonFileData.value) {
    // 把文件转化为json数据
        const jsonData = jsonFileData.value.data
        props.importAllConfigData(jsonData)
    }
}
watch(visible, (newVal) => {
    if (newVal) {
        uploadDialogRef.value.showDialog()
    }
})
</script>

<template>
  <CustomDialog
    ref="uploadDialogRef"
    v-model:visible="visible"
    :title="t('dialog.uploadFileTitle')"
    :submit-func="submitUpload"
    class=""
  >
    <template #content>
      <div class="flex flex-col items-center gap-6 w-full px-12">
        <FileUpload v-if="visible" :limit-type="limitType" mode="json" @upload-file="uploadFile" />
      </div>
    </template>
  </CustomDialog>
</template>

<style scoped>

</style>
