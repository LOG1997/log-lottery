import type { defineEmits } from 'vue'
import type { IFileData, IFileProps } from './type'
import { defineProps, ref, withDefaults } from 'vue'

import { readFileAsJsonData, readFileDataAsBlob } from '@/utils/file'

export function useUploadFile(props: IFileProps, emits: ReturnType<typeof defineEmits>) {
    const originFileName = ref<string | null>(null)
    const fileData = ref<IFileData | null>(null)
    async function handleFileChange(e: Event) {
        const file = ((e.target as HTMLInputElement).files as FileList)[0]
        const type = file.type
        if (props.mode === 'json') {
            const fileRes = await readFileAsJsonData(file)
            const jsonData = JSON.parse(fileRes)
            fileData.value = { data: jsonData, fileName: file.name, type }
            originFileName.value = file.name
            emits('uploadFile', fileData.value)
            return
        }
        const { data: blobData, fileName } = await readFileDataAsBlob(file)
        fileData.value = { data: blobData, fileName, type }
        originFileName.value = fileName
        emits('uploadFile', fileData.value)
    }
    function removeFile() {
        fileData.value = null
        emits('uploadFile', null)
    }
    return {
        originFileName,
        fileData,
        handleFileChange,
        removeFile,
    }
}
