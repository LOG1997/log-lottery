<script setup lang="ts">
import { onMounted, onUnmounted, ref, shallowRef, watch } from 'vue'
import { useToast } from 'vue-toast-notification'
import { api_sendMsg } from '@/api/msg'
import { getOriginUrl, getUniqueSignature } from '@/utils/auth'

const toast = useToast()
const mobileUrl = shallowRef<string>('')
const wsQuery = ref<{ userSignature: string }>({
    userSignature: '',
})

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
onMounted(() => {
    getFinger()
    setMobileUrl()
})

onUnmounted(() => {
})
</script>

<template>
  <div class="flex flex-col gap-3">
    <button class="btn btn-primary btn-sm w-32" @click="connectUserMsg">
      connectUserMsg
    </button>
  </div>
</template>

<style lang="scss" scoped></style>
