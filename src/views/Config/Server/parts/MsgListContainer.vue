<script setup lang='ts'>
import type { WsMsgData } from '@/types/storeType'

interface Props {
    msgList: WsMsgData[]
}
defineProps<Props>()
</script>

<template>
  <div class="w-1/2 h-1/2 border rounded-md shadow-lg">
    <ul>
      <li v-for="item in msgList" :key="item.id" class="mb-3">
        <div class="chat chat-end">
          <div class="chat-header">
            <time class="text-xs opacity-50">{{ item.dateTime }}</time>
          </div>
          <div class="chat-bubble break-all whitespace-normal">
            {{ item.data }}
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>

</style>
