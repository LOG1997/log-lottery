import localforage from 'localforage'

const imageDbStore = localforage.createInstance({
    name: 'imgStore',
})

const audioDbStore = localforage.createInstance({
    name: 'audioStore',
})

async function clearImageDbStore() {
    await imageDbStore.clear()
}

async function clearAudioDbStore() {
    await audioDbStore.clear()
}

export function clearAllDbStore() {
    clearImageDbStore()
    clearAudioDbStore()
}
