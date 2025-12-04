import localforage from 'localforage'

const imageDbStore = localforage.createInstance({
    name: 'imgStore',
})

async function clearImageDbStore() {
    await imageDbStore.clear()
}

export function clearAllDbStore() {
    clearImageDbStore()
}
