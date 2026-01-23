export interface IPersonConfig {
    id: number
    uid: string
    uuid: string
    name: string
    department: string
    identity: string
    avatar: string
    avatarUrl?: string
    isWin: boolean
    x: number
    y: number
    createTime: string
    updateTime: string
    prizeName: string[]
    prizeId: string[]
    prizeTime: string[]
}
export interface Separate {
    id: string
    count: number
    isUsedCount: number
}
export interface IPrizeConfig {
    id: number | string
    name: string
    sort: number
    isAll: boolean
    count: number
    isUsedCount: number
    picture: {
        id: string
        name: string
        url: string | Blob | ArrayBuffer
    }
    separateCount: {
        enable: boolean
        countList: Separate[]
    }
    desc: string
    isShow: boolean
    isUsed: boolean
    frequency: number
}

export type IMusicType = 'background' | 'process' | 'other'
export interface IMusic {
    id: string
    name: string
    type: string
    url: string | Blob | ArrayBuffer
    createTime?: string
}

export type IImageType = 'prize' | 'avatar' | 'other'

export interface IImage {
    id: string
    name: string
    type: string
    data?: string | Blob | ArrayBuffer
    url: string | Blob | ArrayBuffer
    createTime?: string
    db?: string
}

export interface WsMsgData { data: string, id: string, dateTime: string }
export interface ServerType {
    id: string
    name: string
    value: string
    host: string
}
