<template>
  <svg id="bezier-grid"
      xmlns="http://www.w3.org/2000/svg"
      class="ng-tns-c94-0"
      :viewBox="`0 0 ${width} ${height}`"
  >
    <line v-for="i in size.height"
        _ngcontent-khl-c93=""
        class="grid ng-star-inserted"
        x1="-1"
        :y1="i * r"
        :x2="width"
        :y2="i * r"
        :stroke-width="[i === size.height / 3 || i === size.height / 3 * 2 ? 1.4 : 0.2]"
    ></line>
    <line v-for="i in size.width"
          _ngcontent-khl-c93=""
          class="grid ng-star-inserted"
          :x1="i * r"
          y1="-1"
          :x2="i * r"
          :y2="height"
          :stroke-width="[i === (size.width / 3) || i === size.width / 3 * 2 ? 1.4 : 0.2]"
    ></line>
  </svg>
</template>
<script lang="ts" setup>
import { useWindowSize } from '@vueuse/core'
const r = 10
const { width, height } = useWindowSize()
const size = ref({
  width: 0,
  height: 0
})
watch(() => width.value, (val) => {
  if (val) {
    size.value.width = Math.round(val / r)
    let remainder =  size.value.width % 3;

    if (remainder !== 0) {
      size.value.width += 3 - remainder;
    }
  }
}, {deep: true, immediate: true})

watch(() => height.value, (val) => {
  if (val) {
    size.value.height = Math.round(val / r)
    let remainder =  size.value.height % 3;

    if (remainder !== 0) {
      size.value.height += 3 - remainder;
    }
  }
}, {deep: true, immediate: true})
</script>