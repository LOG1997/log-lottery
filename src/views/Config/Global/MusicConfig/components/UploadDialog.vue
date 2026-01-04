<script setup lang='ts'>
import type { IFileData } from '@/components/FileUpload/type'
import localforage from 'localforage'
import { v4 as uuidv4 } from 'uuid'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toast-notification'
import CustomDialog from '@/components/Dialog/index.vue'
import FileUpload from '@/components/FileUpload/index.vue'
import useStore from '@/store'

const { t } = useI18n()
const toast = useToast()
const limitType = ref('audio/*')
const visible = defineModel('visible', {
    type: Boolean,
    required: true,
})
const globalConfig = useStore().globalConfig
const audioDbStore = localforage.createInstance({
    name: 'audioStore',
})
const audioData = ref<IFileData | null>(null)

const fileName = computed({
    get() {
        return audioData.value?.fileName || null
    },
    set(value) {
        if (audioData.value && value) {
            audioData.value.fileName = value
        }
    },
})
const uploadDialogRef = ref()

async function uploadFile(fileData: IFileData | null) {
    if (!fileData) {
        audioData.value = null
        return
    }
    const isAudio = /audio*/.test(fileData?.type || '')
    if (!isAudio) {
        toast.open({
            message: t('error.notAudioFile'),
            type: 'error',
            position: 'top-right',
        })
        return
    }
    audioData.value = fileData
}
async function getAudioDbStore() {
    const keys = await audioDbStore.keys()
    if (keys.length > 0) {
        audioDbStore.iterate((value: { fileName: string, data: Blob }, key: string) => {
            globalConfig.addMusic({
                id: key,
                name: value.fileName,
                url: 'Storage',
            })
        })
    }
}
function submitUpload() {
    if (audioData.value) {
        const { data, fileName } = audioData.value
        const uniqueId = uuidv4()
        audioDbStore.setItem(uniqueId, {
            data,
            fileName,
        })
            .then(() => {
                toast.open({
                    message: t('error.uploadSuccess'),
                    type: 'success',
                    position: 'top-right',
                })
                getAudioDbStore()
            })
            .catch(() => {
                toast.open({
                    message: t('error.uploadFail'),
                    type: 'error',
                    position: 'top-right',
                })
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
  <CustomDialog
    ref="uploadDialogRef"
    v-model:visible="visible"
    :title="t('dialog.uploadAudioTitle')"
    :submit-func="submitUpload"
    class=""
  >
    <template #content>
      <div class="flex flex-col items-center gap-6 w-full px-12">
        <FileUpload v-if="visible" :limit-type="limitType" @upload-file="uploadFile" />
        <input v-model="fileName" :disabled="audioData === null" type="text" class="input w-full">
      </div>
    </template>
  </CustomDialog>
</template>

<style scoped>

</style>
