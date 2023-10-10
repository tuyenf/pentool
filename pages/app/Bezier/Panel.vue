<template>
  <div class="bezier-panel">
    <div :class="{'notClick': isDrawing}"
        class="bezier-tool"
        @click="save"
        v-if="polygon && !isDrawing"
    >
      <img src="~/assets/images/save.png" alt="" />
      <div class="bezier-tool__name">Save template</div>
    </div>
    <div
      class="bezier-tool"
      :class="{ isActive: onSelectionTool, 'notClick': isDrawing }"
      @click="changeTool('onSelectionTool')"
    >
      <img src="~/assets/images/selection-tool.png" alt="" />
      <div class="bezier-tool__name">Selection Tool</div>
    </div>
    <div
      class="bezier-tool"
      :class="{ isActive: onDirectSelectionTool, 'notClick': isDrawing }"
      @click="changeTool('onDirectSelectionTool')"
    >
      <img src="~/assets/images/direct-selection.png" alt="" />
      <div class="bezier-tool__name">Direct Selection Tool</div>
    </div>
    <div
      class="bezier-tool"
      :class="{ isActive: onPenTool, 'notClick': isDrawing }"
      @click="changeTool('onPenTool')"
    >
     p
      <div class="bezier-tool__name">Pen Tool</div>
    </div>
    <div
      class="bezier-tool"
      :class="{ isActive: onDrawSpeechBubble, 'notClick': isDrawing }"
      @click="changeTool('onDrawSpeechBubble')"
    >
      <img src="~/assets/images/draw-speech.png" alt="Bulle" />
      <div class="bezier-tool__name">Draw Speech Bubble</div>
    </div>
    <template v-if="onDrawSpeechBubble">
      <div
        v-for="(bubble, i) in BUBBLE_TEMPLATES"
        class="bezier-tool"
        @click="drawSpeechBubble(i, false)"
        :class="{ isActive: isSelectedBubbleType && isSelectedBubbleType.type === i && !isManual}"
      >
        <img
          v-if="i === 0"
          src="~/assets/images/bubbles/bubble_1.png"
          alt="bubble"
        />
        <img
          v-else-if="i === 1"
          src="~/assets/images/bubbles/bubble_2.png"
          alt="bubble"
        />
        <img
            v-else-if="i === 2"
            src="~/assets/images/bubbles/bubble_3.png"
            alt="bubble"
        />
        <img v-else src="~/assets/images/bubbles/bubble_4.png" alt="bubble" />
        <div class="bezier-tool__name">{{ bubble.name }}</div>
      </div>
      <template v-if="savedTemplates">
        <div
            v-for="(bubble, i) in savedTemplates"
            class="bezier-tool bezier-tool-custom"
            @click="drawSpeechBubble(i, true)"
            :class="{ isActive: isSelectedBubbleType && isSelectedBubbleType.type === i && isManual}"
        >
          <span class="bezier-tool__avt">{{ i + 1 }}</span>
          <div class="bezier-tool__name">Template {{ i + 1 }}</div>
          <div @click="deleteTemplate(i)" class="bezier-tool__delete">Remove</div>
        </div>
      </template>
    </template>

    <div class="bezier-tool bezier-tool-color"
    >
      <img @click="swapColor" class="bezier-tool-color-arrow" src="~/assets/images/2-way-arrow.png" alt="" />
      <div @click="activeFill(true)"
           @dblclick="showColorPicker"
           :class="{isNotActive: selectedBackgroundColor.style === 'none'}"
           :style="{backgroundColor: selectedBackgroundColor.style !== 'none' && !selectedBackgroundColor.isGradient ? selectedBackgroundColor.style : '#ffffff',
           zIndex: isFill ? 99 : 98, backgroundImage: selectedBackgroundColor.style !== 'none' && selectedBackgroundColor.isGradient ? selectedBackgroundColor.style : FILL_TYPES.DEFAULT}"
           class="bezier-tool__fill bezier-tool-color-item">
        <div class="bezier-tool__name">{{ isFill ? 'Fill' : 'Fill (click to activate)'}}</div>
      </div>
      <div @click="activeFill(false)"
           @dblclick="showColorPicker"
           :class="{isNotActive: selectedStrokeColor.style === 'none'}"
           :style="{backgroundColor: selectedStrokeColor.style !== 'none' && !selectedStrokeColor.isGradient ? selectedStrokeColor.style : '#ffffff',
            backgroundImage: selectedStrokeColor.style !== 'none' && selectedStrokeColor.isGradient ? selectedStrokeColor.style : FILL_TYPES.DEFAULT,
            zIndex: isFill ? 98 : 99}"
           class="bezier-tool__stroke bezier-tool-color-item">
        <div class="bezier-tool__name">{{ !isFill ? 'Stroke' : 'Stroke (click to activate)'}}</div>
      </div>
      <div class="bezier-tool-color-reset">
        <div @click="changeColorMode(FILL_TYPES.COLOR)"
             :class="{isActive: isActive === FILL_TYPES.COLOR}"
             class="bezier-tool-color-reset-item">
          <div :style="{backgroundColor: recentColor.style}"
               :class="{isStroke: !recentColor.isBackground}"
              class="bezier-tool-color-reset-icon bezier-tool-color-reset__white"></div>
          <div class="bezier-tool__name">{{ FILL_TYPES.COLOR.toUpperCase() }}</div>
        </div>
        <div @click="changeColorMode(FILL_TYPES.GRADIENT)"
             @dblclick="showColorPicker"
             :class="{isActive: isActive === FILL_TYPES.GRADIENT}"
             class="bezier-tool-color-reset-item">
          <div :style="{backgroundImage: recentGradientColor.style ?? GRADIENT_DEFAULT.style}"
               class="bezier-tool-color-reset-icon bezier-tool-color-reset__gradient"></div>
          <div class="bezier-tool__name">{{ FILL_TYPES.GRADIENT.toUpperCase() }}</div>
        </div>
        <div @click="changeColorMode()"
             :class="{isActive: isActive === FILL_TYPES.DEFAULT}"
             class="bezier-tool-color-reset-item">
          <div class="bezier-tool-color-reset-icon bezier-tool-color-reset__none"></div>
          <div class="bezier-tool__name">{{ FILL_TYPES.DEFAULT.toUpperCase() }}</div>
        </div>
      </div>
    </div>
  </div>
  <div id="colorPicker" v-if="onFillTool">
    <color-picker v-if="isActive === FILL_TYPES.GRADIENT"
                  id="colorGradientColor"
                  :is-gradient="true"
                  :gradient="recentGradientColor"
                  @start-change="(color) => onChange(color, 'start')"
                  @change="(color) => onChange(color, 'change')"
                  @end-change="(color) => onChange(color, 'end')"
    ></color-picker>
    <color-picker-normal v-else
                  :color="getColor"
                  @color-change="({ colors }) => onColorPickerChange(colors)"
    ></color-picker-normal>
  </div>
