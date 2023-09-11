<template>
  <g v-for="(polygon, i) in polygons"
      class="polygon"
     :id="`polygon-${i}`"
     :class="{
            isFilled: polygon.isFilled,
            isSelected: targetPolygonIndex === i,
            isMoving: targetPolygonIndex === i && isMoveAPolygon,
          }"
     @mousedown="handleMouseDownPolygon($event)"
     @click="activePolygon(i)"
  >
    <defs>
      <linearGradient  v-for="(segment, index) in polygon.segments"
                       :key="index"
          :id="`decoration-${index}`"
          :x1="segment.start.x" :y1="segment.start.y" :x2="segment.end.x" :y2="segment.end.y"
          gradientUnits="userSpaceOnUse"
          class="gradient">
        <stop offset="0" stop-color="#FF4D81"></stop>
        <stop offset="0.5" stop-color="#FA8172"></stop>
        <stop offset="1" stop-color="#FF4D81"></stop>
      </linearGradient>
      <linearGradient v-if="polygon.pathAbsolute && !isStageEnded[i]"
                      id="decorationAbsolute"
                      :x1="polygon.pathAbsolute?.start?.x"
                      :y1="polygon.pathAbsolute.start.y"
                      :x2="polygon.pathAbsolute.end.x"
                      :y2="polygon.pathAbsolute.end.y"
                      gradientUnits="userSpaceOnUse" class="gradient">
        <stop offset="0" stop-color="#00a296"></stop>
        <stop offset="1" stop-color="#0099dd"></stop>
      </linearGradient>
    </defs>
    <path class="pathAbsolute" ref="pathAbsolute"
          :d="`M ${polygon.pathAbsolute?.start?.x} ${polygon.pathAbsolute.start.y}
                C ${polygon.pathAbsolute.controlPoint1.x} ${polygon.pathAbsolute.controlPoint1.y}
                ${polygon.pathAbsolute.end.x} ${polygon.pathAbsolute.end.y}
                ${polygon.pathAbsolute.end.x} ${polygon.pathAbsolute.end.y}`"
          :id="`pathAbsolute-${i}`"
          v-if="polygon.pathAbsolute && !isStageEnded[i]"
          style="opacity: 1"
          stroke="url(#decorationAbsolute)"
    ></path>
    <g :id="`segments-${i}`">
      <path
          v-for="(segment, index) in polygon.segments"
          :key="index"
          :d="`M ${segment.start.x} ${segment.start.y}
                        C ${segment.controlPoint1.x} ${segment.controlPoint1.y} ${segment.controlPoint2.x}
                        ${segment.controlPoint2.y} ${segment.end.x} ${segment.end.y}`"
          :id="`segment-${i}-${index}`"
          style="opacity: 1"
          :stroke="`url(#decoration-${index})`"
      ></path>
    </g>
    <g :id="`anchorPoints-${i}`">
      <g
          v-for="(node, index) in polygon.nodes"
          :key="index"
          class="node_group"
          :class="{ startpoint: node.isStartPoint }"
          :id="`anchorPoint-${i}-${index}`"
      >
        <line
            v-for="(line, li) in node.lines"
            :key="li"
            :x1="line.x1"
            :y1="line.y1"
            :x2="line.x2"
            :y2="line.y2"
            :class="{ hide: i !== targetPolygonIndex || !(onPenTool || onDirectSelectionTool) }"
            stroke="#4E7FFF"
            style="opacity: 1"
        ></line>
        <circle
            v-for="(circle, ci) in node.circles"
            :key="ci"
            :cx="circle.x"
            :cy="circle.y"
            :r="r"
            @mousedown.self="handleMoveControler($event, i, index, ci)"
            :class="{
                  hide: i !== targetPolygonIndex || !(onPenTool || onDirectSelectionTool),
                  isEditing: onDirectSelectionTool,
                }"
            style="opacity: 1"
            fill="#4E7FFF"
        ></circle>
        <rect
            @mousedown.self="handleMouseDownNode($event, i, index)"
            :x="node.rect.x - r"
            :y="node.rect.y - r"
            :width="a"
            :height="b"
            :class="{
                  hide: i !== targetPolygonIndex || !(onPenTool || onDirectSelectionTool),
                  isEditing: onDirectSelectionTool,
                }"
            fill="#4E7FFF"
        ></rect>
      </g>
      <polygon
          v-if="polygon.isFilled"
          :points="pointToString(polygon.nodes)"
          :fill="[polygon.isFilled ? '#FF6D91' : 'transparent']"
      />
    </g>
  </g>
  <!--START BOUNDING BOX-->
  <bezier-bounding-box v-model:targetPolygonIndex="targetPolygonIndex"
                       v-model:polygon="polygons[targetPolygonIndex]"
                       v-model:polygons="polygons"
                       :onPenTool="onPenTool"
                       :onSelectionTool="onSelectionTool"
                       :onDirectSelectionTool="onDirectSelectionTool"
                       :onDrawSpeechBubble="onDrawSpeechBubble"
                       :isDrawingSpeechBubble="isDrawingSpeechBubble"
                       @update:isDrawingSpeechBubble="(newVal) => isDrawingSpeechBubble = newVal"
                       :isResetBoundingBox="isResetBoundingBox"
                       @update:isResetBoundingBox="(newVal) => isResetBoundingBox = newVal"
                       :isReCalcBoundingBox="isReCalcBoundingBox"
                       @update:boundingBox="(newVal) => boundingBox = newVal"
  />
  <!--END BOUNDING BOX-->
