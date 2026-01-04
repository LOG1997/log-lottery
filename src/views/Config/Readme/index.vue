<script setup lang='ts'>
import markdownit from 'markdown-it'
import { onMounted, ref, watch } from 'vue'
import readmeEn from '@/assets/md/readme-en.md?raw'
import readmeZh from '@/assets/md/readme-zhCn.md?raw'
import i18n from '@/locales/i18n'

const md = markdownit()
const readmeHtml = ref('')

function getReadmeContent() {
    const locale = i18n.global.locale.value
    if (locale === 'zhCn') {
        return readmeZh
    }
    else {
        return readmeEn
    }
}
function readMd() {
    try {
        const content = getReadmeContent()
        readmeHtml.value = md.render(content)
    }
    catch (error) {
        console.error('Failed to load readme:', error)
        readmeHtml.value = '<p>Failed to load README content.</p>'
    }
}
// 监听语言变化
watch(() => i18n.global.locale.value, () => {
    readMd()
})
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
