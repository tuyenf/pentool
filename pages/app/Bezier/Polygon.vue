<template>
  <g v-for="(polygon, i) in polygons"
      class="polygon"
     :id="`polygon-${i}`"
     :class="{
            isSelected: targetPolygonIndex === i,
            isMoving: targetPolygonIndex === i && isMoveAPolygon,
          }"
     @mousedown="handleMouseDownPolygon"
     @click="activePolygon(i)"
  >
    <defs>
      <template v-if="polygon.colors.fill.isGradient && polygon.colors.fill.type === GRADIENT_TYPE.LINEAR">
        <linearGradient  :id="`background-${i}`"
                         :x1="getPosition(polygon, 'x1')" :y1="getPosition(polygon, 'y1')" :x2="getPosition(polygon, 'x2')" :y2="getPosition(polygon, 'y2')"
                         gradientUnits="userSpaceOnUse"
                         class="gradient">
          <stop v-for="(color, idx) in polygon.colors.fill.points"
                :key="idx"
                :offset="`${color.left}%`"
                :stop-color="`rgba(${color.red}, ${color.green}, ${color.blue}, ${color.alpha})`">
          </stop>
        </linearGradient>
      </template>
      <template v-else>
        <radialGradient cx="50%" cy="50%" r="100%" fx="50%" fy="50%"
                         :id="`background-${i}`"
                         class="gradient">
          <stop v-for="(color, idx) in polygon.colors.fill.points"
                :key="idx"
                :offset="`${color.left}%`"
                :stop-color="`rgba(${color.red}, ${color.green}, ${color.blue}, ${color.alpha})`">
          </stop>
        </radialGradient>
      </template>
      <template v-if="polygon.colors.stroke.isGradient && polygon.colors.stroke.type === GRADIENT_TYPE.LINEAR">
        <linearGradient  :id="`stroke-${i}`"
                         :x1="getPosition(polygon, 'x1')" :y1="getPosition(polygon, 'y1')" :x2="getPosition(polygon, 'x2')" :y2="getPosition(polygon, 'y2')"
                         :gradientTransform="`rotate(${polygon.colors.stroke.degree})`"
                         gradientUnits="userSpaceOnUse"
                         class="gradient">
          <stop v-for="(color, idx) in polygon.colors.stroke.points"
                :key="idx"
                :offset="`${color.left}%`"
                :stop-color="`rgba(${color.red}, ${color.green}, ${color.blue}, ${color.alpha})`">
          </stop>
        </linearGradient>
      </template>
      <template v-else>
        <radialGradient  cx="50%" cy="50%" r="100%" fx="50%" fy="50%"
                         :id="`stroke-${i}`"
                         class="gradient">
          <stop v-for="(color, idx) in polygon.colors.stroke.points"
                :key="idx"
                :offset="`${color.left}%`"
                :stop-color="`rgba(${color.red}, ${color.green}, ${color.blue}, ${color.alpha})`">
          </stop>
        </radialGradient>
      </template>
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
          fill="none"
          stroke="url(#decorationAbsolute)"
    ></path>
    <g :id="`segments-${i}`">
      <path class="pathVirtual"
          v-for="(segment, index) in polygon.segments"
          :key="index"
          :d="`M ${segment.start.x} ${segment.start.y}
                        C ${segment.controlPoint1.x} ${segment.controlPoint1.y} ${segment.controlPoint2.x}
                        ${segment.controlPoint2.y} ${segment.end.x} ${segment.end.y}`"
          :id="`segment-${i}-${index}`"
          style="opacity: 1"
          fill="none"
          :stroke="[targetPolygonIndex === i ? '#4e7fff' : 'none']"
      ></path>
      <path v-if="polygon.path"
            :d="polygon.path"
            :fill="[polygon.colors.fill.isGradient ? `url(#background-${i})` : polygon.colors.fill.style]"
            :stroke="[polygon.colors.stroke.isGradient ? `url(#stroke-${i})` : polygon.colors.stroke.style]"
            style="opacity: 1"></path>
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
            :class="{ hide: checkIsShowEditor(i, index, false, li)}"
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
                  hide: checkIsShowEditor(i, index, false, ci),
                  isEditing: onDirectSelectionTool,
                }"
            style="opacity: 1"
            fill="#4E7FFF"
        ></circle>
        <rect @click.self="isActiveNode = true"
            @mousedown.self="handleMouseDownNode($event, i, index)"
            :x="node.rect.x - r"
            :y="node.rect.y - r"
            :width="a"
            :height="b"
            :class="{
                  hide: checkIsShowEditor(i, index, true),
                  isEditing: onDirectSelectionTool,
                }"
            fill="#4E7FFF"
        ></rect>
      </g>
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
                       :isHideEditor="isHideEditor"
                       v-model:isResizing="isResizing"
                       @update:boundingBox="(newVal) => boundingBox = newVal"
  />
  <!--END BOUNDING BOX-->
