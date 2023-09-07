<template>
  <div class="nk-fmg-body">
    <div class="nk-fmg-body-content p-0 tw-flex">
      <div class="tw-m-3">
        <div>
          <span class="tw-w-[70px] tw-block">Words</span>
          <input class="tw-border tw-px-2 tw-h-[30px] tw-w-[400px]" type="text"
                 @input="isDone = false"
                 v-model="words">
        </div>
        <div class="tw-my-2">
          <span class="tw-w-[570px] tw-block">Width</span>
          <input class="tw-border tw-px-2 tw-h-[30px] tw-w-[400px]" type="text"
                 @input="isDone = false"
                 v-model.trim="textBox.width">
        </div>
        <div>
          <span class="tw-w-[570px] tw-block">Height</span>
          <input class="tw-border tw-px-2 tw-h-[30px] tw-w-[400px]" type="text"
                 @input="isDone = false"
                 v-model.trim="textBox.height">
        </div>
        <button class="tw-bg-primary tw-p-2 tw-mt-3" @click="breakLine">Break line</button>
      </div>
      <div v-if="isDone" ref="rhombus" class="rhombus" :style="{width: textBox.width + 'px', height: textBox.height + 'px'}">
        <div ref="innerBox" class="inner" :style="{width: textBox.width + 'px', height: textBox.height + 'px'}">
          <div class="left"></div><div class="right"></div>
          <div ref="contents" class="content">
            <span ref="texts" class="tw-text-center"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref} from "vue";
const texts = ref<HTMLElement>()
const contents = ref<HTMLElement>()
const rhombus = ref<HTMLElement>()
const innerBox = ref<HTMLElement>()
const words = ref<string>('')
const isDone = ref<boolean>(false)
const textBox = ref({
  width: 640,
  height: 640
})

const breakLine = () => {
  if (!words.value || !textBox.value.width || !textBox.value.height) return
  isDone.value = true
  nextTick(() => {
    texts.value.innerHTML = words.value
    fitText(rhombus.value);
  })
}
const fitText = (shape) => {

  let inner = shape.querySelector(".inner");

  let innerHeight = textBox.value.height;
  let innerHeightHalf = innerHeight / 2;
  let innerCenter = inner.getBoundingClientRect().top + innerHeightHalf;

  const maxHeightPercentage = 60;
  const maxFontSize = innerHeight / 8;
  const minFontSize = maxFontSize / 4;

  let fontSize = maxFontSize;

  contents.value.style.fontSize = fontSize + "px";
  contents.value.style.padding = "0";

  for (let i = 0; i < 25; i++) {

    let spanHeightHalf = texts.value.offsetHeight / 2;
    let padding = innerHeightHalf - spanHeightHalf;
    contents.value.style.padding = padding + "px 0 0 0";
    let spanHeightPercent = spanHeightHalf * 200 / innerHeight;
    if (spanHeightPercent > maxHeightPercentage) {
      if (spanHeightPercent > 100) {
        if (fontSize > minFontSize + 2)
          fontSize = fontSize - 2;
      } else {
        if (fontSize > minFontSize + 0.5)
          fontSize = fontSize - 0.5;
      }
      contents.value.style.fontSize = fontSize + "px";
    }

    spanHeightHalf = texts.value.offsetHeight / 2;
    spanHeightPercent = spanHeightHalf * 200 / innerHeight;

    let spanCenter = texts.value.getBoundingClientRect().top + spanHeightHalf;

    if ((spanHeightPercent <= maxHeightPercentage) && (Math.abs(spanCenter - innerCenter) < 1)) {
      break;
    } else {
      if (fontSize > minFontSize + 0.5) {
        fontSize = fontSize - 0.5;
        contents.value.style.fontSize = fontSize + "px";
      }
    }
  }
}
</script>
<style lang="scss" scoped>

body {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  font-family: sans-serif;
}

.rhombus {
  outline: 4px solid black;
  transform: scale(0.7) rotate(-45deg);
  margin: 40px 0;
  overflow: hidden;
}

.rhombus .inner {
  transform: scale(1.42) rotate(45deg);
}

.rhombus .inner .left {
  width: 50%;
  height: 100%;
  float: left;
  shape-outside: polygon(0 0, 105% 0, 5% 50%, 105% 100%, 0 100%);
}

.rhombus .inner .right {
  width: 50%;
  height: 100%;
  float: right;
  shape-outside: polygon(-5% 0, 100% 0, 100% 100%, -5% 100%, 95% 50%);
}

.rhombus .content {
  text-align: center;
  font-size: 36pt;
}

.rhombus .content span {
  outline: 2px dotted blue;
}

</style>

