<script setup lang='ts'>
import { Grip } from 'lucide-vue-next'
import { onMounted, ref, watch } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'

const list = ref([
  {
    name: 'Joao',
    id: '1',
  },
  {
    name: 'Jean',
    id: '2',
  },
  {
    name: 'Johanna',
    id: '3',
  },
  {
    name: 'Juan',
    id: '4',
  },
])
onMounted(() => {

})
</script>

<template>
  <div>
    <button class="btn btn-error">
      打印
    </button>
    <VueDraggable
      v-model="list"
      :animation="150"
      handle=".handle"
      class="flex flex-col gap-2 p-4 w-300px bg-gray-500/5 rounded"
    >
      <div
        v-for="(item, index) in list"
        :key="item.id"
        class="h-50px bg-gray-500/5 px-2 rounded flex items-center justify-between"
      >
        <Grip class="handle cursor-move" />
        <input v-model="item.name" type="text">
      </div>
    </VueDraggable>
  </div>
</template>

<style lang='scss' scoped>

</style>
