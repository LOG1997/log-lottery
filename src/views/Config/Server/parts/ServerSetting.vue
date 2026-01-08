<script setup lang='ts'>
import type { ServerType } from '@/types/storeType'
import { ref, watch } from 'vue'
// import { useI18n } from 'vue-i18n'

interface Props {
    serverList: ServerType[]
    wsStatus: number
    openWs: () => void
    closeWs: () => void
}
defineProps<Props>()

const currentServer = defineModel<ServerType>('currentServer', { required: true })
const hostValue = ref('')
// const { t } = useI18n()
// 监听 currentServer 的 id 变化，重置 hostValue
watch(() => currentServer.value?.id, (newId, oldId) => {
    if (newId !== oldId) {
        hostValue.value = currentServer.value?.host || ''
    }
}, { immediate: true })

// 监听 hostValue 变化，同步更新 currentServer.host
watch(hostValue, (newHost) => {
    if (currentServer.value) {
        currentServer.value.host = newHost
    }
})

// 初始化 hostValue
hostValue.value = currentServer.value?.host || ''
</script>

<template>
  <fieldset class="p-4 border text-setting fieldset bg-base-200 border-base-300 rounded-box w-xs pb-10">
    <legend class="fieldset-legend">
      弹幕服务
    </legend>

    <label class="flex flex-row items-center form-control">
      <div class="">
        <div class="label flex flex-col justify-start items-start">
          <label class="label">
            <span class="label-text text-left">弹幕服务地址</span>
            <div class="tooltip" data-tip="改变弹幕服务地址后会断开连接">
              <button class="btn btn-circle h-4 hover:bg-base-300">
                ?
              </button>
            </div>
          </label>
          <div class="radio-group flex gap-9">
            <ul class="flex gap-3">
              <li v-for="item in serverList" :key="item.id" class="flex flex-col">
                <label for="default-server">{{ item.name }}</label>
                <input id="default-server" type="radio" name="radio-1" class="radio" :checked="currentServer?.value === item.value" @change="currentServer = item">
              </li>
            </ul>
          </div>
          <input
            type="text"
            placeholder="请输入服务地址"
            :disabled="currentServer.value === 'default'"
            class="w-full max-w-xs input input-bordered"
            :value="hostValue"
            @input="hostValue = ($event.target as HTMLInputElement).value"
          >
        </div>
      </div>
    </label>
    <label class="flex flex-row items-center form-control">
      <button class="btn btn-circle btn-active btn-success" @click="openWs" />
      {{ wsStatus === 1 ? '已连接' : '未连接' }}
    </label>
  </fieldset>
</template>

<style scoped>

</style>