</template>
<script lang="ts" setup>
import {BUBBLE_TEMPLATES, COLOR_TYPES, FILL_TYPES, GRADIENT_DEFAULT, GRADIENT_TYPE} from "~/lib/utils/contants";
import {StorageService} from "~/lib/utils/StorageService";
import {CommonModule} from "~/lib/types/common";
import { ColorPicker as ColorPickerNormal } from 'vue-accessible-color-picker'
import ColorPicker from 'color-gradient-picker-vue3';
import 'color-gradient-picker-vue3/dist/style.css';
import {onClickOutside} from "@vueuse/core";

interface IProps {
  onPenTool: boolean;
  onSelectionTool: boolean;
  onDirectSelectionTool: boolean;
  onDrawSpeechBubble: boolean;
  onFillTool: boolean;
  isDrawing: boolean;
  isSelectedBubbleType?: CommonModule.SelectedBubbleType;
  polygon?: CommonModule.Polygon
}
interface IEmits {
  (e: "update:onPenTool", value: boolean): void;
  (e: "update:onSelectionTool", value: boolean): void;
  (e: "update:onDirectSelectionTool", value: boolean): void;
  (e: "update:onDrawSpeechBubble", value: boolean): void;
  (e: "update:onFillTool", value: boolean): void;
  (e: "update:isSelectedBubbleType", value: CommonModule.SelectedBubbleType): void;
  (e: "update:targetPolygonIndex", value: number): void;
  (e: "update:polygon", value: CommonModule.Polygon): void;
}

const props = defineProps<IProps>();
const emits = defineEmits<IEmits>();

const savedTemplates = ref<CommonModule.BubbleType[]>([])
const isManual = ref<boolean>(false)
const isRequestSubmit = ref<boolean>(false)
const polygon = useVModel(props, 'polygon', emits)
const isFill = ref<boolean>(true)
const selectedBackgroundColor = ref<CommonModule.Color>({
  style: FILL_TYPES.DEFAULT,
  isGradient: false,
  type: GRADIENT_DEFAULT.type,
  degree: GRADIENT_DEFAULT.degree,
  points: GRADIENT_DEFAULT.points,
})
const selectedStrokeColor = ref<CommonModule.Color>({
  style: FILL_TYPES.DEFAULT,
  isGradient: false,
  type: GRADIENT_DEFAULT.type,
  degree: GRADIENT_DEFAULT.degree,
  points: GRADIENT_DEFAULT.points,
})
const  recentColor = ref<CommonModule.RecentColor>({
  isBackground: true,
  style: '#ffffff'
})
const recentGradientColor = ref(GRADIENT_DEFAULT)
const isActive = ref<string>(FILL_TYPES.COLOR)
const alpha = ref(1)
const activeEle = ref({
  type: COLOR_TYPES.PICKER,
  index: 0,
})

