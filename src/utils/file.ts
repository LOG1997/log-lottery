export function readFileBinary(file: File | Blob): Promise<string> {
    return new Promise((resolve) => {
        const reader = new FileReader()
        reader.readAsBinaryString(file)
        reader.onload = (ev: any) => {
            resolve(ev.target.result)
        }
    })
}

export function readFileData(file: any): Promise<{ dataUrl: string, fileName: string }> {
    return new Promise((resolve) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = (ev: any) => {
            resolve({ dataUrl: ev.target.result, fileName: file.name })
        }
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
