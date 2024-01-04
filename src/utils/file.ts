export const readFile = (file: any) => {
    return new Promise(resolve => {
        const reader = new FileReader()
        reader.readAsBinaryString(file)
        reader.onload = (ev: any) => {
            resolve(ev.target.result)
        }
    })
}

export const readImage = (file: any) => {
    return new Promise(resolve => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = (ev: any) => {
            resolve({dataUrl:ev.target.result,fileName:file.name})
        }
    })
}
