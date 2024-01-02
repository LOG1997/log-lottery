<script lang="ts" setup>
import { computed } from 'vue';
const props = defineProps({
  prefix: {
    type: String,
    default: 'icon',
  },
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: '#242424',
  },
  size: {
    type: String,
    default: '24px',
  },
});

const symbolId = computed(() => `#${props.prefix}-${props.name}`);
</script>
<template>
  <svg
    aria-hidden="true"
    class="svg-icon"
    :width="props.size"
    :height="props.size"
  >
    <use :xlink:href="symbolId" />
  </svg>
</template>
<style scoped>
.svg-icon {
  width: 24px;
  height: 24px;
  fill: currentColor;
}
</style>
