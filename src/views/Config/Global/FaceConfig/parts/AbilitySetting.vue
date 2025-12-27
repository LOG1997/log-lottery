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
          <label class="label">
            <span class="label-text text-left">定时停止</span>
            <div class="tooltip" data-tip="开始抽奖过后定时停止，默认为0，单位为秒，0为关闭定时停止功能">
              <button class="btn btn-circle h-4 hover:bg-base-300">
                ?
              </button>
            </div>
          </label>
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
