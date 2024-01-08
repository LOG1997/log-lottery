<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { configRoutes } from '../../router';


const router = useRouter();
const route = useRoute();
const menuList = ref<any[]>(configRoutes.children)

const cleanMenuList = (menu: any) => {
    const newList = menu;
    for (let i = 0; i < newList.length; i++) {
        if (newList[i].children) {
            cleanMenuList(newList[i].children);
        }
        if (!newList[i].meta) {
            newList.splice(i, 1);
            i--;
        }
    }

    return newList;
}

menuList.value = cleanMenuList(menuList.value);

const skip = (path: string) => {
    router.push(path);
}


</script>

<template>
    <div class="flex min-h-[calc(100%-280px)]">
        <ul class="w-56 m-0 mr-3 menu bg-base-200 pt-14">
            <li v-for="item in menuList" :key="item.name">
                <details open v-if="item.children">
                    <summary>{{ item.meta.title }}</summary>
                    <ul>
                        <li v-for="subItem in item.children" :key="subItem.name">
                            <details open v-if="subItem.children">
                                <summary>{{ subItem.meta!.title }}</summary>
                                <ul>
                                    <li v-for="subSubItem in subItem.children" :key="subSubItem.name">
                                        <a @click="skip(subItem.path)"
                                            :style="subSubItem.name == route.name ? 'background-color:rgba(12,12,12,0.2)' : ''">{{
                                                subSubItem.meta!.title }}</a>
                                    </li>
                                </ul>
                            </details>
                            <a v-else @click="skip(subItem.path)"
                                :style="subItem.name == route.name ? 'background-color:rgba(12,12,12,0.2)' : ''">{{
                                    subItem.meta!.title }}</a>
                        </li>
                    </ul>
                </details>
                <a v-else @click="skip(item.path)"
                    :style="item.name == route.name ? 'background-color:rgba(12,12,12,0.2)' : ''">{{ item.meta!.title }}</a>
            </li>
        </ul>
        <router-view class="mt-5"></router-view>
    </div>
    <footer class="p-10 rounded footer footer-center bg-base-200 text-base-content">
        <nav class="grid grid-flow-col gap-4">
            <a class="link link-hover">About us</a>
            <a class="link link-hover">Contact</a>
            <a class="link link-hover">Jobs</a>
            <a class="link link-hover">Press kit</a>
        </nav>
        <nav>
            <div class="grid grid-flow-col gap-4">
                <a href="https://github.com/LOG1997/log-lottery" target="_blank" class="cursor-pointer">
                    <svg-icon name="github"></svg-icon>
                </a>
                <a><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="fill-current">
                        <path
                            d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z">
                        </path>
                    </svg></a>
                <a><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="fill-current">
                        <path
                            d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z">
                        </path>
                    </svg></a>
            </div>
        </nav>
        <aside>

            <p class="p-0 m-0">蜀ICP备2021028666号</p>
            <p>Copyright © 2024 - All right reserved by Log1997</p>
        </aside>
    </footer>
</template>

<style scoped></style>
