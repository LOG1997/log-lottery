<script setup lang='ts'>
import { useI18n } from 'vue-i18n'
import PageHeader from '@/components/PageHeader/index.vue'
import MsgListContainer from './parts/MsgListContainer.vue'
import ServerSetting from './parts/ServerSetting.vue'
import { useViewModel } from './useViewModel'

const { t } = useI18n()
const { serverList, currentServerValue, wsStatus, handleConnectWs, closeWs, msgList } = useViewModel()
</script>

<template>
  <div>
    <PageHeader :title="t('sidebar.server')" />
    <div>
      <ServerSetting
        v-model:current-server="currentServerValue"
        :server-list="serverList"
        :ws-status="wsStatus"
        :open-ws="handleConnectWs"
        :close-ws="closeWs"
      />
      <MsgListContainer
        :msg-list="msgList"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
