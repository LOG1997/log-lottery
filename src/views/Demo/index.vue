<script setup lang="ts">
import type { WsMsgData } from '@/types/storeType'
import { useQRCode } from '@vueuse/integrations/useQRCode'
import { onMounted, onUnmounted, ref, shallowRef, watch } from 'vue'
import { useToast } from 'vue-toast-notification'
import { api_sendMsg } from '@/api/msg'
import { useWebsocket } from '@/hooks/useWebsocket'
import { getOriginUrl, getUniqueSignature } from '@/utils/auth'

const toast = useToast()
const mobileUrl = shallowRef<string>('')
const wsUrl = ref<string>('ws://localhost:8080/echo')
const wsQuery = ref<{ userSignature: string }>({
    userSignature: '',
})
const qrCodeImg = useQRCode(mobileUrl)

const msgData = ref<WsMsgData[]>([])
const { open, close, send, status, data, wsRef } = useWebsocket(wsUrl, wsQuery, 5 * 1000)
function startWs() {
    open()
}
function sendMsg() {
    if (status.value === WebSocket.OPEN) {
        send(`hello world${wsQuery.value.userSignature}`)
    }
}
function connectUserMsg() {
    api_sendMsg(wsQuery.value.userSignature, `hello world ${wsQuery.value.userSignature}`).then((res: any) => {
        toast.open({
            message: res.msg || '发送成功',
            type: 'success',
            position: 'top-right',
        })
    })
}

async function getFinger() {
    const userSignature = await getUniqueSignature()
    wsQuery.value.userSignature = userSignature
    return userSignature
}
async function setMobileUrl() {
    const originUrl = getOriginUrl()
    const userSignature = await getFinger()
    mobileUrl.value = `${originUrl}/log-lottery/mobile?userSignature=${userSignature}`
}
watch(data, (newData) => {
    if (!newData) {
        return
    }
    msgData.value.push(newData)
})
onMounted(() => {
    getFinger()
    setMobileUrl()
})
onUnmounted(() => {
})
</script>

<template>
  <div class="flex flex-col gap-3">
    <button class="btn btn-secondary btn-sm w-24" @click="startWs">
      Start WS
    </button>
    <button class="btn btn-primary btn-sm w-32" @click="connectUserMsg">
      connectUserMsg
    </button>
    <button class="btn btn-accent btn-sm w-24" @click="sendMsg">
      sendMsg
    </button>
    <button class="btn btn-neutral btn-sm w-24" @click="getFinger">
      getFinger
    </button>
    <img :src="qrCodeImg" alt="QR CODE">
    <div class="flex flex-col gap-1">
      <div v-for="(item, index) in msgData" :key="index">
        {{ item.data }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
