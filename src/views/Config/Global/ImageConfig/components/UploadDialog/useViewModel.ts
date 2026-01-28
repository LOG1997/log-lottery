import type { Ref } from 'vue'
import type { IFileData } from '@/components/FileUpload/type'
import type { IImage, IImageType, IPersonConfig } from '@/types/storeType'
import JSZip from 'jszip'
import { cloneDeep } from 'lodash-es'
import { v4 as uuidv4 } from 'uuid'
import { computed, inject, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toast-notification'
import { loadingKey } from '@/components/Loading'
import { AVATAR_MAX_SIZE, FILE_TYPE } from '@/constant/config'
import { useIndexDb } from '@/hooks/useIndexDb'
import useStore from '@/store'
import { compressorImage, getFileExtension, getFileName } from '@/utils/file'

export function useViewModel(props: { activeTabKey: IImageType }, visible: Ref<boolean>, uploadDialogRef: Ref<any>) {
    type LimitTYpe = 'image' | 'zip' | 'folder' | ''
    type InnerLimitType = 'image' | ''
    const { imageDbStore } = useIndexDb()
    const loading = inject(loadingKey)
    const toast = useToast()
    const { t } = useI18n()
    const limitType = ref<LimitTYpe>('image')
    const innerLimitType = ref<InnerLimitType>('image')
    const sourceConfig = useStore().sourceConfig
    const personConfig = useStore().personConfig
    const { getAllPersonList: allPersonList } = personConfig
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
    function syncAvatarImage() {
        if (allPersonList.length <= 0) {
            return
        }
        allPersonList.map(async (person: IPersonConfig) => {
            person.avatarUrl = person.avatar
            if (person.avatar && !person.avatar.startsWith('http')) {
                const imageData = await imageDbStore.getItem('avatar', person.avatar)
                person.avatarUrl = URL.createObjectURL(imageData?.data as Blob)
            }
            personConfig.updatePersonItem(person)
        })
    }
    async function uploadFile(fileData: IFileData[] | null) {
        if (!fileData || fileData.length === 0) {
            imageData.value = []
            return
        }
        loading?.show()
        let imageFileList: IFileData[] = []
        // 上传类型为文件夹
        if (limitType.value === 'folder') {
            const isRightType = FILE_TYPE[innerLimitType.value].includes(fileData[0]?.type || '')
            if (!isRightType) {
                toast.open({
                    message: t('error.notImage'),
                    type: 'error',
                    position: 'top-right',
                })
                return
            }
            imageFileList = fileData
        }
        else if (fileData.length === 1
          && FILE_TYPE.image.includes(fileData[0]?.type)
        ) {
            imageFileList = fileData
        }
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
                imageFileList.push({
                    data: fileBlob,
                    fileName,
                    type: fileExtension,
                    size: fileSize,
                })
            }
        }
        if (props.activeTabKey === 'avatar') {
            imageFileList.forEach(async (item: IFileData) => {
                let resFile = item.data
                const fileSize = item.size
                if (fileSize > AVATAR_MAX_SIZE) {
                    const fileObject = new File([item.data], item.fileName, { type: 'image/jpeg' })
                    const compressorFileBlob = await compressorImage(fileObject, {
                        quality: 0.1,
                        maxWidth: 1024,
                        mimeType: 'image/webp',
                    })
                    resFile = compressorFileBlob
                }
                imageData.value.push({
                    data: resFile,
                    fileName: item.fileName,
                    type: item.type,
                    size: item.size,
                })
            })
        }
        loading?.hide()
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
                if (limitType.value === 'zip') {
                    syncAvatarImage()
                }
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

    return {
        uploadFile,
        submitUpload,
        limitType,
        innerLimitType,
        fileName,
        imageData,
    }
}
