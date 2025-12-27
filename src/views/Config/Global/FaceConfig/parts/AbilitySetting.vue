<script setup lang='ts'>
const definiteTime = defineModel<number | null>('definiteTime', { required: true })
</script>

<template>
  <fieldset class="p-4 border text-setting fieldset bg-base-200 border-base-300 rounded-box w-xs pb-10">
    <legend class="fieldset-legend">
      功能设置
    </legend>

    <label class="flex flex-row items-center form-control">
      <div class="">
        <div class="label flex flex-col justify-start items-start">
          <span class="label-text text-left">定时停止</span>
          <input
            v-model="definiteTime" type="number" placeholder="Type here"
            class="w-full max-w-xs input input-bordered"
          >
        </div>
      </div>
    </label>
  </fieldset>
</template>

<style scoped>

</style>
