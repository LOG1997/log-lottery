export function readFileBinary(file: File | Blob): Promise<string> {
    return new Promise((resolve) => {
        const reader = new FileReader()
        reader.readAsBinaryString(file)
        reader.onload = (ev: any) => {
            resolve(ev.target.result)
        }
    })
}

export function readFileData(file: File): Promise<{ data: string, fileName: string }> {
    return new Promise((resolve) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = (ev: any) => {
            resolve({ data: ev.target!.result, fileName: file.name })
        }
    })
}

export function readFileDataAsBlob(file: File): Promise<{ data: Blob, fileName: string }> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = () => {
            // 直接使用原始文件作为 Blob
            resolve({ data: file, fileName: file.name })
        }

        reader.onerror = () => {
            reject(new Error('文件读取失败'))
        }

        reader.readAsArrayBuffer(file)
    })
}

export async function readLocalFileAsArraybuffer(path: string): Promise<ArrayBuffer> {
    const response = await fetch(path)
    const arrayBuffer = await response.arrayBuffer()
    return arrayBuffer
}

export async function readFileAsJsonData(file: File | Blob): Promise<any> {
    return new Promise((resolve) => {
        const reader = new FileReader()
        reader.readAsText(file, 'utf-8')
        reader.onload = (ev: any) => {
            resolve(ev.target.result)
        }
    })
}

export function getBlobObjectUrl(blob: Blob): string {
    return URL.createObjectURL(blob)
}
