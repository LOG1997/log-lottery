<script setup lang="ts">
import axios from 'axios'
import { onMounted, onUnmounted, ref } from 'vue'

const webscoket = ref<WebSocket | null>(null)

function startWs() {
    webscoket.value = new WebSocket('ws://localhost:8080/echo')
    webscoket.value.onopen = () => {
        console.log('WebSocket连接已打开')
    }
    webscoket.value.onmessage = (event) => {
        console.log('收到消息:', event.data)
    }
    webscoket.value.onclose = () => {
        console.log('WebSocket连接已关闭')
    }
    webscoket.value.onerror = (error) => {
        console.error('WebSocket发生错误:', error)
    }
}
function sendMsg() {
    webscoket.value?.send('hello')
}
function connectUserMsg() {
    console.log('sendMsg')
    axios.post('http://localhost:8080/user-msg', { user: 'one' }).then((res) => {
        console.log(res.data)
    })
}
onMounted(() => {
})
onUnmounted(() => {
})
</script>

<template>
  <div>
    <button class="btn btn-secondary" @click="startWs">
      Start WS
    </button>
    <button class="btn btn-primary" @click="connectUserMsg">
      connectUserMsg
    </button>
    <button class="btn btn-primary" @click="sendMsg">
      sendMsg
    </button>
  </div>
</template>

<style lang="scss" scoped></style>
