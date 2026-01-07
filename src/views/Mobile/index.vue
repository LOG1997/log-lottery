<script setup lang='ts'>
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { ref, watch } from 'vue'
import { useViewModel } from './useViewModel'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn') // 设置为中文

const textareaRef = ref()
const messageArrayRef = ref()
const { sendMsg, userInputMsg, userMsgArray } = useViewModel()
async function handleEnterSend() {
    sendMsg(userInputMsg.value)
    textareaRef.value.blur()
    messageArrayRef.value.scrollTop = messageArrayRef.value.scrollHeight
}

function scrollToBottom() {
    if (!messageArrayRef.value) {
        return
    }
    setTimeout(() => {
        messageArrayRef.value.scrollTop = messageArrayRef.value.scrollHeight
    }, 0)
}

watch(() => userMsgArray.value.length, () => {
    scrollToBottom()
}, { immediate: true })
</script>

<template>
  <div class="flex flex-col justify-around py-4">
    <div class="h-12 drop-shadow-md shadow-lg">
      <h2 class="text-center text-lg font-bold">
        发送弹幕
      </h2>
    </div>
    <div ref="messageArrayRef" class="overflow-y-auto h-[calc(100vh-15rem)]">
      <ul>
        <li v-for="item in userMsgArray" :key="item.id" class="mb-3">
          <div class="chat chat-end">
            <div class="chat-header">
              <time class="text-xs opacity-50">{{ dayjs(item.dateTime).fromNow() }}</time>
            </div>
            <div class="chat-bubble break-all whitespace-normal">
              {{ item.msg }}
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="border-none rounded-2xl bg-base-200 mx-2 p-2 flex flex-col gap-3 items-center justify-center shadow-md mb-8 h-48">
      <textarea ref="textareaRef" v-model="userInputMsg" class="textarea w-full rounded-xl border-none bg-transparent focus:outline-none focus:ring-0" placeholder="发送弹幕 | 只展示您发送过的弹幕" rows="5" cols="50" @keydown.enter.prevent="handleEnterSend" />
      <div class="w-full flex justify-end">
        <button class="btn btn-primary w-24 mb-4" @click="handleEnterSend">
          发送
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
