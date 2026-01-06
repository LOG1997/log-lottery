<script setup lang="ts">
import type { WsMsgData } from '@/types/storeType'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { api_sendMsg } from '@/api/msg'
import { useWebsocket } from '@/hooks/useWebsocket'
import { getUniqueSignature } from '@/utils/auth'

const wsUrl = ref<string>('ws://localhost:8080/echo')
const wsQuery = ref<{ userSignature: string }>({
    userSignature: '',
})
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
    console.log('post msg')
    api_sendMsg(wsQuery.value.userSignature, `hello world ${wsQuery.value.userSignature}`).then(() => {
        console.log('post msg success')
    }).catch((e) => {
        console.log('post msg error', e)
    })
}

async function getFinger() {
    wsQuery.value.userSignature = await getUniqueSignature()
}
watch(data, (newData) => {
    if (!newData) {
        return
    }
    msgData.value.push(newData)
})
onMounted(() => {
    getFinger()
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
    <div class="flex flex-col gap-1">
      <div v-for="(item, index) in msgData" :key="index">
        {{ item.data }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
