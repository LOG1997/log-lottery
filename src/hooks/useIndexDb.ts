import { IndexDb } from '@/utils/dexie'

export function useIndexDb() {
    const imageDbStore = new IndexDb('imgStore', ['prize', 'avatar', 'other'], 1, ['createTime'])
    const personDbStore = new IndexDb('person', ['allPersonList', 'alreadyPersonList'], 1, ['createTime'])
    const msgListDbStore = new IndexDb('msgList', ['msgList'], 1, ['createTime'])
    const musicDbStore = new IndexDb('musicStore', ['background', 'process', 'other'], 1, ['createTime'])

    function clearAllDbStore() {
        imageDbStore.clearDb()
        personDbStore.clearDb()
        msgListDbStore.clearDb()
        musicDbStore.clearDb()
    }
    return {
        imageDbStore,
        personDbStore,
        msgListDbStore,
        musicDbStore,
        clearAllDbStore,
    }
}
