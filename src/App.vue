<script setup lang="ts">
import { onMounted,ref } from 'vue'
import useStore from '@/store'
import { storeToRefs } from 'pinia'
import PlayMusic from '@/components/PlayMusic/index.vue'

import { themeChange } from 'theme-change'

const globalConfig = useStore().globalConfig
const prizeConfig = useStore().prizeConfig
const system=useStore().system
const { getTheme: localTheme } = storeToRefs(globalConfig)
const { getPrizeConfig: prizeList } = storeToRefs(prizeConfig)
// const { getIsMobile: isMobile } = storeToRefs(system)

const tipDialog=ref()
// const isMobileValue = ref(structuredClone(isMobile.value))
const setLocalTheme = (theme: any) => {
    themeChange(theme.name)
}

// 设置当前奖列表
const setCurrentPrize = () => {
    if (prizeList.value.length <= 0) {
        return
    }
    for (let i = 0; i < prizeList.value.length; i++) {
        if (!prizeList.value[i].isUsed) {
            prizeConfig.setCurrentPrize(prizeList.value[i])

            break
        }
    }

    return
}
// 判断是否手机端访问
const judgeMobile=()=>{
    const ua = navigator.userAgent
    const isAndroid = ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1
    const isIOS =!!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
    
    if(isAndroid||isIOS){
        tipDialog.value.showModal()
    }
    system.setIsMobile(isAndroid||isIOS)
}
onMounted(() => {
    setLocalTheme(localTheme.value)
    setCurrentPrize()
    judgeMobile()
})
</script>

<template>
     <dialog id="my_modal_1" ref="tipDialog" class="border-none modal">
        <div class="modal-box">
            <h3 class="text-lg font-bold">提示!</h3>
            <p class="py-4">请使用PC进行访问以获得最佳显示效果</p>
            <div class="modal-action">
                <form method="dialog" class="flex gap-3 justify-start w-full">
                    <!-- if there is a button in form, it will close the modal -->
                    <button class="btn">确定</button>
                </form>
            </div>
        </div>
    </dialog>
    <router-view></router-view>
    <PlayMusic class="absolute right-0 bottom-1/2"></PlayMusic>
</template>

<style scoped lang="scss"></style>
