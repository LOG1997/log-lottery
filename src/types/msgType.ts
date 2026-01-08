export interface IMsgType {
    msg: string
    image?: string | Blob | ArrayBuffer // TODO
    dateTime: string
    user?: string // TODO
}
