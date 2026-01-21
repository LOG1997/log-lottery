import type { defineEmits } from 'vue'
import type { IFileData, IFileProps } from './type'
import { ref } from 'vue'

import { readFileAsJsonData, readFileDataAsBlob } from '@/utils/file'

export function useUploadFile(props: IFileProps, emits: ReturnType<typeof defineEmits>) {
    const fileData = ref<IFileData | null>(null)
    async function handleFileChange(e: Event) {
        const file = ((e.target as HTMLInputElement).files as FileList)[0]
        if (!file) {
            return
        }
        const type = file.type
        if (props.mode === 'json') {
            const fileRes = await readFileAsJsonData(file)
            const jsonData = JSON.parse(fileRes)
            fileData.value = { data: jsonData, fileName: file.name, type }
            emits('uploadFile', fileData.value)
            return
        }
        const { data: blobData, fileName } = await readFileDataAsBlob(file)
        fileData.value = { data: blobData, fileName, type }
        console.log('fileData.value', fileData.value)
        emits('uploadFile', fileData.value)
    }
    function removeFile(e: Event) {
        e.preventDefault()
        fileData.value = null
        emits('uploadFile', null)
    }
    function resetUpload() {
        fileData.value = null
        emits('uploadFile', null)
    }
    return {
        fileData,
        handleFileChange,
        removeFile,
        resetUpload,
    }
}
