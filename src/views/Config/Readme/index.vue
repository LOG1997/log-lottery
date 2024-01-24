<script setup lang='ts'>
import {ref,onMounted} from 'vue'
import markdownit from 'markdown-it'
const md = markdownit()
const readmeHtml=ref('')
const readMd=()=>{
    fetch('/log-lottery/readme.md')
    .then(res=>res.text())
    .then(res=>{
        readmeHtml.value = md.render(res)
    })
}

onMounted(() => {
    readMd()
})
</script>

<template>
<div class="w-3/4 mb-10 ml-3">
    <div class="markdown-body" v-dompurify-html="readmeHtml"></div>
</div>
</template>

<style scoped>

</style>
