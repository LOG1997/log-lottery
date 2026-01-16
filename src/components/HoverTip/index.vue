<script setup lang='ts'>
import { CircleAlert, CircleCheck, Info, TriangleAlert } from 'lucide-vue-next'
import { computed } from 'vue'

interface Props {
    tip: string
    type?: 'success' | 'warning' | 'error' | 'info'
    direction?: 'top' | 'bottom' | 'left' | 'right'
    size?: '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
}

const props = withDefaults(defineProps<Props>(), {
    type: 'info',
    direction: 'top',
    size: 'sm',
})

const sizeObj = {
    '2xs': 'w-2 h-2',
    'xs': 'w-3 h-3',
    'sm': 'w-4 h-4',
    'md': 'w-5 h-5',
    'lg': 'w-6 h-6',
    'xl': 'w-7 h-7',
    '2xl': 'w-8 h-8',
}

const tipClassNames = computed(() => {
    return [
        `tooltip-${props.direction}`,
    ]
})

const iconClassNames = computed(() => {
    return [
        `w-${sizeObj[props.size]}`,
    ]
})
</script>

<template>
  <div class="tooltip" :class="tipClassNames" :data-tip="tip">
    <slot name="content" />
    <slot>
      <div :class="iconClassNames" class="hover:text-primary cursor-pointer">
        <CircleAlert v-if="type === 'warning'" class="w-full h-full text-warning" />
        <Info v-else-if="type === 'info'" class="w-full h-full" />
        <CircleCheck v-else-if="type === 'success'" class="w-full h-full text-success" />
        <TriangleAlert v-else-if="type === 'error'" class="w-full h-full text-error" />
      </div>
    </slot>
  </div>
</template>

<style scoped>

</style>