</template>
<script lang="ts" setup>
import BezierBoundingBox from "~/pages/app/Bezier/BoundingBox.vue"
import {MaybeElementRef, onClickOutside, useKeyModifier} from "@vueuse/core";
import {GRADIENT_TYPE, KEY_BOARD} from "~/lib/utils/contants";
import {bezierMinMax, getMinMaxValue} from "~/lib/utils/global";
import {CommonModule} from "~/lib/types/common";

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
  isStageMove?: boolean
  targetPoint?: number
}
interface IEmits {
  (e: 'update:polygons', value: CommonModule.Polygon[]): void
  (e: 'update:polygon', value: CommonModule.Polygon): void
  (e: 'update:targetPolygonIndex', value: number): void
  (e: 'update:isDrawingSpeechBubble', value: boolean): void
  (e: 'update:isResetBoundingBox', value: boolean): void
  (e: 'update:isStageMove', value: boolean): void
  (e: 'update:targetPoint', value: number): void
}
const emits = defineEmits<IEmits>()
const props = defineProps<IProps>()
const targetPolygonIndex = useVModel(props, 'targetPolygonIndex', emits)
const isResetBoundingBox = useVModel(props, 'isResetBoundingBox', emits)
const isStageMove = useVModel(props, 'isStageMove', emits)
const targetPoint = useVModel(props, 'targetPoint', emits)
const polygon = useVModel(props, 'polygon', emits)
const polygons = useVModel(props, 'polygons', emits)
const boundingBox = ref<CommonModule.BoundingBox>({
  handlers: [],
  segments: [],
});

const r = 3;
const a = 6;
const b = 6;

const nodeIndex = ref(0);
const circleIndex = ref(0);

const isMoveAPolygon = ref<boolean>(false);
const isMoveAnAnchorPoint = ref<boolean>(false);
const isMoveAController = ref<boolean>(false);
const isHideEditor = ref<boolean>(false)
const editOneController = ref<boolean>(false);

const isReCalcBoundingBox = ref<boolean>(false);
const isActiveNode = ref<boolean>(false);
const activeRect = ref<number>(-1)
const tempActiveRect = ref<number>(-1)
const mouseDownEvent = ref(null);
const mousePressEvent = ref(null);
const isMousePress = ref<boolean>(false);
const isResizing = ref<boolean>(false);
const fixedPolygonPosition = ref({
  x: 0,
  y: 0,
  spaceX: 0,
  spaceY: 0,
});
const isAlt = useKeyModifier(KEY_BOARD.ALT)

