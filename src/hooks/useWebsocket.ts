import type { IMsgType } from '@/types/msgType'
import type { WsMsgData } from '@/types/storeType'
import { v4 as uuidv4 } from 'uuid'
import { onMounted, ref } from 'vue'
import { useTimerWorker } from './useTimerWorker'

export function useWebsocket() {
    const { init: initWorker, close: closeWorker } = useTimerWorker(30 * 1000)
    const status = ref<{ status: WebSocket['readyState'], connected: boolean }>()
    const data = ref<WsMsgData>()
    const registration = ref<ServiceWorkerRegistration | null>(null)
    async function registerSW() {
        if ('serviceWorker' in navigator) {
            try {
                registration.value = await navigator.serviceWorker.register('/log-lottery/sw.js')
                console.log('Service Worker 注册成功:', registration)
                listenSWMessage()
            }
            catch (error) {
                console.error('Service Worker 注册失败:', error)
            }
        }
        else {
            console.error('浏览器不支持 Service Worker')
        }
    }

    function open(url: string) {
        navigator.serviceWorker.ready.then((registration) => {
            registration.active?.postMessage({
                type: 'CONNECT_WS',
                payload: { url },
            })
        })
    }

    function close() {
        closeWorker()
        navigator.serviceWorker.ready.then((registration) => {
            registration.active?.postMessage({
                type: 'DISCONNECT_WS',
            })
        })
    }
    function send(message: string) {
        navigator.serviceWorker.ready.then((registration) => {
            registration.active?.postMessage({
                type: 'SEND_WS_MESSAGE',
                payload: { message, id: uuidv4() },
            })
        })
    }
    function getStatus() {
        navigator.serviceWorker.ready.then((registration) => {
            registration.active?.postMessage({
                type: 'GET_WS_STATUS',
            })
        })
    }

    // 监听service worker消息
    function listenSWMessage() {
        navigator.serviceWorker.addEventListener('message', (event) => {
            const msgType = event.data.type
            switch (msgType) {
                case 'WS_STATUS':
                    status.value = event.data.payload
                    break
                case 'WS_MESSAGE':{
                    const receivedMsg: IMsgType = event.data.payload as IMsgType
                    data.value = {
                        ...receivedMsg,
                        id: uuidv4(),
                    }
                    break
                }
                case 'WS_ERROR':
                    console.error('ws error:', event.data.payload)
                    status.value = {
                        status: WebSocket.CLOSED,
                        connected: false,
                    }
                    closeWorker()
                    break
                case 'WS_CLOSE':
                    status.value = {
                        status: WebSocket.CLOSED,
                        connected: false,
                    }
                    closeWorker()
                    break
                case 'WS_OPEN':
                    status.value = {
                        status: WebSocket.OPEN,
                        connected: true,
                    }
                    initWorker(getStatus)
                    break
            }
        })
    }

    onMounted(() => {
        registerSW()
        getStatus()
    })
    return {
        open,
        close,
        send,
        status,
        data,
    }
}
