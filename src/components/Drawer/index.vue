<script setup lang='ts'>
import { ref } from 'vue'

const drawerTriggerRef = ref <HTMLDialogElement | null> (null)
const visible = ref(false)
function showDrawer() {
    drawerTriggerRef.value?.click()
    visible.value = true
}
function closeDrawer() {
    drawerTriggerRef.value?.click()
    visible.value = false
}
defineExpose({
    showDrawer,
    closeDrawer,
})
</script>

<template>
  <div class="drawer drawer-end h-0 w-0">
    <input id="my-drawer-1" type="checkbox" class="drawer-toggle">
    <div class="drawer-content w-0 h-0 absolute">
      <!-- Page content here -->
      <label ref="drawerTriggerRef" for="my-drawer-1" />
    </div>
    <div class="drawer-side">
      <label for="my-drawer-1" aria-label="close sidebar" class="drawer-overlay" />
      <div v-if="visible" class="menu bg-base-200 min-h-full w-80 p-4">
        <slot name="content" />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
