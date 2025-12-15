<script setup lang='ts'>
import i18n from '@/locales/i18n'
import markdownit from 'markdown-it'
import { onMounted, ref } from 'vue'

const md = markdownit()
const readmeHtml = ref('')
function readMd() {
  fetch(`/${i18n.global.t('data.readmeName')}`)
    .then(res => res.text())
    .then((res) => {
      readmeHtml.value = md.render(res)
    })
}

onMounted(() => {
  readMd()
})
</script>

<template>
  <div class="w-3/4 mb-10 ml-3">
    <div v-dompurify-html="readmeHtml" class="markdown-body" />
  </div>
</template>

<style scoped>

</style>
