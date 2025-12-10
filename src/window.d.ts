// src/types/window.d.ts
interface FontData {
    family: string
    fullName: string
    postscriptName: string
    style: string
    blob: () => Promise<Blob>
}

interface Window {
    queryLocalFonts?: (options?) => Promise<FontData[]>
}
