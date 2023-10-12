<template>
  <div :id="id" class="i-multiple-select" ref="multipleSelect">
    <div class="i-multiple-select-btn"
         @click.native="isShow = true"
         :class="{isDisable: isDisable, '!tw-rounded-bl-none !tw-rounded-br-none': isShow}">
      <div class="i-multiple-select-content">
        <ul v-if="selectedOptions.length" class="selected-option-list">
          <li  v-for="(option, i) in selectedOptions.slice(0, 3)"
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
        <span v-else-if="!selectedOptions.length && !isShow" class="virtual-placeholder">{{ placeholder }}</span>
        <span v-if="selectedOptions.length >=4" class="tw-text-sm">and {{selectedOptions.length - 3}} more</span>
        <input class="i-multiple-select-input"
               :class="{'tw-py-1.5': selectedOptions.length >=4}"
               @focus="isShow = true"
               v-model.trim="searchKey"
               @input="searchOptions"
               v-if="!isDisable && isShow"
               type="text" :placeholder="placeholder">
      </div>
      <img :class="{isShow: isShow}"
           @click.stop="isShow = !isShow"
           class="toggle-icon"
           src="~assets/images/arrow.svg" alt="arrow">
    </div>
    <div v-show="isShow">
      <div class="option-list" :style="{maxHeight: maxHeight + 'px'}">
        <template v-if="displayOptions.length">
          <div v-for="(option, i) in displayOptions"
                 :key="i"
                 :class="{isDisabled: option.isDisabled, isSelected: option.isChecked}"
                  @click="updateSelectedOptions(option)"
                 class="option-item"
          >
            <input :id="`option-${id}-${option.code}`"
                   type="checkbox"
                   class="tw-mr-1 tw-select-none tw-pointer-events-none"
                   :checked="option.isChecked"
                   :class="{'tw-absolute tw-opacity-0': !isShowCheckBox}"
                   :disabled="option.isDisabled">
            <span class="option-item-text tw-block">{{ option.text ?? '---'}}</span>
          </div>
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
  isDisabled?: boolean,
  isChecked?: boolean
}

interface IProps {
  options?: Option[],
  selectedOptions?: Option[],
  isDisable?: boolean,
  placeholder?: string,
  isShowCheckBox?: boolean,
  id?: string,
  maxHeight?: number
}
interface IEmits {
  (e: "update:selectedOptions", value: Option[]): void;
  (e: "update:options", value: Option[]): void;
}

const props = withDefaults(defineProps<IProps>(), {
  placeholder: 'Select',
  maxHeight: 300
})
const emits = defineEmits<IEmits>()

const selectedOptions = useVModel(props, 'selectedOptions', emits)
const options = useVModel(props, 'options', emits)

const isShow = ref<boolean>(false)
const multipleSelect = ref<HTMLElement>()
const searchKey = ref<string>()
const displayOptions = ref<Option[]>([])

const updateSelectedOptions = (option: Option) => {
  if(!option.isChecked){
    selectOption(option)
  } else {
    unSelectOption(option)
  }
}
const selectOption = (option: Option) => {
  if (!selectedOptions.value || !options.value) return;
  const selectedOptionIndex: number = options.value.findIndex((opt: Option) => opt.code === option.code )
  options.value[selectedOptionIndex].isChecked = true

  if(selectedOptions.value.includes(option)){
    return
  }
  selectedOptions.value.push(option)
}

const unSelectOption = (option: Option) => {
  if (!options.value) return
  const delOptionIndex: number = options.value.findIndex((opt: Option) => opt.code === option.code )
  options.value[delOptionIndex].isChecked = false

  if (!selectedOptions.value) return;
  selectedOptions.value = selectedOptions.value.filter((e)=>{
    return e.code !== option.code
  })
}

const searchOptions = () => {
  if (!options.value) return
  let data: Option[] = [...options.value]
  if (searchKey.value) {
    const options = data.map(item => {
      return {
        text: item?.text ?? item,
        ...item,
      }
    })
    displayOptions.value = filteredOptions(options, searchKey.value)
  } else {
    displayOptions.value = [...options.value]
  }
}

watch(isShow, (val) => {
  if (val) {
    onClickOutside(multipleSelect.value, () => {
      isShow.value = false
      searchKey.value = ''
      if (!options.value) return
      displayOptions.value = [...options.value]
    })
  }
})

watch(() => options.value, (val) => {
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
    overflow-y: auto;
  }
  &-item {
    padding: 6px 10px;
    font-size: 14px;
    display: flex;
    align-items: center;
    &:last-child {
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
    }
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
    &.isSelected {
      background-color: lightgray;
      &:hover {
        background-color: #AFAFAF;
      }
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
.virtual-placeholder {
  color: gray;
  font-size: 14px;
}
</style>