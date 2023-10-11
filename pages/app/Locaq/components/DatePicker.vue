<template>
  <VueDatePicker
      v-model="range"
      class="customDatepicker"
      range
      position="left"
      :enable-time-picker="false"
      :placeholder="placeholder"
      auto-apply
      :hide-navigation="['month', 'year']"
      format="yyyy/MM/dd"
      :inputClassName="inputClassName"
      :year-range="[1950, new Date().getFullYear()]"
      :month-change-on-scroll="false"
  >
    <template #input-icon>
      <img
          class="dp__icon dp__input_icon dp__input_icons"
          src="~/assets/images/calendar.svg"
          alt="date-picker-icon"
      />
    </template>
  </VueDatePicker>
</template>
<script lang="ts" setup>
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
interface IProps {
  timeRange?: string[]
  placeholder?: string,
  inputClassName?: string
}
interface IEmits {
  (e: 'update:timeRange', value: string[]): void
}
const props = withDefaults(defineProps<IProps>(), {
  placeholder: 'Time'
})
const emits = defineEmits<IEmits>()

const range = ref(props.timeRange)

watch(range, (val) => {
  if (val) {
    emits('update:timeRange', val)
  }
})
</script>
<style lang="scss">
.customDatepicker {
  width: 220px;
  .dp__input_icon_pad {
    padding: 11px 12px 11px 40px;
    font-size: 14px;
    border: 1px solid #EBEAED;
    max-height: 42px;
    &::placeholder {
      color: #94A2AB;
      font-size: 14px;
    }
  }
  .dp__clear_icon {
    padding: 0;
    right: 8px;
  }
  span.dp__input_icon,
  .dp__clear_icon {
    top: unset;
    bottom: 13px;
    transform: translateY(0);
  }
  span.dp__input_icon {
    width: 20px;
    height: 20px;
    left: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    .dp__icon {
      padding: 0;
      width: 100%;
      height: 100%;
    }
  }
}
</style>