export const readFile = (file: any): Promise<any> => {
    return new Promise(resolve => {
        const reader = new FileReader()
        reader.readAsBinaryString(file)
        reader.onload = (ev: any) => {
            resolve(ev.target.result)
        }
    })
}

export const readImage = (file: any): Promise<any> => {
    return new Promise(resolve => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = (ev: any) => {
            resolve({dataUrl:ev.target.result,fileName:file.name})
        }
    })
}


export const readMusic = (file: any): Promise<any> => {
    return new Promise(resolve => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = (ev: any) => {
            resolve({dataUrl:ev.target.result,fileName:file.name})
        }
    })
}