const isActiveColorPicker = ref<boolean>(false)
const color = ref({
  red: 255,
  green: 0,
  blue: 0,
  alpha: 1
})
const onChange = (attrs: any) => {
  recentGradientColor.value = {...attrs}
  console.log(recentGradientColor.value)
  if (isFill.value) {
    selectedBackgroundColor.value = Object.assign({}, recentGradientColor.value, {
      isGradient: true
    })
  } else {
    selectedStrokeColor.value = Object.assign({}, recentGradientColor.value, {
      isGradient: true
    })
  }
  console.log(selectedBackgroundColor.value)
  changePolygonColor()
};
const getColor = computed(() => {
  return isFill.value && selectedBackgroundColor.value.style !== FILL_TYPES.DEFAULT && !selectedBackgroundColor.value.isGradient
      ? selectedBackgroundColor.value.style
      : selectedStrokeColor.value.style !== FILL_TYPES.DEFAULT && !selectedStrokeColor.value.isGradient
      ? selectedStrokeColor.value.style : '#000'
})

onBeforeMount(() => {
  const temps = StorageService.get('bubbleTemplates')
  if (!temps) return
  savedTemplates.value = [...temps]
})
onUpdated(() => {
  const colorPicker: HTMLElement | null = document.getElementById('colorPicker')
  if (!colorPicker) return
  onClickOutside(colorPicker, (event: any) => {
    if (event.target.getAttribute('id') !== 'workspace' || event.target.parentNode.matches('.vacp-color-picker')) return;
    emits("update:onFillTool", false);
  })
})
const onColorPickerChange = ({ hex, hsv }: CommonModule.ColorPickerResponse) => {
  alpha.value = hsv.a
  onActiveEleChange(COLOR_TYPES.PICKER)
  updateColor(hex)
}
const onActiveEleChange = (type: string, index = 0) => {
  activeEle.value = {
    type,
    index,
  }
  if (type !== COLOR_TYPES.PICKER) {
    isActiveColorPicker.value = false
  }
}
const updateColor = (value: string) => {
  if (!value || value === '#000') return
  recentColor.value.style = value
  isActive.value = FILL_TYPES.COLOR
  if (!isFill.value) {
    selectedStrokeColor.value.style = value
    recentColor.value.isBackground = false
  } else {
    selectedBackgroundColor.value.style = value
    recentColor.value.isBackground = true
  }

  changePolygonColor()
}
const changeTool = (tool: string) => {
  if (props.isDrawing) return
  emits("update:onPenTool", false);
  emits("update:onSelectionTool", false);
  emits("update:onDirectSelectionTool", false);
  emits("update:onDrawSpeechBubble", false);
  emits("update:onFillTool", false);

  emits("update:" + tool, true);
  emits('update:targetPolygonIndex', -1)
};
const showColorPicker = () => {
  emits("update:onFillTool", true);
}
const swapColor = () => {
  let tempColor = selectedBackgroundColor.value

  selectedBackgroundColor.value = selectedStrokeColor.value
  selectedStrokeColor.value = tempColor

  if (isFill.value) {
    recentColor.value.isBackground = true
    if (!selectedBackgroundColor.value.isGradient && selectedBackgroundColor.value.style !== FILL_TYPES.DEFAULT) {
      recentColor.value.style = selectedBackgroundColor.value.style
      isActive.value = FILL_TYPES.COLOR
    } else {
      isActive.value = FILL_TYPES.GRADIENT
    }
    if (selectedBackgroundColor.value.style === FILL_TYPES.DEFAULT) isActive.value = FILL_TYPES.DEFAULT
  } else {
    recentColor.value.isBackground = false
    if (!selectedStrokeColor.value.isGradient && selectedStrokeColor.value.style !== FILL_TYPES.DEFAULT) {
      recentColor.value.style = selectedStrokeColor.value.style
      isActive.value = FILL_TYPES.COLOR
    } else {
      isActive.value = FILL_TYPES.GRADIENT
    }
    if (selectedStrokeColor.value.style === FILL_TYPES.DEFAULT) isActive.value = FILL_TYPES.DEFAULT
  }

  changePolygonColor()
}
const changeColorMode = (type?: string = FILL_TYPES.DEFAULT) => {
  isActive.value = type
  if (type === FILL_TYPES.COLOR) {
    if (isFill.value) {
      selectedBackgroundColor.value = {
        style: recentColor.value.style ?? '#ffffff',
        isGradient: false
      }
    } else {
      selectedStrokeColor.value = {
        style: recentColor.value.style ?? '#ffffff',
        isGradient: false
      }
    }
  } else if (type === FILL_TYPES.GRADIENT) {
    if (isFill.value) {
      selectedBackgroundColor.value = Object.assign({}, recentGradientColor.value, {
        isGradient: true
      })
    } else {
      selectedStrokeColor.value = Object.assign({}, recentGradientColor.value, {
        isGradient: true
      })
    }
  } else {
    if (isFill.value) {
      selectedBackgroundColor.value = {
        style: FILL_TYPES.DEFAULT,
        isGradient: false
      }
    } else {
      selectedStrokeColor.value = {
        style: FILL_TYPES.DEFAULT,
        isGradient: false
      }
    }
  }
  changePolygonColor()
}
const drawSpeechBubble = (type: number, label: boolean) => {
  isManual.value = label
  emits("update:isSelectedBubbleType", {
    type: type,
    isManual: isManual
  });
};
const changePolygonColor = () => {
  if (!polygon.value) return
  polygon.value.colors.fill = selectedBackgroundColor.value
  polygon.value.colors.stroke = selectedStrokeColor.value
}
const activeFill = (fill?: boolean = false) => {
  isFill.value = fill
  if (fill) {
    isActive.value = selectedBackgroundColor.value.style === FILL_TYPES.DEFAULT ? isActive.value = FILL_TYPES.DEFAULT : selectedBackgroundColor.value.isGradient ? FILL_TYPES.GRADIENT : FILL_TYPES.COLOR
  } else {
    isActive.value = selectedStrokeColor.value.style === FILL_TYPES.DEFAULT ? isActive.value = FILL_TYPES.DEFAULT : selectedStrokeColor.value.isGradient ? FILL_TYPES.GRADIENT : FILL_TYPES.COLOR
  }
}
const save = () => {
  if (savedTemplates.value.length === 11) {
    alert('You can only save up to 12 templates. Please delete the current template to save the new template.')
    return
  }

  if (isRequestSubmit.value || !props.polygon) return
  isRequestSubmit.value = true
  const temp = [...savedTemplates.value, props.polygon]
  StorageService.set('bubbleTemplates', temp)
  savedTemplates.value = StorageService.get('bubbleTemplates')
  isRequestSubmit.value = false
  alert('Save success')
}
const deleteTemplate = (index: number) => {
  if (isRequestSubmit.value) return
  const isConfirm = confirm('You will not be able to restore this template if you delete it.\nAre you sure you want to delete this template?')
  if (!isConfirm) return
  isRequestSubmit.value = true
  savedTemplates.value.splice(index, 1)
  StorageService.set('bubbleTemplates', savedTemplates.value)
  isRequestSubmit.value = false
}

