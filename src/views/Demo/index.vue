<script setup lang='ts'>
import { ref } from 'vue'
import { Switch } from '@/components/ui/switch'

const checked = ref(true)
</script>

<template>
  <fieldset class="fieldset bg-base-100 border-base-300 rounded-box w-64 border p-4">
    <legend class="fieldset-legend">
      Login options
    </legend>
    <label class="label">
      <input type="checkbox" :checked="checked" class="toggle border">
      Remember me
    </label>
  </fieldset>
  <div>
    <Switch class="cursor-pointer" />
  </div>
</template>

<style lang='scss' scoped>

</style>
