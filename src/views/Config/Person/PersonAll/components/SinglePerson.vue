<script setup lang='ts'>
defineProps<{
  addOnePersonDrawerRef: any
  addOnePerson: (addOnePersonDrawerRef: any, event: any) => void
}>()

const singlePersonData = defineModel<any>('singlePersonData', { required: true })
</script>

<template>
  <form class="fieldset rounded-box w-xs p-4" @submit="(e) => addOnePerson(addOnePersonDrawerRef, e)">
    <label class="fieldset">
      <span class="label">编号</span>
      <input v-model="singlePersonData.uid" type="text" class="input validator" placeholder="编号">
    </label>
    <fieldset class="fieldset">
      <label class="label" required>姓名<span class="text-red-500">*</span></label>
      <input v-model="singlePersonData.name" type="text" class="input validator" placeholder="姓名" required minlength="1">
      <p class="validator-hint hidden">
        请填写姓名
      </p>
    </fieldset>
    <label class="fieldset">
      <span class="label">部门</span>
      <input v-model="singlePersonData.department" type="text" class="input validator" placeholder="部门">
    </label>
    <label class="fieldset">
      <span class="label">头像</span>
      <input v-model="singlePersonData.avatar" type="text" class="input validator" placeholder="头像">
    </label>
    <label class="fieldset">
      <span class="label">身份</span>
      <input v-model="singlePersonData.identity" type="text" class="input validator" placeholder="身份">
    </label>
    <button class="btn btn-neutral mt-4" type="submit">
      确定
    </button>
    <button class="btn btn-ghost mt-1" type="reset" @click="addOnePersonDrawerRef.closeDrawer()">
      取消
    </button>
  </form>
</template>

<style scoped>

</style>
