<template>
  <div class="i-multiple-select" ref="multipleSelect">
    <div class="i-multiple-select-btn"
         :class="{isDisable: isDisable}">
      <div class="i-multiple-select-content">
        <ul v-if="selectedOptions.length" class="selected-option-list">
          <li  v-for="(option, i) in selectedOptions.slice(0, 4)"
               :key="i"
               class="selected-option-item"
          >
            {{ option.text ?? '---'}}
            <img @click.stop="unSelectOption(option)"
                 v-if="!isDisable"
                 class="i-multiple-select-remove"
                 src="~assets/images/del.png" alt="Delete">
          </li>
        </ul>
        <span v-if="selectedOptions.length >=5" class="tw-text-sm">and {{selectedOptions.length - 4}} more</span>
        <input class="i-multiple-select-input"
               :class="{'tw-py-1.5': selectedOptions.length >=5}"
               @focus="isShow = true"
               v-model.trim="searchKey"
               @input="searchOptions"
               v-if="!isDisable"
               type="text" :placeholder="placeholder">
      </div>
      <img :class="{isShow: isShow}"
           @click.native="isShow = !isShow"
           class="toggle-icon"
           src="~assets/images/arrow.png" alt="arrow">
    </div>
    <div v-show="isShow">
      <div class="option-list">
        <template v-if="displayOptions.length">
          <label v-for="(option, i) in displayOptions"
                 :key="i"
                 :class="{isDisabled: option.isDisabled}"
                 :for="`option-${i}`"
                 class="option-item"
          >
            <input :id="`option-${i}`"
                   type="checkbox"
                   class="tw-mr-1"
                   :class="{'tw-absolute tw-opacity-0': !isShowCheckBox}"
                   @click="updateSelectedOptions($event, option)"
                   :disabled="option.isDisabled">
            <span class="tw-block">{{ option.text ?? '---'}}</span>
          </label>
        </template>
        <div v-else class="tw-py-1.5 tw-px-2.5 tw-text-sm">
          No data
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {onClickOutside} from "@vueuse/core";
import {filteredOptions} from "~/utils/global";
interface Option {
  text?: string,
  code?: number,
  isDisabled?: boolean
}

interface IProps {
  options?: Option[],
  selectedOptions?: Option[],
  isDisable?: boolean,
  placeholder?: string,
  isShowCheckBox?: boolean
}
interface IEmits {
  (e: "update:selectedOptions", value: Option[]): void;
}

const props = withDefaults(defineProps<IProps>(), {
  placeholder: 'Select',
})
const emits = defineEmits<IEmits>()

const selectedOptions = useVModel(props, 'selectedOptions', emits)
const isShow = ref<boolean>(false)
const multipleSelect = ref<HTMLElement>(null)
const searchKey = ref<string>()
const displayOptions = ref<Option[]>([])

const updateSelectedOptions = (event: MouseEvent, option: Option) => {
  if(event.target.checked){
    selectOption(option)
  } else {
    unSelectOption(option)
  }
}
const selectOption = (option: Option) => {
  if(selectedOptions.value.includes(option)){
    return
  }
  selectedOptions.value.push(option)
}

const unSelectOption = (option: Option) => {
  const delIndex = props.options?.findIndex((opt) => opt.code === option.code )
  const optionInput = document.getElementById(`option-${delIndex}`)
  if (!optionInput) return
  optionInput.checked = false
  selectedOptions.value = selectedOptions.value.filter((e)=>{
    return e.code !== option.code
  })
}

const searchOptions = () => {
  let data: Option[] = [...props.options]
  if (searchKey.value) {
    const options = data.map(item => {
      return {
        text: item?.text ?? item,
        ...item,
      }
    })
    displayOptions.value = filteredOptions(options, searchKey.value)
  } else {
    displayOptions.value = [...props.options]
  }
}

watch(isShow, (val) => {
  if (val) {
    onClickOutside(multipleSelect.value, () => {
      isShow.value = false
      searchKey.value = ''
      displayOptions.value = [...props.options]
    })
  }
})

watch(() => props.options, (val) => {
  if (val) {
    displayOptions.value = [...val]
  }
}, {deep: true, immediate: true})
</script>
<style lang="scss">
.i-multiple-select {
  width: 555px;
  margin: 10px;
  &-btn {
    border: 1px solid #1a202c;
    padding: 7px 10px 0 10px;
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    cursor: pointer;
    min-height: 38px;
    &.isDisable {
      user-select: none;
      pointer-events: none;
      opacity: 0.9;
    }
  }
  &-content {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
  &-input {
    background-color: transparent;
    flex-grow: 1;
    outline: none;
    font-size: 14px;
    &:focus {
      outline: none;
    }
    &::placeholder {
      color: gray;
      font-size: 14px;
    }
  }
  &-remove {
    width: 10px;
    height: 10px;
    flex-shrink: 0;
    margin-left: 6px;
    cursor: pointer;
  }
}
.option {
  &-list {
    display: flex;
    flex-direction: column;
    width: 100%;
    border: 1px solid #1a202c;
    border-top: 0;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    margin-top: -3px;
    padding-top: 3px;
  }
  &-item {
    padding: 6px 10px;
    font-size: 14px;
    display: flex;
    align-items: center;
    &:not(.isDisabled) {
      cursor: pointer;
    }
    &:not(.isDisabled):hover {
      background-color: lightgray;
    }
    &.isDisabled {
      opacity: 0.8;
      color: gray;
    }
  }
}
.selected-option {
  &-list {
    display: flex;
    justify-content: flex-start;
    align-items: stretch;
    flex-shrink: 0;
    width: fit-content;
    margin-right: 6px;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  &-item {
    background-color: lightgray;
    padding: 0 6px;
    border-radius: 5px;
    font-size: 14px;
    flex-shrink: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  &-item + .selected-option-item {
    margin-left: 4px;
  }
}
.toggle-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  margin-top: 2px;
  transition: all 0.25s ease;
  &.isShow {
    transform: rotate(180deg);
  }
}
</style>