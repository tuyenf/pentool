<template>
  <component :is="tag"
             :to="!disabled ? href : null"
             :disabled="disabled"
             :style="[colorStyle, {...manualCustom}]"
             :class="[shape, `button-${size}`]"
             class="tw-border tw-flex tw-items-center tw-font-semibold i-button"
             @click="emits('click')"
  >
    <slot name="leadingIcon"></slot>
    <span v-if="text">{{ text }}</span>
    <slot name="trailingIcon"></slot>
  </component>
</template>
<script lang="ts" setup>
interface ManualCustom {
  minWidth?: string,
  height?: string,
  color?: string,
  backgroundColor?: string,
  borderRadius?: string,
  borderColor?: string
}

interface IProps {
  type?: string,
  href?: string,
  text?: string,
  disabled?: boolean,
  size?: string,
  mode?: string,
  shape?: string,
  variant?: string // 'outline', 'ghost'

  // Manual customization
  manualCustom?: ManualCustom
}
interface IEmits {
  (e: 'click', value: Event): void
}

const props = withDefaults(defineProps<IProps>(), {
  type: 'primary', // 'secondary', 'dark', 'orange', 'gray', 'light-gray'
  disabled: false, // true
  size: 'sm', // 'md', 'lg', 'xl',
  mode: 'light', // 'dark',
  shape: 'tw-rounded-none', // 'rounded-full', View detail at: https://tailwindcss.com/docs/border-radius#rounded-corners,
  variant: '', // 'outline', 'ghost'
})
const emits = defineEmits<IEmits>()

const tag = computed(() => props.href ? resolveComponent('NuxtLink') : 'button')
const color = {
  'primary': '#525252',
  'secondary': '#C7D3DC',
  'dark': '#94A2AB',
  'light-gray': '#E0E7EC',
  'gray': '#AFAFAF',
  'orange': '#FB973B',
  'neutralBlack': '#282626',
  'neutralWhite': '#F5F5F5',
}

const colorStyle = reactive({
  backgroundColor: !props?.variant ? color[props?.type] : 'transparent',
  borderColor: props.variant === 'outline' ? color[props?.type] : 'transparent',
  color: props.variant  ? color[props?.type] : props.mode === 'dark' ? color.neutralWhite : color.neutralBlack,
})
</script>
<style lang="scss" scoped>
*[disabled = true],
:disabled {
  opacity: 0.8;
}
.button {
  &-sm {
    padding: 6px;
    font-size: 14px;
  }
  &-md {
    padding: 10px 8px;
    font-size: 14px;
  }
  &-lg {
    padding: 12px;
    font-size: 16px;
  }
  &-xl {
    padding: 13.5px;
    font-size: 18px;
  }
}
.i-button {
  min-width: 32px;
  justify-content: center;
  line-height: 1.3;
}
.i-button:has(img) span {
  margin-right: 16px;
}
.i-button:has(img) {
  justify-content: space-between;
}
* + span {
  display: inline-block;
  margin-left: 16px;
  margin-right: 0;
}

:slotted(*) {
  width: 20px;
  height: 20px;
}
</style>