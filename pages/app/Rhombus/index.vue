<template>
  <div ref="texts" id="texts" class="textbox"></div>
</template>
<script lang="ts" setup>
const linesPerSide = ref<number>(2)
const texts = ref<HTMLElement>()
const contents = ref<string>('Lorem Ipsum is simply dummy text of the printing and typesetting industry.')
onMounted(() => {
  nextTick(() => {
    calcUpsidePyramid()
    calcDownsidePyramid()
  })
})
const calcUpsidePyramid = () => {
  const words = contents.value.split(' ')
  for (let i = 1; i <= linesPerSide.value + 1; i++) {
    texts.value.insertAdjacentHTML('beforeend', `<span></span>`)
    texts.value.innerHTML += '<br>'
    const spans = document.querySelectorAll('#texts span')
    for (let k = 0; k < 2 * i - 1; k++) {
      if (!spans) return
      console.log(i - 1 + k, 'line', i - 1)
      spans[i - 1].innerText += ` ${words[i - 1 + k]} `
    }
  }
}
const calcDownsidePyramid = () => {
  const words = contents.value.split(' ')
  for (let i = 1; i <= linesPerSide.value; i++) {
    texts.value.insertAdjacentHTML('beforeend', `<span></span>`)
    texts.value.innerHTML += '<br>'
    const spans = document.querySelectorAll('#texts span')
    for (let k = (linesPerSide.value + 1 - i) * 2 - 1; k > 0; k--) {
      if (!spans) return
      spans[linesPerSide.value + 1 + (i - 1)].innerText += ` ${words[(linesPerSide.value + 1) * (k + 1)]} `
    }
  }
}
</script>
<style lang="scss" scoped>
.textbox {
  text-align: center;
}
</style>