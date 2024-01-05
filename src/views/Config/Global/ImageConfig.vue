<script setup lang='ts'>
import { ref, onMounted, watch } from 'vue'
import { readImage } from '@/utils/file'
import localforage from 'localforage'

const limitType = ref('image/*')
const imgList = ref<any>([])
const imgUploadToast = ref(0) //0是不显示，1是成功，2是失败,3是不是图片
const imageDbStore = localforage.createInstance({
    name: 'imgStore'
})
const handleFileChange = async (e: any) => {
    const isImage= /image*/.test(e.target.files[0].type)
    if (!isImage) {
        imgUploadToast.value = 3

        return
    }
    let { dataUrl, fileName } = await readImage(e.target.files[0])
    imageDbStore.setItem(new Date().getTime().toString() + '+' + fileName, dataUrl)
        .then(() => {
            imgUploadToast.value = 1
            getImageDbStore()
        })
        .catch(() => {
            imgUploadToast.value = 2
        })
}

const getImageDbStore =async () => {
    imgList.value = []
    const keys =await imageDbStore.keys()
    if(keys.length>0){
        imageDbStore.iterate((value, key) => {
            imgList.value.push({
                key,
                value
            })
        })
    }
}

onMounted(() => {
    getImageDbStore()
})
watch(() => imgUploadToast.value, (val) => {
    if (val !== 0) {
        setTimeout(() => {
            imgUploadToast.value = 0
        }, 2000)
    }
})
</script>

<template>
    <div class="toast toast-top toast-end">
        <div class="alert alert-error" v-if="imgUploadToast == 2">
            <span>上传失败</span>
        </div>
        <div class="alert alert-success" v-if="imgUploadToast == 1">
            <span>上传成功</span>
        </div>
        <div class="alert alert-error" v-if="imgUploadToast == 3">
            <span>不是图片</span>
        </div>
    </div>

    <div>
        <div class="">
            <label for="explore">
                <input type="file" class="" id="explore" style="display: none" @change="handleFileChange"
                    :accept="limitType" />
                <span class="btn btn-primary btn-sm">上传图片</span>
            </label>
        </div>
        <ul>
            <li v-for="item in imgList" :key="item">
                <div class="flex items-center gap-3">
                    <div class="avatar">
                        <div class="w-12 h-12 mask mask-squircle">
                            <img :src="item.value" alt="Avatar Tailwind CSS Component" />
                        </div>
                    </div>
                    <div>
                        <div class="font-bold">{{ item.key.split('+')[1] }}</div>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<style lang='scss' scoped></style>
