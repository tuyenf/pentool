<template>
  <div class="bezier-panel" :class="{'notClick': isDrawing}">
    <div
        class="bezier-tool"
        @click="save"
        v-if="polygon"
    >
      <img src="~/assets/images/save.png" alt="" />
      <div class="bezier-tool__name">Save template</div>
    </div>
    <div
      class="bezier-tool"
      :class="{ isActive: onSelectionTool }"
      @click="changeTool('onSelectionTool')"
    >
      <img src="~/assets/images/selection-tool.png" alt="" />
      <div class="bezier-tool__name">Selection Tool</div>
    </div>
    <div
      class="bezier-tool"
      :class="{ isActive: onDirectSelectionTool }"
      @click="changeTool('onDirectSelectionTool')"
    >
      <img src="~/assets/images/direct-selection.png" alt="" />
      <div class="bezier-tool__name">Direct Selection Tool</div>
    </div>
    <div
      class="bezier-tool"
      :class="{ isActive: onPenTool }"
      @click="changeTool('onPenTool')"
    >
      <img src="~/assets/images/pen-tool.png" alt="" />
      <div class="bezier-tool__name">Pen Tool</div>
    </div>
    <div
      class="bezier-tool"
      :class="{ isActive: onDrawSpeechBubble }"
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
            class="bezier-tool"
            @click="drawSpeechBubble(i, true)"
            :class="{ isActive: isSelectedBubbleType && isSelectedBubbleType.type === i && isManual}"
        >
          <span class="bezier-tool__avt">{{ i + 1 }}</span>
          <div class="bezier-tool__name">Template {{ i + 1 }}</div>
          <div @click="deleteTemplate(i)" class="bezier-tool__delete">Remove</div>
        </div>
      </template>
    </template>
  </div>
</template>
<script lang="ts" setup>
import {BUBBLE_TEMPLATES} from "~/lib/utils/contants";
import {StorageService} from "~/lib/utils/StorageService";
import {CommonModule} from "~/lib/types/common";

interface IProps {
  onPenTool: boolean;
  onSelectionTool: boolean;
  onDirectSelectionTool: boolean;
  onDrawSpeechBubble: boolean;
  isDrawing: boolean;
  isSelectedBubbleType?: CommonModule.SelectedBubbleType;
  polygon?: CommonModule.Polygon
}
interface IEmits {
  (e: "update:onPenTool", value: boolean): void;
  (e: "update:onSelectionTool", value: boolean): void;
  (e: "update:onDirectSelectionTool", value: boolean): void;
  (e: "update:onDrawSpeechBubble", value: boolean): void;
  (e: "update:isSelectedBubbleType", value: CommonModule.SelectedBubbleType): void;
  (e: "update:targetPolygonIndex", value: number): void;
}

const props = defineProps<IProps>();
const emits = defineEmits<IEmits>();

const savedTemplates = ref<CommonModule.BubbleType[]>([])
const isManual = ref<boolean>(false)
const isRequestSubmit = ref<boolean>(false)

onBeforeMount(() => {
  const temps = StorageService.get('bubbleTemplates')
  if (!temps) return
  savedTemplates.value = [...temps]
})
const changeTool = (tool: string) => {
  emits("update:onPenTool", false);
  emits("update:onSelectionTool", false);
  emits("update:onDirectSelectionTool", false);
  emits("update:onDrawSpeechBubble", false);

  emits("update:" + tool, true);
  emits('update:targetPolygonIndex', -1)
};
const drawSpeechBubble = (type: number, label: boolean) => {
  isManual.value = label
  emits("update:isSelectedBubbleType", {
    type: type,
    isManual: isManual
  });
};

const save = () => {
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
}
</script>
<style lang="scss" scoped>
.notClick {
  user-select: none;
  pointer-events: none;
}
</style>