</template>
<script lang="ts" setup>
import BezierBoundingBox from "~/pages/app/Bezier/BoundingBox.vue"
import {useKeyModifier} from "@vueuse/core";
import {KEY_BOARD} from "~/lib/utils/contants";
import {getMinMaxValue} from "~/lib/utils/global";

interface IProps {
  polygons: CommonModule.Polygon[],
  polygon: CommonModule.Polygon,
  onPenTool: boolean,
  onSelectionTool: boolean,
  onDirectSelectionTool: boolean,
  onDrawSpeechBubble: boolean,
  isStageEnded: boolean[],
  targetPolygonIndex: number,
  isDrawingSpeechBubble?: boolean
  isResetBoundingBox?: boolean
}
interface IEmits {
  (e: 'update:polygons', value: CommonModule.Polygon[]): void
  (e: 'update:polygon', value: CommonModule.Polygon): void
  (e: 'update:targetPolygonIndex', value: number | null): void
  (e: 'update:isDrawingSpeechBubble', value: boolean): void
  (e: 'update:isResetBoundingBox', value: boolean): void
}
const emits = defineEmits<IEmits>()
const props = defineProps<IProps>()
const targetPolygonIndex = useVModel(props, 'targetPolygonIndex', emits)
const isResetBoundingBox = useVModel(props, 'isResetBoundingBox', emits)
const polygon = useVModel(props, 'polygon', emits)
const polygons = useVModel(props, 'polygons', emits)
const boundingBox = ref<CommonModule.BoundingBox>({
  handlers: [],
  segments: [],
});

const r = 4;
const a = 8;
const b = 8;

const nodeIndex = ref(0);
const circleIndex = ref(0);

const isMoveAPolygon = ref<boolean>(false);
const isMoveAnAnchorPoint = ref<boolean>(false);
const isMoveAController = ref<boolean>(false);
const editOneController = ref<boolean>(false);

const isReCalcBoundingBox = ref<boolean>(false);
const mouseDownEvent = ref(null);
const mousePressEvent = ref(null);
const isMousePress = ref<boolean>(false);
const fixedPolygonPosition = ref({
  x: 0,
  y: 0,
  spaceX: 0,
  spaceY: 0,
});
const isAlt = useKeyModifier(KEY_BOARD.ALT)

