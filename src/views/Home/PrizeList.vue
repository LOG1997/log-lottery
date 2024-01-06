<script setup lang='ts'>
import {ref} from 'vue'
import {storeToRefs} from 'pinia'
import useStore from '@/store'

const prizeConfig=useStore().prizeConfig
const {getPrizeConfig:localPrizeList}=storeToRefs(prizeConfig)


const delAll = () => {
    prizeConfig.deleteAllPrizeConfig()
}

const resetDefault = () => {
    prizeConfig.resetDefault()
}

const print = () => {
    console.log(prizeConfig)
}
</script>

<template>
<div>
    
    <button class="btn btn-secondary" @click="delAll">全部删除</button>
    
    <button class="btn btn-secondary" @click="resetDefault">默认</button>

    
    <button class="btn btn-secondary" @click="print">打印</button>
</div>
</template>

<style lang='scss' scoped>

</style>
