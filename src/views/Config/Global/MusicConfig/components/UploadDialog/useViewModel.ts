import type { Ref } from 'vue'
import type { IFileData } from '@/components/FileUpload/type'
import type { IMusic, IMusicType } from '@/types/storeType'
import JSZip from 'jszip'
import { cloneDeep } from 'lodash-es'
import { v4 as uuidv4 } from 'uuid'
import { computed, inject, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toast-notification'
import { loadingKey } from '@/components/Loading'
import { FILE_TYPE } from '@/constant/config'
import useStore from '@/store'
import { getFileExtension, getFileName } from '@/utils/file'

export function useViewModel(props: { activeTabKey: IMusicType }, visible: Ref<boolean>, uploadDialogRef: Ref<any>) {
    type LimitTYpe = 'audio' | 'zip' | 'folder' | ''
    type InnerLimitType = 'audio' | ''
    const loading = inject(loadingKey)
    const toast = useToast()
    const { t } = useI18n()
    const limitType = ref<LimitTYpe>('audio')
    const innerLimitType = ref<InnerLimitType>('audio')
    const sourceConfig = useStore().sourceConfig
    const musicData = ref<IFileData[]>([])
    const fileName = computed({
        get() {
            return musicData.value[0]?.fileName || null
        },
        set(value) {
            if (musicData.value && value) {
                musicData.value[0].fileName = value
            }
        },
    })

    async function uploadFile(fileData: IFileData[] | null) {
        if (!fileData || fileData.length === 0) {
            musicData.value = []
            return
        }
        loading?.show()
        let musicFileList: IFileData[] = []
        // 上传类型为图片
        if (limitType.value === 'audio') {
            const isRightType = FILE_TYPE[limitType.value].includes(fileData[0]?.type || '')
            if (!isRightType) {
                toast.open({
                    message: t('error.notType'),
                    type: 'error',
                    position: 'top-right',
                })
                return
            }
            musicFileList = fileData
        }
        // 上传文件夹，但是限制文件夹内容innerLimitType
        else if (limitType.value === 'folder') {
            const isRightType = FILE_TYPE[innerLimitType.value].includes(fileData[0]?.type || '')
            if (!isRightType) {
                toast.open({
                    message: t('error.notImage'),
                    type: 'error',
                    position: 'top-right',
                })
                return
            }
            musicFileList = fileData
        }
        // 上传zip文件，限制zip文件内容innerLimitType
        else if (limitType.value === 'zip') {
            const zipFiles = await JSZip.loadAsync(fileData[0].data)
            const zipFileArray = Object.values(zipFiles.files)
            for (const zipFile of zipFileArray) {
                const fileName = getFileName(zipFile.name)
                const fileExtension = getFileExtension(zipFile.name)
                const isRightType = FILE_TYPE[innerLimitType.value].includes(fileExtension)

                // 文件夹、不匹配的文件类型、子文件夹里的文件则不处理
                if (zipFile.dir || !isRightType || fileName.includes('/')) {
                    continue
                }

                const fileBlob = await zipFile.async('blob')
                const fileSize = fileBlob.size
                musicFileList.push({
                    data: fileBlob,
                    fileName,
                    type: fileExtension,
                    size: fileSize,
                })
            }
        }
        musicData.value = musicFileList
        loading?.hide()
    }

    function submitUpload() {
        if (musicData.value) {
            musicData.value.map((item: any) => {
                item.name = item.fileName
                item.url = 'Storage'
                item.db = props.activeTabKey
                item.id = uuidv4()
                item.createTime = new Date().toISOString()
                item.type = 'user'
                return item
            })
            const isSuccess = sourceConfig.addMusicSource(cloneDeep(musicData.value) as unknown as IMusic[], props.activeTabKey)
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
            musicData.value = []
            fileName.value = ''
        }
    })
    // watch(() => props.activeTabKey, (newVal) => {
    //     if (newVal === 'avatar') {
    //         limitType.value = 'zip'
    //         innerLimitType.value = 'image'
    //     }
    //     else {
    //         limitType.value = 'image'
    //         innerLimitType.value = ''
    //     }
    // })

    return {
        uploadFile,
        submitUpload,
        limitType,
        innerLimitType,
        fileName,
        musicData,
    }
}
