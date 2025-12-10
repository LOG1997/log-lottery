import { onMounted, ref } from 'vue'

export function useLocalFonts() {
    const fonts = ref<Map<string, { name: string, value: string }[]>>(new Map())
    const disabled = ref(false)
    const formatFonts = (list: FontData[]): Map<string, { name: string, value: string }[]> => {
        const res: Map<string, { name: string, value: string }[]> = new Map()
        for (const item of list) {
            if (!res.has(item.family)) {
                res.set(item.family, [])
            }

            const fontArray = res.get(item.family)
            if (!Array.isArray(fontArray)) {
                continue
            }
            if (item.family === item.fullName) {
                fontArray.push({ name: item.style, value: item.fullName })
                continue
            }
            const name = item.fullName.replace(item.family, '').trim()
            const value = item.fullName
            fontArray.push({ name, value })
        }
        return res
    }
    const getFonts = async () => {
        if (!window.queryLocalFonts) {
            return
        }
        const list = await window.queryLocalFonts()
        const res = formatFonts(list)
        fonts.value = res
    }

    onMounted(() => {
        if (!window.queryLocalFonts) {
            disabled.value = true
        }
    })

    return {
        disabled,
        fonts,
        getFonts,
    }
}
