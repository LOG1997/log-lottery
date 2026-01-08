<script setup lang='ts'>
import { useI18n } from 'vue-i18n'
import PageHeader from '@/components/PageHeader/index.vue'
import ServerSetting from './parts/ServerSetting.vue'
import { useViewModel } from './useViewModel'

const { t } = useI18n()
const { serverList, currentServerValue } = useViewModel()
</script>

<template>
  <div>
    <PageHeader :title="t('sidebar.server')" />
    <div>
      <ServerSetting
        v-model:current-server="currentServerValue"
        :server-list="serverList"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