onMounted(() => {
  nextTick(() => {
    const svg = document.querySelector('svg')
    svg.addEventListener('mouseup', handleMouseUp)
  })
})
const handleMouseUp = () => {
  document.removeEventListener("mousemove", moveAnAnchorPoint);
  document.removeEventListener("mousemove", moveAPolygon);
  document.removeEventListener("mousemove", moveAController);
  clearTimeout(mouseDownEvent.value);
  clearTimeout(mousePressEvent.value);

  isReCalcBoundingBox.value = false
  isMousePress.value = false;
  isMoveAnAnchorPoint.value = false;
  isMoveAController.value = false;
  editOneController.value = false;
  isMoveAPolygon.value = false

  const isAutoCreate = polygon.value?.isAutoCreate

  if (!(isAutoCreate && props.onDrawSpeechBubble)) {
    updateNewPosition();
  } else {
    updateAutoPosition()
  }
  if (!props.isStageEnded[targetPolygonIndex.value] || polygon.value.nodes[0].isZigzag) return
  if (polygon.value.nodes[0].circles[1] === polygon.value.nodes[0].rect) {
    polygon.value.nodes[0].isZigzag = true
  } else {
    polygon.value.nodes[0].isZigzag = false
  }
};
const handleMouseDownPolygon = () => {
  if (!props.onSelectionTool || targetPolygonIndex.value < 0) return;
  isMoveAPolygon.value = true;
  mousePressEvent.value = setTimeout(() => {
    isMousePress.value = true;
    document.addEventListener("mousemove", moveAPolygon);
  }, 150);
};
const activePolygon = (i: number) => {
  if (!props.onSelectionTool && !props.onDirectSelectionTool) return;
  if (i >= 0 && i < polygons.value.length && polygons.value.length > 1) {
    const selectedItem = polygons.value.splice(i, 1)[0];
    polygons.value.push(selectedItem);
  }
  isReCalcBoundingBox.value = true
  targetPolygonIndex.value = polygons.value.length - 1
};
watch(isAlt, (val) => {
  if (val) editOneController.value = true;
  else editOneController.value = false
})
const handleMoveControler = (event: MouseEvent, polygonId: number, nodeId: number, circleId: number) => {
  if (!props.onDirectSelectionTool || targetPolygonIndex.value == null) return;
  nodeIndex.value = nodeId;
  targetPolygonIndex.value = polygonId;
  circleIndex.value = circleId;
  mouseDownEvent.value = setTimeout(() => {
    isMousePress.value = true;
    isMoveAController.value = true;
    document.addEventListener("mousemove", moveAController);
  }, 100);
};
const handleMouseDownNode = (event: MouseEvent, polygonId: number, nodeId: number) => {
  if (!props.onDirectSelectionTool) return;
  nodeIndex.value = nodeId;
  targetPolygonIndex.value = polygonId;
  mouseDownEvent.value = setTimeout(() => {
    isMousePress.value = true;
    isMoveAnAnchorPoint.value = true;
    document.addEventListener("mousemove", moveAnAnchorPoint);
  }, 150);
};
const moveAnAnchorPoint = (e: MouseEvent) => {
  const newPosition = {
    x: e.offsetX,
    y: e.offsetY,
  };
  const nodes = polygon.value.nodes
  const segments = polygon.value.segments
  const numberController = nodes[nodeIndex.value].lines.length
  if (numberController) {
    const isLeftToRight = newPosition.x > nodes[nodeIndex.value].rect.x;
    const isTopToBottom = newPosition.y > nodes[nodeIndex.value].rect.y;
    const space = {
      x: Math.abs(nodes[nodeIndex.value].rect.x - newPosition.x),
      y: Math.abs(nodes[nodeIndex.value].rect.y - newPosition.y),
    };
    for (let i = 0; i < numberController; i++) {
      nodes[nodeIndex.value].lines[i].x1 = newPosition.x;
      nodes[nodeIndex.value].lines[i].y1 = newPosition.y;
    }

    for (let i = 0; i < numberController; i++) {
      if (isLeftToRight) nodes[nodeIndex.value].circles[i].x += space.x;
      else nodes[nodeIndex.value].circles[i].x -= space.x;
      if (isTopToBottom) nodes[nodeIndex.value].circles[i].y += space.y;
      else nodes[nodeIndex.value].circles[i].y -= space.y;
    }

    for (let i = 0; i < numberController; i++) {
      nodes[nodeIndex.value].lines[i].x2 = nodes[nodeIndex.value].circles[i].x;
      nodes[nodeIndex.value].lines[i].y2 = nodes[nodeIndex.value].circles[i].y;
    }
  } else if (nodeIndex.value > 0) {
    segments[nodeIndex.value - 1].controlPoint2 = newPosition;
    segments[nodeIndex.value].controlPoint1 = newPosition;
  } else {
    segments[0].controlPoint1 = newPosition;
    segments[segments?.length - 1].controlPoint2 = newPosition;
  }

  nodes[nodeIndex.value].rect = newPosition;

  // Update segments
  if (nodeIndex.value > 0) {
    segments[nodeIndex.value - 1].end.x = newPosition.x;
    segments[nodeIndex.value - 1].end.y = newPosition.y;
    segments[nodeIndex.value].start.x = newPosition.x;
    segments[nodeIndex.value].start.y = newPosition.y;
  } else {
    segments[0].start = newPosition;
    segments[segments?.length - 1].end = newPosition;
    if (numberController === 1) segments[segments?.length - 1].controlPoint2 = newPosition;
  }
};
const updateNewPosition = () => {
  if (!fixedPolygonPosition.value.spaceX && !fixedPolygonPosition.value.spaceY || !polygon.value) return;
  isMoveAPolygon.value = false;
  fixedPolygonPosition.value.x = 0;
  fixedPolygonPosition.value.y = 0;
  polygon.value.nodes.forEach((node) => {
    node.rect.x += fixedPolygonPosition.value.spaceX;
    node.rect.y += fixedPolygonPosition.value.spaceY;
    if (node.lines.length && node.circles.length) {
      for (let i = 0; i < node.lines.length; i++) {
        node.lines[i].x1 = node.rect.x;
        node.lines[i].y1 = node.rect.y;
        node.lines[i].x2 += fixedPolygonPosition.value.spaceX;
        node.lines[i].y2 += fixedPolygonPosition.value.spaceY;
        if (node.lines[i].x2 !== node.circles[i].x + fixedPolygonPosition.value.spaceX) node.circles[i].x = node.lines[i].x2;
        if (node.lines[i].y2 !== node.circles[i].y + fixedPolygonPosition.value.spaceY) node.circles[i].y = node.lines[i].y2;
      }
    }
  });

  polygon.value.segments.forEach((s, i) => {
    if (i === polygon.value.segments?.length - 1) {
      s.start.x += fixedPolygonPosition.value.spaceX;
      s.start.y += fixedPolygonPosition.value.spaceY;
    } else {
      s.start.x += fixedPolygonPosition.value.spaceX;
      s.start.y += fixedPolygonPosition.value.spaceY;

      s.end.x += fixedPolygonPosition.value.spaceX;
      s.end.y += fixedPolygonPosition.value.spaceY;
    }
    if (
        s.start.x === s.controlPoint1.x &&
        s.start.y === s.controlPoint1.y &&
        s.end.x === s.controlPoint2.x &&
        s.end.y === s.controlPoint2.y
    ) {
      s.controlPoint1 = s.start;
      s.controlPoint2 = s.end;
    } else if (
        s.start.x === s.controlPoint1.x &&
        s.start.y === s.controlPoint1.y
    ) {
      s.controlPoint1 = s.start;
      s.controlPoint2.x += fixedPolygonPosition.value.spaceX;
      s.controlPoint2.y += fixedPolygonPosition.value.spaceY;
    } else if (s.end.x === s.controlPoint2.x && s.end.y === s.controlPoint2.y) {
      s.controlPoint2 = s.end;
      s.controlPoint1.x += fixedPolygonPosition.value.spaceX;
      s.controlPoint1.y += fixedPolygonPosition.value.spaceY;
    } else {
      // Curves
      s.controlPoint1.x += fixedPolygonPosition.value.spaceX;
      s.controlPoint1.y += fixedPolygonPosition.value.spaceY;
      s.controlPoint2.x += fixedPolygonPosition.value.spaceX;
      s.controlPoint2.y += fixedPolygonPosition.value.spaceY;
    }
  });

  fixedPolygonPosition.value.spaceX = 0;
  fixedPolygonPosition.value.spaceY = 0;

  polygon.value.nodes.forEach((node) => {
    if (!node.lines || !node.lines[0]) return;
    if (node.rect.x !== node.lines[0].x1) node.rect.x = node.lines[0].x1;
    if (node.rect.y !== node.lines[0].y1) node.rect.y = node.lines[0].y1;
  });
  const polygonElement: HTMLElement = document.getElementById(
      `polygon-${targetPolygonIndex.value}`,
  );
  const boundingBox: HTMLElement = document.getElementById('bounding-box')
  if (!(polygonElement && boundingBox)) return;
  polygonElement.style.transform = "translate(0px, 0px)";
  boundingBox.style.transform = "translate(0px, 0px)";
};
const updateAutoPosition = () => {
  if (!fixedPolygonPosition.value.spaceX && !fixedPolygonPosition.value.spaceY || !polygon.value) return;
  isMoveAPolygon.value = false;
  fixedPolygonPosition.value.x = 0;
  fixedPolygonPosition.value.y = 0;
  polygon.value.nodes.forEach((node) => {
    node.rect.x += fixedPolygonPosition.value.spaceX;
    node.rect.y += fixedPolygonPosition.value.spaceY;
    if (node.lines.length && node.circles.length) {
      for (let i = 0; i < node.lines.length; i++) {
        node.lines[i].x1 = node.rect.x;
        node.lines[i].y1 = node.rect.y;
        node.lines[i].x2 += fixedPolygonPosition.value.spaceX;
        node.lines[i].y2 += fixedPolygonPosition.value.spaceY;
        node.circles[i].x = node.lines[i].x2;
        node.circles[i].y = node.lines[i].y2;
      }
    }
  });

  polygon.value.segments.forEach((s, i) => {
    if (i === polygon.value.segments?.length - 1) {
      s.start.x += fixedPolygonPosition.value.spaceX;
      s.start.y += fixedPolygonPosition.value.spaceY;

      s.end.x += fixedPolygonPosition.value.spaceX;
      s.end.y += fixedPolygonPosition.value.spaceY;
    } else {
      s.start.x += fixedPolygonPosition.value.spaceX;
      s.start.y += fixedPolygonPosition.value.spaceY;

      s.end.x += fixedPolygonPosition.value.spaceX;
      s.end.y += fixedPolygonPosition.value.spaceY;
    }
    if (
        s.start.x === s.controlPoint1.x &&
        s.start.y === s.controlPoint1.y &&
        s.end.x === s.controlPoint2.x &&
        s.end.y === s.controlPoint2.y
    ) {
      s.controlPoint1 = s.start;
      s.controlPoint2 = s.end;
    } else if (
        s.start.x === s.controlPoint1.x &&
        s.start.y === s.controlPoint1.y
    ) {
      s.controlPoint1 = s.start;
      s.controlPoint2.x += fixedPolygonPosition.value.spaceX;
      s.controlPoint2.y += fixedPolygonPosition.value.spaceY;
    } else if (s.end.x === s.controlPoint2.x && s.end.y === s.controlPoint2.y) {
      s.controlPoint2 = s.end;
      s.controlPoint1.x += fixedPolygonPosition.value.spaceX;
      s.controlPoint1.y += fixedPolygonPosition.value.spaceY;
    } else {
      // Curves
      s.controlPoint1.x += fixedPolygonPosition.value.spaceX;
      s.controlPoint1.y += fixedPolygonPosition.value.spaceY;
      s.controlPoint2.x += fixedPolygonPosition.value.spaceX;
      s.controlPoint2.y += fixedPolygonPosition.value.spaceY;
    }
  });

  fixedPolygonPosition.value.spaceX = 0;
  fixedPolygonPosition.value.spaceY = 0;

  polygon.value.nodes.forEach((node) => {
    if (!node.lines || !node.lines[0]) return;
    if (node.rect.x !== node.lines[0].x1) node.rect.x = node.lines[0].x1;
    if (node.rect.y !== node.lines[0].y1) node.rect.y = node.lines[0].y1;
  });
  const polygonElement: HTMLElement = document.getElementById(
      `polygon-${targetPolygonIndex.value}`,
  );
  const boundingBox: HTMLElement = document.getElementById('bounding-box')
  if (!(polygonElement && boundingBox)) return;
  polygonElement.style.transform = "translate(0px, 0px)";
  boundingBox.style.transform = "translate(0px, 0px)";
};
const moveAController = (e: MouseEvent) => {
  const newPosition = {
    x: e.offsetX,
    y: e.offsetY,
  };
  const nodes = polygon.value.nodes
  const segments = polygon.value.segments
  const numberController = nodes[nodeIndex.value].lines.length
  if (editOneController.value) nodes[nodeIndex.value].isZigzag = true
  if (
      nodes[nodeIndex.value].lines &&
      nodes[nodeIndex.value].lines.length &&
      nodes[nodeIndex.value].circles &&
      nodes[nodeIndex.value].circles.length
  ) {
    // Opposite control point
    const oppositeCircleIndex = !circleIndex.value ? 1 : 0;

    const isLeftToRight = newPosition.x > nodes[nodeIndex.value].circles[circleIndex.value].x;
    const isTopToBottom = newPosition.y > nodes[nodeIndex.value].circles[circleIndex.value].y;

    const space = {
      x: Math.abs(nodes[nodeIndex.value].circles[circleIndex.value].x - newPosition.x),
      y: Math.abs(nodes[nodeIndex.value].circles[circleIndex.value].y - newPosition.y),
    };
    let newOppositePosition: CommonModule.Point = {x: 0, y: 0};
    if (numberController > 1) {
      newOppositePosition.x = isLeftToRight ? nodes[nodeIndex.value].circles[oppositeCircleIndex].x - space.x
          : nodes[nodeIndex.value].circles[oppositeCircleIndex].x + space.x;
      newOppositePosition.y = isTopToBottom ? nodes[nodeIndex.value].circles[oppositeCircleIndex].y - space.y
          : nodes[nodeIndex.value].circles[oppositeCircleIndex].y + space.y;
    }

    // Target control point
    nodes[nodeIndex.value].circles[circleIndex.value] = newPosition;
    nodes[nodeIndex.value].lines[circleIndex.value].x2 = newPosition.x;
    nodes[nodeIndex.value].lines[circleIndex.value].y2 = newPosition.y;

    // Opposite control point
    if (!nodes[nodeIndex.value].isZigzag && numberController > 1) {
      nodes[nodeIndex.value].circles[oppositeCircleIndex] = newOppositePosition;
      nodes[nodeIndex.value].lines[oppositeCircleIndex].x2 = newOppositePosition.x;
      nodes[nodeIndex.value].lines[oppositeCircleIndex].y2 = newOppositePosition.y;
    }

    if (!nodes[nodeIndex.value].isZigzag) {
      if (nodeIndex.value > 0) {
        segments[nodeIndex.value - 1].controlPoint2 = circleIndex.value ? newPosition : newOppositePosition;
        segments[nodeIndex.value].controlPoint1 = circleIndex.value ? newOppositePosition : newPosition;
      } else if (nodeIndex.value > 0) {
        segments[nodeIndex.value - 1].controlPoint2 = circleIndex.value ? newPosition : newOppositePosition;
        segments[nodeIndex.value].controlPoint1 = circleIndex.value ? newOppositePosition : newPosition;
      } else {
        segments[0].controlPoint1 = circleIndex.value ? newOppositePosition : newPosition;
        if (numberController > 1) segments[segments?.length - 1].controlPoint2 = circleIndex.value ? newPosition : newOppositePosition;
      }
    } else {
      if (nodeIndex.value > 0) {
        if (circleIndex.value) segments[nodeIndex.value - 1].controlPoint2 = circleIndex.value ? newPosition : newOppositePosition;
        if (!circleIndex.value) segments[nodeIndex.value].controlPoint1 = circleIndex.value ? newOppositePosition : newPosition;
      } else if (nodeIndex.value > 0) {
        segments[nodeIndex.value - 1].controlPoint2 = circleIndex.value ? newPosition : newOppositePosition;
        segments[nodeIndex.value].controlPoint1 = circleIndex.value ? newOppositePosition : newPosition;
      } else {
        if (!circleIndex.value) segments[0].controlPoint1 = circleIndex.value ? newOppositePosition : newPosition;
        if (numberController > 1 && circleIndex.value) segments[segments?.length - 1].controlPoint2 = circleIndex.value ? newPosition : newOppositePosition;
      }
    }
  }
};
const moveAPolygon = async (e: any) => {
  const polygonElement: HTMLElement = document.getElementById(
      `polygon-${targetPolygonIndex.value}`,
  );
  if (!polygonElement.contains(e.target)) {
    await handleMouseUp()
    isReCalcBoundingBox.value = true
    return
  }
  fixedPolygonPosition.value.spaceX = 0;
  fixedPolygonPosition.value.spaceY = 0;
  let pointerPosition: CommonModule.Point = {
    x: e.offsetX,
    y: e.offsetY,
  };
  const workspaceElement = document.getElementById('workspace')
  if (!workspaceElement) return;
  const workspacePosition = workspaceElement.getBoundingClientRect()

  const limits: CommonModule.Limit = {
    minX: getMinMaxValue(boundingBox.value.handlers, true, "", "x") * -1,
    maxX: (workspacePosition.right - workspacePosition.left - a / 2) - getMinMaxValue(boundingBox.value.handlers, false, "", "x"),
    minY: getMinMaxValue(boundingBox.value.handlers, true, "", "y") * -1,
    maxY: (workspacePosition.bottom - workspacePosition.top - b / 2) - getMinMaxValue(boundingBox.value.handlers, false, "", "y")
  }
  const toLeft = pointerPosition.x - fixedPolygonPosition.value.x < 0
  const toTop = pointerPosition.y - fixedPolygonPosition.value.y < 0
  if (fixedPolygonPosition.value.x) fixedPolygonPosition.value.spaceX = toLeft ? Math.max(pointerPosition.x - fixedPolygonPosition.value.x, limits.minX) : Math.min(pointerPosition.x - fixedPolygonPosition.value.x, limits.maxX)
  if (fixedPolygonPosition.value.y) fixedPolygonPosition.value.spaceY = toTop ? Math.max(pointerPosition.y - fixedPolygonPosition.value.y, limits.minY) : Math.min(pointerPosition.y - fixedPolygonPosition.value.y, limits.maxY)

  if (!fixedPolygonPosition.value.x) fixedPolygonPosition.value.x = pointerPosition.x;
  if (!fixedPolygonPosition.value.y) fixedPolygonPosition.value.y = pointerPosition.y;

  if (!fixedPolygonPosition.value.spaceX && !fixedPolygonPosition.value.spaceY) return;
  const polygon: HTMLElement = document.getElementById(`polygon-${targetPolygonIndex.value}`);
  const boundingBoxEl: HTMLElement = document.getElementById('bounding-box')
  if (!(polygon && boundingBoxEl)) return;
  polygon.style.transform = `translate(${fixedPolygonPosition.value.spaceX}px, ${fixedPolygonPosition.value.spaceY}px)`;
  boundingBoxEl.style.transform = `translate(${fixedPolygonPosition.value.spaceX}px, ${fixedPolygonPosition.value.spaceY}px)`;
};
const pointToString = (nodes) => {
  return nodes.map((point) => `${point.rect.x},${point.rect.y}`).join(" ");
};
</script>