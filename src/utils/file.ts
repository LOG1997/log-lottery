export function readFileBinary(file: any): Promise<any> {
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
