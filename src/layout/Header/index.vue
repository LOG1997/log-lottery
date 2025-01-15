<script setup lang="ts">
import { navList } from './config'

function skip(url: string) {
  window.open(url, '_self')
}
</script>

<template>
  <div class="h-full header-container">
    <div class="p-0 navbar bg-base-100">
      <div class="navbar-start max-lg:w-full">
        <div class="dropdown">
          <label tabindex="0" class="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabindex="0"
            class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 text-lg flex flex-col gap-2"
          >
            <li v-for="item in navList" :key="item.id" class="cursor-pointer hover:text-gray-100 hover:bg-base-200" @click="skip(item.url)">
              {{ item.name }}
            </li>
          </ul>
        </div>
        <a class="text-xl lg:pl-12 max-lg:mx-auto" href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" class="logo" alt="Vite logo">
        </a>
      </div>
      <div class="hidden navbar-center lg:flex">
        <ul class="flex gap-10 px-1 text-lg cursor-pointer menu menu-horizontal">
          <li v-for="item in navList" :key="item.id" class="hover:text-gray-100" @click="skip(item.url)">
            {{ item.name }}
          </li>
        </ul>
      </div>
      <div class="navbar-end max-lg:w-0">
        <a class="btn">Button</a>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
