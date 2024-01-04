<script setup lang="ts">
import { ref,onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { configRoutes } from '../../router';

const router = useRouter();
const menuList = ref(configRoutes.children);

const cleanMenuList=(menu:any)=>{
    const newList=menu;
    for(let i=0;i<newList.length;i++){
        if(newList[i].children){
            cleanMenuList(newList[i].children);
        }
        if(!newList[i].meta){
            newList.splice(i,1);
            i--;
        }
    }

return newList;
}
    menuList.value=cleanMenuList(menuList.value);

    const skip=(path:string)=>{
        router.push(path);
    }
</script>

<template>
    <div class="flex">
        <ul class="w-56 h-screen m-0 menu bg-base-200 pt-14 rounded-box">
            <li v-for="item in menuList" :key="item.name">
                <details open v-if="item.children">
                    <summary>{{ item.meta.title }}</summary>
                    <ul>
                        <li v-for="subItem in item.children" :key="subItem.name">
                            <details open v-if="subItem.children">
                                <summary>{{ subItem.meta.title }}</summary>
                                <ul>
                                    <li v-for="subSubItem in subItem.children" :key="subSubItem.name">
                                        <a @click="skip(subItem.path)">{{ subSubItem.meta!.title }}</a>
                                    </li>
                                </ul>
                            </details>
                            <a v-else @click="skip(subItem.path)">{{ subItem.meta!.title }}</a>
                        </li>
                    </ul>
                </details>
                <a v-else @click="skip(item.path)">{{ item.meta!.title }}</a>
            </li>
        </ul>
        <router-view></router-view>
    </div>
</template>

<style scoped></style>
