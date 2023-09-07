<template>
  <div class="bezier-panel" :class="{'notClick': isDrawing}">
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
        v-for="(bubble, i) in BUBBLE_TYPES"
        class="bezier-tool"
        @click="drawSpeechBubble(bubble)"
        :class="{ isActive: isSelectedBubbleType === bubble }"
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
        <div class="bezier-tool__name">{{ bubble }}</div>
      </div>
    </template>
  </div>
</template>
<script lang="ts" setup>
import { BUBBLE_TYPES } from "~/lib/utils/contants";

interface IProps {
  onPenTool: boolean;
  onSelectionTool: boolean;
  onDirectSelectionTool: boolean;
  onDrawSpeechBubble: boolean;
  isDrawing: boolean;
  isSelectedBubbleType?: string;
}
interface IEmits {
  (e: "update:onPenTool", value: boolean): void;
  (e: "update:onSelectionTool", value: boolean): void;
  (e: "update:onDirectSelectionTool", value: boolean): void;
  (e: "update:onDrawSpeechBubble", value: boolean): void;
  (e: "update:isSelectedBubbleType", value: string): void;
  (e: "update:targetPolygonIndex", value: number): void;
}

const props = defineProps<IProps>();
const emits = defineEmits<IEmits>();
const changeTool = (tool: string) => {
  emits("update:onPenTool", false);
  emits("update:onSelectionTool", false);
  emits("update:onDirectSelectionTool", false);
  emits("update:onDrawSpeechBubble", false);

  emits("update:" + tool, true);
  emits('update:targetPolygonIndex', -1)
};
const drawSpeechBubble = (type: string) => {
  emits("update:isSelectedBubbleType", type);
};
</script>
<style lang="scss" scoped>
.notClick {
  user-select: none;
  pointer-events: none;
}
</style>