/*watch(polygon, (val) => {
  if (val && polygon.value) {
    if (polygon.value.strokeColor === FILL_TYPES.DEFAULT) {
      polygon.value.strokeColor = selectedStrokeColor.value.color
    }
    if (polygon.value.backgroundColor === FILL_TYPES.DEFAULT) {
      polygon.value.backgroundColor = selectedBackgroundColor.value.color
    }
  }
}, {deep: true})

watch(() => polygon.value?.strokeColor, (val) => {
  if (val && polygon.value?.strokeColor !== FILL_TYPES.DEFAULT) {
    isFill.value = false
    selectedStrokeColor.value.color = polygon.value?.strokeColor ?? FILL_TYPES.DEFAULT
    recentColor.value.color = polygon.value?.strokeColor ?? FILL_TYPES.DEFAULT
  }
})
watch(() => polygon.value?.backgroundColor, (val) => {
  if (val && polygon.value?.backgroundColor !== FILL_TYPES.DEFAULT) {
    isFill.value = true
    selectedBackgroundColor.value.color = polygon.value?.backgroundColor ?? FILL_TYPES.DEFAULT
    recentColor.value.color = polygon.value?.backgroundColor ?? FILL_TYPES.DEFAULT
  }
})*/
</script>
<style lang="scss" scoped>
.notClick {
  user-select: none;
  cursor: default;
}
</style>
