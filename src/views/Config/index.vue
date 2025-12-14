<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { configRoutes } from '../../router'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const menuList = ref<any[]>(configRoutes.children)

function cleanMenuList(menu: any) {
  const newList = menu
  for (let i = 0; i < newList.length; i++) {
    if (newList[i].children) {
      cleanMenuList(newList[i].children)
    }
    if (!newList[i].meta) {
      newList.splice(i, 1)
      i--
    }
  }

  return newList
}

menuList.value = cleanMenuList(menuList.value)

function skip(path: string) {
  router.push(path)
}
</script>

<template>
  <div class="flex min-h-[calc(100%-280px)]">
    <ul class="w-56 m-0 mr-3 min-w-56 menu bg-base-200 pt-14">
      <li v-for="item in menuList" :key="item.name">
        <details v-if="item.children" open>
          <summary>{{ item.meta.title }}</summary>
          <ul>
            <li v-for="subItem in item.children" :key="subItem.name">
              <details v-if="subItem.children" open>
                <summary>{{ subItem.meta!.title }}</summary>
                <ul>
                  <li v-for="subSubItem in subItem.children" :key="subSubItem.name">
                    <a
                      :style="subSubItem.name === route.name ? 'background-color:rgba(12,12,12,0.2)' : ''"
                      @click="skip(subItem.path)"
                    >{{
                      subSubItem.meta!.title }}</a>
                  </li>
                </ul>
              </details>
              <a
                v-else :style="subItem.name === route.name ? 'background-color:rgba(12,12,12,0.2)' : ''"
                @click="skip(subItem.path)"
              >{{
                subItem.meta!.title }}</a>
            </li>
          </ul>
        </details>
        <a
          v-else :style="item.name === route.name ? 'background-color:rgba(12,12,12,0.2)' : ''"
          @click="skip(item.path)"
        >{{ item.meta!.title }}</a>
      </li>
    </ul>
    <router-view class="flex-1 mt-5" />
  </div>
  <footer class="p-10 rounded footer footer-center bg-base-200 text-base-content">
    <nav>
      <div class="grid grid-flow-col gap-4">
        <a href="https://github.com/yongjiu8/log-lottery" target="_blank" class="cursor-pointer text-inherit">
          <svg-icon name="github" />
        </a>
      </div>
    </nav>
    <aside>
      <p>Copyright © 2025 - All right reserved by yongjiu8</p>
    </aside>
  </footer>
</template>

<style scoped></style>
