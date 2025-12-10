<script setup lang='ts'>
import { ChevronDown, ChevronUp } from 'lucide-vue-next'
import { ref } from 'vue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useLocalFonts } from '@/hooks/useLocalFonts'

const inputRef = ref()

const { getFonts, disabled, fonts } = useLocalFonts()
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="text-2xl">
      code
    </div>
    <div class="text-2xl" style="font-family: 'Consolas Bold Italic';">
      code
    </div>
    <font-select id="font-select-1" value="" style="display: initial;" />
  </div>
  <div class="w-full h-full flex justify-center items-center">
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <label class="input cursor-default!" @click="getFonts">
          <input ref="inputRef" type="search" class="grow" placeholder="Search">
          <ChevronDown class="cursor-default" @click="inputRef.focus()" />
          <ChevronUp class="cursor-default" @click="inputRef.focus()" />
        </label>
      </DropdownMenuTrigger>
      <DropdownMenuContent class="w-56" align="start">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuGroup>
          <!-- <DropdownMenuItem v-for="[key, value] in Array.from(fonts)" :key="key" :style="{ fontFamily: `${key}` }">
            {{ key }}
          </DropdownMenuItem> -->
          <DropdownMenuSub v-for="[key, children] in Array.from(fonts)" :key="key">
            <DropdownMenuSubTrigger>
              <span :style="{ fontFamily: `${key}` }">{{ key }}</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem v-for="child in children" :key="child.value">
                  <span :style="{ fontFamily: `${child.value}` }">{{ child.name }}</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuItem>
            New Team
            <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>GitHub</DropdownMenuItem>
        <DropdownMenuItem>Support</DropdownMenuItem>
        <DropdownMenuItem disabled>
          API
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>

<style lang='scss' scoped>

</style>
