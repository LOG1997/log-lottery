import type { FILE_TYPE } from '@/constant/config'

export interface IFileData {
    data: string | Blob | ArrayBuffer
    fileName: string
    type: string
}
/**
 * @description 文件上传组件传参数
 * @param {string} limitType - 限制上传的文件类型
 * @param {'file' | 'json' | 'folder' | 'zip'} mode - 上传模式，用作处理文件
 */
export interface IFileProps {
    limitType?: keyof typeof FILE_TYPE
    isDirectory?: boolean
    mode?: 'file' | 'json' | 'folder' | 'zip'
}
