import type { Ref } from 'vue'
import type { WsMsgData } from '@/types/storeType'
import { v4 as uuidv4 } from 'uuid'
import { ref, watch } from 'vue'
import { useTimerWorker } from './useTimerWorker'

export function useWebsocket(url: Ref<string>, query: Ref<Record<string, string> | string>, heartbeatInterval: number = 30 * 1000) {
    const { init: initWorker, close: closeWorker } = useTimerWorker(heartbeatInterval)
    const wsUrl = ref('')
    const wsRef = ref<WebSocket | null>(null)
    // websocket readyState
    const status = ref<WebSocket['readyState']>()
    const data = ref<WsMsgData>()

    let heartbeatTimer: number | null = null
    function open() {
        wsRef.value = new WebSocket(wsUrl.value)
        wsRef.value.onopen = () => {
            console.log('连接成功')
            getStatus()
            initWorker(startHeartbeat)
        }
        wsRef.value.onmessage = (event) => {
            console.log('收到消息:', event.data)
            data.value = {
                data: event.data,
                id: uuidv4(),
                dateTime: new Date().toLocaleString(),
            }
            resetHeartbeat()
        }
        wsRef.value.onclose = () => {
            console.log('连接关闭')
            getStatus()
            stopHeartbeat()
            closeWorker()
        }
        wsRef.value.onerror = (error) => {
            console.error('WebSocket 错误:', error)
            getStatus()
            stopHeartbeat()
        }
    }
    function close() {
        stopHeartbeat()
        if (wsRef.value) {
            wsRef.value.close()
            getStatus()
            wsRef.value = null
        }
    }
    function send(message: string) {
        if (wsRef.value && wsRef.value.readyState === WebSocket.OPEN) {
            wsRef.value.send(message)
        }
        else {
            console.error('WebSocket 未连接，无法发送消息')
        }
    }
    function getStatus() {
        if (wsRef.value) {
            status.value = wsRef.value.readyState
        }
    }
    // 开始心跳
    function startHeartbeat() {
        if (!wsRef.value) {
            return
        }
        wsRef.value.send('ping')
    }

    // 停止心跳
    function stopHeartbeat() {
        if (heartbeatTimer) {
            clearInterval(heartbeatTimer)
            heartbeatTimer = null
        }
    }

    // 重置心跳（收到服务器响应后调用）
    function resetHeartbeat() {
        if (heartbeatTimer) {
            clearInterval(heartbeatTimer)
            initWorker(startHeartbeat) // 重新开始心跳
        }
    }
    watch([url, query], ([newUrl, newQuery]) => {
        // 结构query
        const newQueryString = Object.entries(newQuery).map(([key, value]) => `${key}=${value}`).join('&')
        wsUrl.value = newQuery ? `${newUrl}?${newQueryString}` : newUrl
    }, { immediate: true, deep: true })

    return {
        open,
        close,
        send,
        status,
        data,
        wsRef,
    }
}
