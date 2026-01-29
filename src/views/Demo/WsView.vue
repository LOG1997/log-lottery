<script setup lang='ts'>
import { useWebsocket } from '@/hooks/useWebsocket'
import { button } from '../../locales/modules/button'

const { open, close, send, status, data } = useWebsocket()
const url = 'http://127.0.0.1:8080/echo?userSignature=123456&apiKey=api_key_mao'
</script>

<template>
  <div>
    <button class="btn" @click="open(url)">
      连接
    </button>
  </div>
</template>

<style scoped>

</style>