onMounted(() => {
  nextTick(() => {
    const svg = document.getElementById('workspace')
    if (svg) svg.addEventListener('mouseup', handleMouseUp)
  })
})
onUpdated(() => {
  const polygon = document.querySelectorAll('.polygon')
  if (!polygon) return
  _forEach(polygon, p => {
    onClickOutside(p, (event: MouseEvent) => {
      if (!props.onDirectSelectionTool && !props.onSelectionTool) return
      const resetVal = _debounce( () => isResizing.value = false, 500)
      if (isResizing.value) {
        resetVal()
        return;
      }
      isActiveNode.value = false
      isHideEditor.value = true
    })
  })
})
const getPosition = (polygon: CommonModule.Polygon, axis: string = 'x1') => {
  let points: CommonModule.MinMax[] = [];
  _forEach(polygon.segments, (segment) => {
    points.push(bezierMinMax(
            segment.start.x,
            segment.start.y,
            segment.controlPoint1.x,
            segment.controlPoint1.y,
            segment.controlPoint2.x,
            segment.controlPoint2.y,
            segment.end.x,
            segment.end.y,
        ),
    );
  });

  if (axis === 'y1') {
    return getMinMaxValue(points, true, "min", "y");
  } else if (axis === 'x2') {
    return getMinMaxValue(points, false, "max", "x");
  } else if (axis === 'y2') {
    return getMinMaxValue(points, false, "max", "y");
  } else {
    return getMinMaxValue(points, true, "min", "x");
  }
}
const checkIsShowEditor = (id: number, i: number, isRect: boolean = false, index?: number) => {
  let targetRect: number = targetPoint.value ?? 0

  if (!props.onPenTool) {
    if (tempActiveRect.value >= 0) targetRect = tempActiveRect.value
    else if (activeRect.value >= 0) targetRect = activeRect.value
  }

  const totalNodes = polygon.value && polygon.value.nodes.length || 0
  if (!totalNodes) return true
  if (id !== targetPolygonIndex.value || !(props.onPenTool || props.onDirectSelectionTool) || isHideEditor.value) return true
  if (props.onDirectSelectionTool && !isActiveNode.value) return !isRect
  if (isRect) return (isStageMove.value && targetRect === 0 && (i !== 1 && i !== 0 && i !== totalNodes - 1)) || (isStageMove.value && targetRect !== 0 && i !== targetRect && i !== targetRect - 1) || id !== targetPolygonIndex.value || !(props.onPenTool || props.onDirectSelectionTool) || isHideEditor.value

  if (targetRect === 0 && totalNodes > 1) {
    return (i !== 1 && i !== totalNodes - 1 && i !== 0) || (totalNodes > 2 && (i === 1 && index !== 1)) || (i === totalNodes - 1 && index !== 0)
  } else if (targetRect === totalNodes - 1 && i === 0) {
    return totalNodes <=2 && targetRect !== 0 ? index !== 0 : targetRect === 1 ? i !== 0 : targetRect > 0 ? index === 0 : targetRect !== i
  } else if (i === targetRect - 1 || (isActiveNode.value && i === targetRect + 1)) {
    return isActiveNode.value && (i === targetRect + 1) ? index === 0 : index === 1
  } else if (i === targetRect) {
    return false
  }
  return true
}
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
  isStageMove.value = false
  tempActiveRect.value = -1

  updateNewPosition();
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
  mousePressEvent.value = _delay(() => {
    isMousePress.value = true;
    document.addEventListener("mousemove", moveAPolygon);
  }, 150, 'later');
};
const activePolygon = (i: number) => {
  if (!props.onSelectionTool && !props.onDirectSelectionTool) return;
  isHideEditor.value = false
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
  tempActiveRect.value = nodeId
  if (!props.onDirectSelectionTool || targetPolygonIndex.value == null) return;
  nodeIndex.value = nodeId;
  targetPoint.value = nodeId
  targetPolygonIndex.value = polygonId;
  circleIndex.value = circleId;
  mouseDownEvent.value = _delay(() => {
    isMousePress.value = true;
    isMoveAController.value = true;
    document.addEventListener("mousemove", moveAController);
  }, 100, 'later');
};
const handleMouseDownNode = (event: MouseEvent, polygonId: number, nodeId: number) => {
  activeRect.value = nodeId
  if (!props.onDirectSelectionTool) return;
  nodeIndex.value = nodeId;
  targetPolygonIndex.value = polygonId;
  mouseDownEvent.value = _delay(() => {
    isMousePress.value = true;
    isMoveAnAnchorPoint.value = true;
    document.addEventListener("mousemove", moveAnAnchorPoint);
  }, 150, 'later');
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
  _forEach(polygon.value.nodes, (node) => {
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

  _forEach(polygon.value.segments, (s, i) => {
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

  _forEach(polygon.value.nodes, (node) => {
    if (!node.lines || !node.lines[0]) return;
    if (node.rect.x !== node.lines[0].x1) node.rect.x = node.lines[0].x1;
    if (node.rect.y !== node.lines[0].y1) node.rect.y = node.lines[0].y1;
  });
  const polygonElement: HTMLElement | null = document.getElementById(
      `polygon-${targetPolygonIndex.value}`,
  );
  const boundingBox: HTMLElement | null = document.getElementById('bounding-box')
  if (!(polygonElement && boundingBox)) return;
  polygonElement.style.transform = "translate(0px, 0px)";
  boundingBox.style.transform = "translate(0px, 0px)";
};
const moveAController = (e: MouseEvent) => {
  isStageMove.value = true
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
  const polygonElement: HTMLElement | null = document.getElementById(
      `polygon-${targetPolygonIndex.value}`,
  );
  if (!polygonElement) return

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
  const polygon: HTMLElement | null = document.getElementById(`polygon-${targetPolygonIndex.value}`);
  const boundingBoxEl: HTMLElement | null = document.getElementById('bounding-box')
  if (!(polygon && boundingBoxEl)) return;
  polygon.style.transform = `translate(${fixedPolygonPosition.value.spaceX}px, ${fixedPolygonPosition.value.spaceY}px)`;
  boundingBoxEl.style.transform = `translate(${fixedPolygonPosition.value.spaceX}px, ${fixedPolygonPosition.value.spaceY}px)`;
};

watch(() => props.onPenTool, (val) => {
  if (val) {
    isHideEditor.value = false
  }
})
watch(polygon, (val) => {
  if (val) {
    let path: string = ''
    _forEach(val.segments, (segment: CommonModule.Segment, i) => {
      if (i > 0) {
        path+=` L ${segment.start.x} ${segment.start.y} C ${segment.controlPoint1.x} ${segment.controlPoint1.y} ${segment.controlPoint2.x} ${segment.controlPoint2.y} ${segment.end.x} ${segment.end.y}`
      } else {
        path+=`M ${segment.start.x} ${segment.start.y} C ${segment.controlPoint1.x} ${segment.controlPoint1.y} ${segment.controlPoint2.x} ${segment.controlPoint2.y} ${segment.end.x} ${segment.end.y}`
      }
    })
    if (!path) return
    polygon.value.path = path
  }
}, {deep: true})
</script>