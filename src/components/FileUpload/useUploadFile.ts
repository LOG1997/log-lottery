import type { defineEmits } from 'vue'
import type { IFileData, IFileProps } from './type'
import { ref } from 'vue'
import { useToast } from 'vue-toast-notification'
import { FILE_TYPE } from '@/constant/config'
import { readFileAsJsonData, readFileDataAsBlob } from '@/utils/file'

export function useUploadFile(props: IFileProps, emits: ReturnType<typeof defineEmits>) {
    const fileData = ref<IFileData[]>([])
    const { limitType = '', mode, isDirectory } = props
    const toast = useToast()
    async function handleFileChange(e: Event) {
        const files = (e.target as HTMLInputElement).files
        if (!files) {
            toast.warning('请选择文件或文件夹')
            return
        }
        if (mode === 'json') {
            const fileRes = await readFileAsJsonData(files[0])
            const jsonData = JSON.parse(fileRes)
            fileData.value = [{ data: jsonData, fileName: files[0].name, type: files[0].type }]
            emits('uploadFile', fileData.value)
            return
        }
        if (!isDirectory) {
            const { data: blobData, fileName } = await readFileDataAsBlob(files[0])
            fileData.value = [{ data: blobData, fileName, type: files[0].type }]
        }
        else {
            for (const file of files) {
                const { data: blobData, fileName } = await readFileDataAsBlob(file)
                const regPath = new RegExp(FILE_TYPE[limitType])
                if (regPath.test(file.type)) {
                    fileData.value?.push({ data: blobData, fileName, type: file.type })
                }
            }
        }
        if (fileData.value === null || fileData.value.length === 0) {
            toast.warning('没有符合要求的文件，请重新选择')
            return
        }
        // 清空输入框的值，允许上传同一个文件
        ;(e.target as HTMLInputElement).value = ''
        emits('uploadFile', fileData.value)
    }
    function removeFile(e: Event) {
        e.preventDefault()
        fileData.value = []
        emits('uploadFile', null)
    }
    function resetUpload() {
        fileData.value = []
        emits('uploadFile', null)
    }
    return {
        fileData,
        handleFileChange,
        removeFile,
        resetUpload,
    }
}
