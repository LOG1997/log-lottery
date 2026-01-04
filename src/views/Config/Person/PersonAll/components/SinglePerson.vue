<script setup lang='ts'>
import { useI18n } from 'vue-i18n'

defineProps<{
    addOnePersonDrawerRef: any
    addOnePerson: (addOnePersonDrawerRef: any, event: any) => void
}>()

const { t } = useI18n()
const singlePersonData = defineModel<any>('singlePersonData', { required: true })
</script>

<template>
  <form class="fieldset rounded-box w-xs p-4" @submit="(e) => addOnePerson(addOnePersonDrawerRef, e)">
    <label class="fieldset">
      <span class="label">{{ t('table.number') }}</span>
      <input v-model="singlePersonData.uid" type="text" class="input validator" :placeholder="t('table.number')">
    </label>
    <fieldset class="fieldset">
      <label class="label" required>{{ t('table.name') }}<span class="text-red-500">*</span></label>
      <input v-model="singlePersonData.name" type="text" class="input validator" :placeholder="t('table.name')" required minlength="1">
      <p class="validator-hint hidden">
        {{ t('error.personNameEmpty') }}
      </p>
    </fieldset>
    <label class="fieldset">
      <span class="label">{{ t('table.department') }}</span>
      <input v-model="singlePersonData.department" type="text" class="input validator" :placeholder="t('table.department')">
    </label>
    <label class="fieldset">
      <span class="label">{{ t('table.avatar') }}</span>
      <input v-model="singlePersonData.avatar" type="text" class="input validator" :placeholder="t('table.avatar')">
    </label>
    <label class="fieldset">
      <span class="label">{{ t('table.identity') }}</span>
      <input v-model="singlePersonData.identity" type="text" class="input validator" :placeholder="t('table.identity')">
    </label>
    <button class="btn btn-neutral mt-4" type="submit">
      {{ t('button.confirm') }}
    </button>
    <button class="btn btn-ghost mt-1" type="reset" @click="addOnePersonDrawerRef.closeDrawer()">
      {{ t('button.cancel') }}
    </button>
  </form>
</template>

<style scoped>

</style>
