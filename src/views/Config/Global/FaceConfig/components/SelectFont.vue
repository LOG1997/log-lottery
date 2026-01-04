<script setup lang='ts'>
import { refDebounced } from '@vueuse/core'
import { ChevronRight, ChevronsUpDownIcon } from 'lucide-vue-next'
import { PopoverArrow } from 'reka-ui'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { useLocalFonts } from '@/hooks/useLocalFonts'
import { cn } from '@/lib/utils'

const props = defineProps<{
    disabled?: boolean
}>()
const selectedFont = defineModel('selectedFont', {
    type: String,
    required: true,
})
const { getFonts, disabled: browserDisabled, fonts } = useLocalFonts()
const open = ref(false)
const activeKey = ref('')
const debouncedActiveKey = refDebounced(activeKey, 20)
const { t } = useI18n()
function selectFont(selectedValue: any) {
    open.value = false
    activeKey.value = ''
    selectedFont.value = selectedValue
}

function handelActiveKey(val: string) {
    activeKey.value = val
}

function handleScroll() {
    activeKey.value = ''
}
const disabledStyle = computed(() => {
    if (props.disabled || browserDisabled) {
        return {
            cursor: 'not-allowed',
        }
    }
    return {}
})
</script>

<template>
  <div class="w-full h-full flex justify-center items-center max-w-xs" :style="disabledStyle">
    <Popover v-model:open="open" class="w-full">
      <PopoverTrigger as-child :disabled="browserDisabled || disabled">
        <Button
          variant="outline"
          role="combobox"
          :aria-expanded="open"
          class="w-full justify-between truncate hover:bg-transparent hover:text-inherit"
          @click="getFonts"
        >
          <span class="w-7/8 text-left truncate" :style="{ fontFamily: `${selectedFont}` }">
            {{ selectedFont || t('placeHolder.selectFont') }}
          </span>
          <ChevronsUpDownIcon class="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-full p-0 bg-base-100">
        <Command>
          <CommandInput class="h-9" placeholder="Search framework..." />
          <CommandList @scroll="handleScroll">
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                v-for="[key, value] in fonts"
                :key="key"
                :value="key"
                class="w-full hover:bg-gray-200/60"
                @select="selectFont(key)"
              >
                <Popover :open="debouncedActiveKey === key" class="w-full">
                  <PopoverTrigger class="w-full">
                    <div :style="{ fontFamily: `${key}` }" class="w-full flex justify-between items-center" @mouseleave="handelActiveKey('')" @mouseenter="handelActiveKey(key)">
                      {{ key }}
                      <ChevronRight
                        :class="cn(
                          'ml-auto',
                        )"
                      />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent class="p-2 bg-base-100" side="right" @mouseleave="handelActiveKey('')" @mouseenter="handelActiveKey(key)">
                    <PopoverArrow />
                    <Command>
                      <CommandGroup>
                        <CommandItem
                          v-for="child in value"
                          :key="child.value"
                          :value="child.value"
                          class="w-full hover:bg-gray-200/60"
                          :style="{ fontFamily: `${key}` }"
                          @select="selectFont(child.value)"
                        >
                          {{ child.name }}
                        </CommandItem>
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  </div>
</template>

<style lang='scss' scoped>

</style>
