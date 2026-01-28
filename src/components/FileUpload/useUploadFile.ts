import type { defineEmits } from 'vue'
import type { IFileData, IFileProps } from './type'
import { ref } from 'vue'
import { useToast } from 'vue-toast-notification'
import { FILE_TYPE } from '@/constant/config'
import { getFileExtension, readFileAsJsonData, readFileDataAsBlob } from '@/utils/file'

export function useUploadFile(props: IFileProps, emits: ReturnType<typeof defineEmits>) {
    const fileData = ref<IFileData[]>([])
    const { limitType = '', mode, innerLimitType = '' } = props
    const toast = useToast()
    async function handleFileChange(e: Event) {
        const files = (e.target as HTMLInputElement).files
        if (!files) {
            toast.warning('请选择文件或文件夹')
            return
        }
        // 验证文件类型
        if (limitType && !FILE_TYPE[limitType].includes(getFileExtension(files[0].name))) {
            toast.warning('请选择正确的文件类型')
            return
        }
        // 文件夹上传
        if (limitType === 'folder') {
            for (const file of files) {
                const { data: blobData, fileName, size } = await readFileDataAsBlob(file)
                const fileExtension = getFileExtension(fileName)
                if (FILE_TYPE[innerLimitType].includes(fileExtension)) {
                    fileData.value?.push({ data: blobData, fileName, type: fileExtension, size })
                }
            }
        }
        else {
            const { data: blobData, fileName, size } = await readFileDataAsBlob(files[0])
            const fileExtension = getFileExtension(fileName)
            fileData.value = [{ data: blobData, fileName, type: fileExtension, size }]
        }
        if (fileData.value === null || fileData.value.length === 0) {
            toast.warning('没有符合要求的文件，请重新选择')
            return
        }
        // 清空输入框的值，允许上传同一个文件
        ; (e.target as HTMLInputElement).value = ''
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
