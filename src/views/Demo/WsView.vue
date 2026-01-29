<script setup lang='ts'>
import { api_auth } from '@/api/auth'
import { useWebsocket } from '@/hooks/useWebsocket'

const { open, close, send, status, data } = useWebsocket()
const url = 'http://127.0.0.1:8080/echo?userSignature=123456&apiKey=api_key_mao'
const auth_url = 'http://127.0.0.1:8080/api/auth'

async function handleAuth() {
    const res = await api_auth({
        userSignature: '123456',
        apiKey: 'api_key_mao',
    })
    console.log(res)
}
</script>

<template>
  <div>
    <button class="btn" @click="open(url)">
      连接
    </button>
    <button class="btn" @click="handleAuth">
      认证
    </button>
  </div>
</template>

<style scoped>

</style>
