<script setup lang='ts'>
import NumberSeparate from '@/components/NumberSeparate/index.vue'
import {ref} from 'vue'

const total=ref(12)
const sep=ref([
    {id:'0',num:3,isUsed:false},
    {id:'1',num:4,isUsed:false},
    {id:'2',num:2,isUsed:false},
    {id:'3',num:3,isUsed:false},
])

const printPoo=()=>{
    console.log(sep.value)
}
</script>

<template>
<div>
    <NumberSeparate :totalNumber="total" :separatedNumber="sep"></NumberSeparate>
    <button class="btn btn-error" @click="printPoo">打印</button>
</div>
</template>

<style lang='scss' scoped>

</style>
