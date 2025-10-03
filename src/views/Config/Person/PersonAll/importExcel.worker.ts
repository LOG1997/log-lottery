import * as XLSX from 'xlsx'
import { addOtherInfo } from '@/utils'
// 定义消息类型
interface WorkerMessage {
    type: 'start' | 'stop' | 'reset'
    data: any
}

let allData: any[] = []

// 接收主线程消息
globalThis.onmessage = async (e: MessageEvent<WorkerMessage>) => {
    switch (e.data.type) {
        case 'start':
            {
                const fileData = e.data.data
                // const dataBinary = await readFileBinary(((fileEvent.target as HTMLInputElement).files as FileList)[0]!)
                const workBook = XLSX.read(fileData, { type: 'binary', cellDates: true })
                const workSheet = workBook.Sheets[workBook.SheetNames[0]]
                const excelData = XLSX.utils.sheet_to_json(workSheet)
                allData = addOtherInfo(excelData)
                globalThis.postMessage({
                    type: 'done',
                    data: allData,
                    message: '读取完成',
                })
                break
            }
        default:
            break
    }
}
