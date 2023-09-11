<template>
  <g
      id="bounding-box"
      ref="boundingElement"
      v-if="
            boundingBox.handlers.length &&
            boundingBox.segments.length &&
            onSelectionTool && targetPolygonIndex >= 0
          "
  >
    <rect
        v-for="(rect, i) in boundingBox.handlers"
        @mousedown="handleMouseDownBoundingBox($event, i)"
        :key="i"
        :x="rect.x - r"
        :y="rect.y - r"
        :width="a"
        :height="b"
        :class="{
              'ns-resize': [1, 5].includes(i),
              'ew-resize': [3, 7].includes(i),
              'nesw-resize': [2, 6].includes(i),
              'nwse-resize': [0, 4].includes(i),
            }"
        stroke-width="1"
        stroke="#4E7FFF"
        fill="#FFFFFF"
    ></rect>
    <path
        v-for="(segment, index) in boundingBox.segments"
        :key="index"
        :d="`M ${segment.start.x} ${segment.start.y}
                        C ${segment.start.x} ${segment.start.y} ${segment.end.x}
                        ${segment.end.y} ${segment.end.x} ${segment.end.y}`"
        :id="`bounding-segment-${index}`"
        style="opacity: 1"
        stroke="#4E7FFF"
    ></path>
  </g>
</template>
<script lang="ts" setup>
import {getMinMaxValue, bezierMinMax} from "~/lib/utils/global";
interface IProps {
  targetPolygonIndex?: number | null,
  polygons?: CommonModule.Polygon[],
  polygon?: CommonModule.Polygon,
  onPenTool: boolean,
  onSelectionTool: boolean,
  onDirectSelectionTool: boolean,
  onDrawSpeechBubble: boolean,
  isReCalcBoundingBox: boolean,
  isDrawingSpeechBubble: boolean,
  isResetBoundingBox: boolean,
}
interface IEmits {
  (e: 'update:targetPolygonIndex', value: number | null): void
  (e: 'update:polygons', value: CommonModule.Polygon[]): void
  (e: 'update:polygon', value: CommonModule.Polygon): void
  (e: 'update:isDrawingSpeechBubble', value: boolean): void
  (e: 'update:isResetBoundingBox', value: boolean): void
  (e: 'update:boundingBox', value: CommonModule.BoundingBox): void
}
const emits = defineEmits<IEmits>()
const props = defineProps<IProps>()
const targetPolygonIndex = useVModel(props, 'targetPolygonIndex', emits)
const isResetBoundingBox = useVModel(props, 'isResetBoundingBox', emits)
const polygons = useVModel(props, 'polygons', emits)
const polygon = useVModel(props, 'polygon', emits)

const r = 4;
const a = 8;
const b = 8;

const handlerIndex = ref<number | null>();

const isMousePress = ref<boolean>(false);
const mouseDownEvent = ref(null);
const mousePressEvent = ref(null);

const isMoveAPolygon = ref<boolean>(false);

const boundingBox = ref<CommonModule.BoundingBox>({
  handlers: [],
  segments: [],
});
const boundingElement = ref(null);
const fixedPolygonPosition = ref({
  x: 0,
  y: 0,
  spaceX: 0,
  spaceY: 0,
});
const movementLimit = ref<CommonModule.MovementLimit>()
/*
 * Hooks */
onMounted(() => {
  nextTick(() => {
    document.addEventListener('mouseup', handleMouseUp)
  })
})
/*
 * Methods */
const handleMouseUp = () => {
  document.removeEventListener("mousemove", resizeBoundingBox);
  clearTimeout(mouseDownEvent.value);
  clearTimeout(mousePressEvent.value);
  isMousePress.value = false;
  handlerIndex.value = null;
};
const handleMouseDownBoundingBox = (event: MouseEvent, handlerId: number) => {
  if (!props.onSelectionTool) return;
  handlerIndex.value = handlerId;
  mouseDownEvent.value = setTimeout(() => {
    isMousePress.value = true;
    document.addEventListener("mousemove", resizeBoundingBox);
  }, 150);
};

/* Drawing
* */
const createBoundingBox = () => {
  let points: CommonModule.MinMax[] = [];
  boundingBox.value.handlers = [];
  polygon.value.segments.forEach((segment) => {
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
  const minX = getMinMaxValue(points, true, "min", "x");
  const maxX = getMinMaxValue(points, false, "max", "x");
  const minY = getMinMaxValue(points, true, "min", "y");
  const maxY = getMinMaxValue(points, false, "max", "y");

  const middleX = maxX - (maxX - minX) / 2;
  const middleY = maxY - (maxY - minY) / 2;
  boundingBox.value.handlers = [
    {x: minX, y: minY},
    {x: middleX, y: minY},
    {x: maxX, y: minY},
    {x: maxX, y: middleY},
    {x: maxX, y: maxY},
    {x: middleX, y: maxY},
    {x: minX, y: maxY},
    {x: minX, y: middleY},
  ];
}
const calcSegmentBoudingBox = () => {
  boundingBox.value.segments = [];
  for (let i = 0; i < 8; i++) {
    boundingBox.value.segments.push({
      start: {
        x: [0, 1].includes(i) ? boundingBox.value.handlers[i].x + r
            : [4, 5].includes(i)
                ? boundingBox.value.handlers[i].x - r
                : boundingBox.value.handlers[i].x,
        y: [2, 3].includes(i)
            ? boundingBox.value.handlers[i].y + r
            : [6, 7].includes(i)
                ? boundingBox.value.handlers[i].y - r
                : boundingBox.value.handlers[i].y,
      },
      end: {
        x:
            i === 7
                ? boundingBox.value.handlers[0].x
                : [0, 1].includes(i)
                    ? boundingBox.value.handlers[i + 1].x - r
                    : [4, 5].includes(i)
                        ? boundingBox.value.handlers[i + 1].x + r
                        : boundingBox.value.handlers[i + 1].x,
        y:
            i === 7
                ? boundingBox.value.handlers[0].y + r
                : i === 6
                    ? boundingBox.value.handlers[i + 1].y + r
                    : [2, 3].includes(i)
                        ? boundingBox.value.handlers[i + 1].y - r
                        : boundingBox.value.handlers[i + 1].y,
      },
    });
  }
};
const resizeBoundingBox = (e: any) => {
  isMoveAPolygon.value = false;
  const workspaceEl: HTMLElement = document.getElementById('workspace')
  if (!workspaceEl) return
  const workspacePosition = workspaceEl.getBoundingClientRect()
  const limits: CommonModule.Limit = {
    minX: 0,
    maxX: workspacePosition.right - workspacePosition.left - a / 2,
    minY: 0,
    maxY: workspacePosition.bottom - workspacePosition.top - b / 2
  }
  const newPosition: CommonModule.Point = {
    x: Math.max(limits.minX, Math.min(e.clientX || e.offsetX, limits.maxX)),
    y: Math.max(limits.minY, Math.min(e.clientY || e.offsetY, limits.maxY)),
  };
  let spaceX = handlerIndex.value > 0
      ? (newPosition.x - boundingBox.value.handlers[handlerIndex.value - 1].x) / 2
      : 0;
  let spaceY = handlerIndex.value > 0
      ? (newPosition.y - boundingBox.value.handlers[handlerIndex.value - 1].y) / 2
      : 0;

  const handlers = boundingBox.value.handlers
  switch (handlerIndex.value) {
    case 1:
      spaceX = 0;
      handlers[handlerIndex.value].y = newPosition.y;
      handlers[handlerIndex.value - 1].y = newPosition.y;
      handlers[handlerIndex.value + 1].y = newPosition.y;
      handlers[handlerIndex.value + 2].y = handlers[handlerIndex.value + 2].y + spaceY;
      handlers[7].y = handlers[7].y + spaceY;
      break;
    case 5:
      spaceX = 0;
      handlers[handlerIndex.value].y = newPosition.y;
      handlers[handlerIndex.value - 1].y = newPosition.y;
      handlers[handlerIndex.value + 1].y = newPosition.y;
      handlers[handlerIndex.value - 2].y = handlers[handlerIndex.value - 2].y + spaceY;
      handlers[handlerIndex.value + 2].y = handlers[handlerIndex.value + 2].y + spaceY;
      break;
    case 3:
      spaceY = 0;
      handlers[handlerIndex.value].x = newPosition.x;
      handlers[handlerIndex.value - 1].x = newPosition.x;
      handlers[handlerIndex.value + 1].x = newPosition.x;
      handlers[handlerIndex.value - 2].x = handlers[handlerIndex.value - 2].x + spaceX;
      handlers[handlerIndex.value + 2].x = handlers[handlerIndex.value + 2].x + spaceX;
      break;
    case 7:
      spaceY = 0;
      handlers[handlerIndex.value].x = newPosition.x;
      handlers[handlerIndex.value - 1].x = newPosition.x;
      handlers[0].x = newPosition.x;
      handlers[handlerIndex.value - 2].x = handlers[handlerIndex.value - 2].x + spaceX;
      handlers[1].x = handlers[1].x + spaceX;
      break;
    case 2:
      spaceX = newPosition.x - handlers[handlerIndex.value].x;
      spaceY = newPosition.y - handlers[handlerIndex.value].y;
      handlers[handlerIndex.value] = newPosition;
      handlers[handlerIndex.value - 1].x = handlers[handlerIndex.value - 1].x + spaceX / 2;
      handlers[handlerIndex.value - 1].y = handlers[handlerIndex.value - 1].y + spaceY;
      handlers[handlerIndex.value - 2].y = handlers[handlerIndex.value - 2].y + spaceY;
      handlers[7].y = handlers[7].y + spaceY / 2;
      handlers[handlerIndex.value + 1].x = handlers[handlerIndex.value + 1].x + spaceX;
      handlers[handlerIndex.value + 1].y = handlers[handlerIndex.value + 1].y + spaceY / 2;
      handlers[handlerIndex.value + 2].x = handlers[handlerIndex.value + 2].x + spaceX;
      handlers[handlerIndex.value + 3].x = handlers[handlerIndex.value + 3].x + spaceX / 2;
      break;
    case 4:
      spaceX = newPosition.x - handlers[handlerIndex.value].x;
      spaceY = newPosition.y - handlers[handlerIndex.value].y;
      handlers[handlerIndex.value] = newPosition;
      handlers[handlerIndex.value - 1].x = handlers[handlerIndex.value - 1].x + spaceX;
      handlers[handlerIndex.value - 1].y = handlers[handlerIndex.value - 1].y + spaceY / 2;
      handlers[handlerIndex.value - 2].x = handlers[handlerIndex.value - 2].x + spaceX;
      handlers[handlerIndex.value - 3].x = handlers[handlerIndex.value - 3].x + spaceX / 2;
      handlers[handlerIndex.value + 1].x = handlers[handlerIndex.value + 1].x + spaceX / 2;
      handlers[handlerIndex.value + 1].y = handlers[handlerIndex.value + 1].y + spaceY;
      handlers[handlerIndex.value + 2].y = handlers[handlerIndex.value + 2].y + spaceY;
      handlers[handlerIndex.value + 3].y = handlers[handlerIndex.value + 3].y + spaceY / 2;
      break;
    case 6:
      spaceX = newPosition.x - handlers[handlerIndex.value].x;
      spaceY = newPosition.y - handlers[handlerIndex.value].y;
      handlers[handlerIndex.value] = newPosition;
      handlers[handlerIndex.value - 1].x = handlers[handlerIndex.value - 1].x + spaceX / 2;
      handlers[handlerIndex.value - 1].y = handlers[handlerIndex.value - 1].y + spaceY;
      handlers[handlerIndex.value - 2].y = handlers[handlerIndex.value - 2].y + spaceY;
      handlers[handlerIndex.value - 3].y = handlers[handlerIndex.value - 3].y + spaceY / 2;
      handlers[handlerIndex.value + 1].x = handlers[handlerIndex.value + 1].x + spaceX;
      handlers[handlerIndex.value + 1].y = handlers[handlerIndex.value + 1].y + spaceY / 2;
      handlers[0].x = handlers[0].x + spaceX;
      handlers[1].x = handlers[1].x + spaceX / 2;
      break;
    default:
      spaceX = newPosition.x - handlers[handlerIndex.value].x;
      spaceY = newPosition.y - handlers[handlerIndex.value].y;

      handlers[handlerIndex.value] = newPosition;
      handlers[7].x = handlers[7].x + spaceX;
      handlers[7].y = handlers[7].y + spaceY / 2;
      handlers[6].x = handlers[6].x + spaceX;
      handlers[5].x = handlers[5].x + spaceX / 2;
      handlers[handlerIndex.value + 1].x = handlers[handlerIndex.value + 1].x + spaceX / 2;
      handlers[handlerIndex.value + 1].y = handlers[handlerIndex.value + 1].y + spaceY;
      handlers[handlerIndex.value + 2].y = handlers[handlerIndex.value + 2].y + spaceY;
      handlers[handlerIndex.value + 3].y = handlers[handlerIndex.value + 3].y + spaceY / 2;
  }
  calcSegmentBoudingBox();
  const isAutoCreate = polygon.value?.isAutoCreate
  if (!(isAutoCreate && props.onDrawSpeechBubble)) resizePolygon();
  else autoResizePolygon();
};
const resizePolygon = () => {
  let points: CommonModule.MinMax[] = [];
  polygon.value.segments.forEach((segment) => {
    points.push(
        bezierMinMax(
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
  const minX = getMinMaxValue(points, true, "min", "x");
  const maxX = getMinMaxValue(points, false, "max", "x");
  const minY = getMinMaxValue(points, true, "min", "y");
  const maxY = getMinMaxValue(points, false, "max", "y");

  const minx = getMinMaxValue(boundingBox.value.handlers, true, "", "x");
  const maxx = getMinMaxValue(boundingBox.value.handlers, false, "", "x");
  const miny = getMinMaxValue(boundingBox.value.handlers, true, "", "y");
  const maxy = getMinMaxValue(boundingBox.value.handlers, false, "", "y");

  let xScale = maxX - minX !== 0 ? (maxx - minx) / (maxX - minX) : 1;
  let yScale = maxY - minY !== 0 ? (maxy - miny) / (maxY - minY) : 1;

  if (xScale === 0 || yScale === 0) return;

  // Calculate the center of the original bounding box
  const originalCenterX = (maxX + minX) / 2;
  const originalCenterY = (maxY + minY) / 2;

  // Calculate the center of the new bounding box
  const newCenterX = (maxx + minx) / 2;
  const newCenterY = (maxy + miny) / 2;

  // Translate the polygon to the center of the original bounding box
  const translatedNodes = polygon.value.nodes.map(
      (node) => {
        node.rect.x -= originalCenterX;
        node.rect.y -= originalCenterY;
        if (!node.circles) return node;
        for (let i = 0; i < node.circles.length; i++) {
          node.circles[i].x -= originalCenterX;
          node.circles[i].y -= originalCenterY;

          node.lines[i].x1 -= originalCenterX;
          node.lines[i].y1 -= originalCenterY;
          node.lines[i].x2 -= originalCenterX;
          node.lines[i].y2 -= originalCenterY;
        }
        return node;
      },
  );

  // Scale the polygon vertices
  const scaledNodes = translatedNodes.map((node) => {
    node.rect.x *= xScale;
    node.rect.y *= yScale;
    if (!node.circles) return node;
    for (let i = 0; i < node.circles.length; i++) {
      node.circles[i].x *= xScale;
      node.circles[i].y *= yScale;

      node.lines[i].x1 *= xScale;
      node.lines[i].y1 *= yScale;
      node.lines[i].x2 *= xScale;
      node.lines[i].y2 *= yScale;
    }
    return node;
  });

  // Translate the polygon back to its original position
  const fixedNodes = [].concat(polygon.value.nodes);
  polygon.value.nodes = scaledNodes.map((node, i) => {
    node.rect.x += newCenterX;
    node.rect.y += newCenterY;

    if (!node.circles) {
      updateSegments(node.rect, i, fixedNodes);
      return node;
    }
    for (let i = 0; i < node.circles.length; i++) {
      node.circles[i].x += newCenterX;
      node.circles[i].y += newCenterY;

      node.lines[i].x1 += newCenterX;
      node.lines[i].y1 += newCenterY;
      node.lines[i].x2 += newCenterX;
      node.lines[i].y2 += newCenterY;
    }
    updateSegments(node.rect, i, fixedNodes);
    return node;
  });
};
const updateSegments = (node: CommonModule.Point, nodeIndex: number, fixedNodes: Node[]) => {
  const newPosition = {x: node.x, y: node.y,};
  const segments = polygon.value.segments
  const nodes = polygon.value.nodes
  const numberController = nodes[nodeIndex].lines.length

  if (numberController) {
    const isLeftToRight = newPosition.x > nodes[nodeIndex].rect.x;
    const isTopToBottom = newPosition.y > nodes[nodeIndex].rect.y;
    const space = {
      x: Math.abs(fixedNodes[nodeIndex].rect.x - newPosition.x),
      y: Math.abs(fixedNodes[nodeIndex].rect.y - newPosition.y),
    };

    for (let i = 0; i < numberController; i++) {
      nodes[nodeIndex].lines[i].x1 = newPosition.x;
      nodes[nodeIndex].lines[i].y1 = newPosition.y;
    }

    for (let i = 0; i < numberController; i++) {
      if (isLeftToRight) nodes[nodeIndex].circles[i].x += space.x;
      else nodes[nodeIndex].circles[i].x -= space.x;
      if (isTopToBottom) nodes[nodeIndex].circles[i].y += space.y;
      else nodes[nodeIndex].circles[i].y -= space.y;
    }

    for (let i = 0; i < numberController; i++) {
      nodes[nodeIndex].lines[i].x2 = nodes[nodeIndex].circles[i].x;
      nodes[nodeIndex].lines[i].y2 = nodes[nodeIndex].circles[i].y;
    }
  } else if (nodeIndex > 0) {
    segments[nodeIndex - 1].controlPoint2 = newPosition;
    segments[nodeIndex].controlPoint1 = newPosition;
  } else {
    segments[0].controlPoint1 = newPosition;
    segments[segments?.length - 1].controlPoint2 = newPosition;
  }

  // Update segments
  if (nodeIndex > 0) {
    segments[nodeIndex - 1].end.x = newPosition.x;
    segments[nodeIndex - 1].end.y = newPosition.y;
    segments[nodeIndex].start.x = newPosition.x;
    segments[nodeIndex].start.y = newPosition.y;
  } else {
    segments[0].start = newPosition;
    segments[segments.length - 1].end = newPosition;
  }
};

const drawSpeechBubble = () => {
  if (targetPolygonIndex.value === -1) return;
  // Move polygon to new position
  const virtualRectangleElement: HTMLElement = document.getElementById('virtualRectangle')
  const workspace: HTMLElement = document.getElementById('workspace')
  if (!(virtualRectangleElement && workspace)) return
  let elVal = JSON.parse(JSON.stringify(virtualRectangleElement.getBoundingClientRect()))
  const boundingEl = JSON.parse(JSON.stringify(workspace.getBoundingClientRect()))
  if (elVal.right > boundingEl.right) {
    elVal.width -= Math.abs(elVal.right - boundingEl.right + 3)
    elVal.right = boundingEl.right
  }
  if (elVal.bottom > boundingEl.bottom) {
    elVal.height -= Math.abs(elVal.bottom - boundingEl.bottom + 3)
    elVal.bottom = boundingEl.bottom
  }
  const newCenterPoint = {
    x: elVal.left + ((elVal.right - elVal.left) / 2) - boundingEl.left,
    y: elVal.top + ((elVal.bottom - elVal.top) / 2) - boundingEl.top,
  };

  // Create Old Bounding Box
  createBoundingBox();
  calcSegmentBoudingBox();

  fixedPolygonPosition.value.x = boundingBox.value.handlers[1].x;
  fixedPolygonPosition.value.y = boundingBox.value.handlers[3].y;
  fixedPolygonPosition.value.spaceX = newCenterPoint.x - fixedPolygonPosition.value.x;
  fixedPolygonPosition.value.spaceY = newCenterPoint.y - fixedPolygonPosition.value.y;
  updateAutoPosition()
  createBoundingBox();
  calcSegmentBoudingBox();

  // Resize Polygon
  const newPoint1 = {
    offsetX: elVal.left - boundingEl.left,
    offsetY: elVal.top - boundingEl.top,
  };
  const newPoint2 = {
    offsetX: newPoint1.offsetX + elVal.width,
    offsetY: newPoint1.offsetY + elVal.height,
  };
  handlerIndex.value = 0;
  resizeBoundingBox(newPoint1);
  handlerIndex.value = 4;
  resizeBoundingBox(newPoint2);
  targetPolygonIndex.value = -1
}

/* Speech Draw
* */
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
  if (!polygonElement || !boundingElement.value) return;
  polygonElement.style.transform = "translate(0px, 0px)";
  boundingElement.value.style.transform = "translate(0px, 0px)";
};
const autoUpdateSegments = (node: CommonModule.Point, nodeIndex: number, fixedNodes: Node[]) => {
  const targetEl = polygons.value[polygons.value.length - 1]
  const newPosition = {x: node.x, y: node.y,};
  const segments = targetEl.segments
  const nodes = targetEl.nodes
  const numberController = nodes[nodeIndex].lines.length

  if (numberController) {
    const isLeftToRight = newPosition.x > nodes[nodeIndex].rect.x;
    const isTopToBottom = newPosition.y > nodes[nodeIndex].rect.y;
    const space = {
      x: Math.abs(fixedNodes[nodeIndex].rect.x - newPosition.x),
      y: Math.abs(fixedNodes[nodeIndex].rect.y - newPosition.y),
    };

    for (let i = 0; i < numberController; i++) {
      nodes[nodeIndex].lines[i].x1 = newPosition.x;
      nodes[nodeIndex].lines[i].y1 = newPosition.y;
    }

    for (let i = 0; i < numberController; i++) {
      if (isLeftToRight) nodes[nodeIndex].circles[i].x += space.x;
      else nodes[nodeIndex].circles[i].x -= space.x;
      if (isTopToBottom) nodes[nodeIndex].circles[i].y += space.y;
      else nodes[nodeIndex].circles[i].y -= space.y;
    }

    for (let i = 0; i < numberController; i++) {
      nodes[nodeIndex].lines[i].x2 = nodes[nodeIndex].circles[i].x;
      nodes[nodeIndex].lines[i].y2 = nodes[nodeIndex].circles[i].y;
    }
  } else if (nodeIndex > 0) {
    segments[nodeIndex - 1].controlPoint2 = newPosition;
    segments[nodeIndex].controlPoint1 = newPosition;
  } else {
    segments[0].controlPoint1 = newPosition;
    segments[segments?.length - 1].controlPoint2 = newPosition;
  }

  // Update segments
  if (nodeIndex > 0) {
    segments[nodeIndex - 1].end.x = newPosition.x;
    segments[nodeIndex - 1].end.y = newPosition.y;
    segments[nodeIndex].start.x = newPosition.x;
    segments[nodeIndex].start.y = newPosition.y;

    if (numberController > 1) {
      segments[nodeIndex - 1].controlPoint2 = nodes[nodeIndex].circles[1]
      segments[nodeIndex].controlPoint1 = nodes[nodeIndex].circles[0]
    } else if (numberController) {
      segments[nodeIndex].controlPoint1 = nodes[nodeIndex].circles[0]
    }
  } else {
    segments[0].start = newPosition;
    segments[segments.length - 1].end = newPosition;

    if (numberController > 1) {
      segments[0].controlPoint1 = nodes[0]?.circles[0]
      segments[0].controlPoint2 = nodes[1]?.circles[1]

      segments[segments.length - 1].controlPoint1 = nodes[nodes.length - 1].circles[0]
      segments[segments.length - 1].controlPoint2 = nodes[0].circles[1]
    } else if (numberController) {
      segments[0].controlPoint1 = nodes[0]?.circles[0]
      segments[segments.length - 1].controlPoint1 = nodes[nodes.length - 1].circles[0]
    }
  }
};
const autoResizePolygon = () => {
  let points: CommonModule.MinMax[] = [];
  const targetEl = polygons.value[polygons.value.length - 1]
  targetEl.segments.forEach((segment) => {
    points.push(
        bezierMinMax(
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
  const minX = getMinMaxValue(points, true, "min", "x");
  const maxX = getMinMaxValue(points, false, "max", "x");
  const minY = getMinMaxValue(points, true, "min", "y");
  const maxY = getMinMaxValue(points, false, "max", "y");

  const minx = getMinMaxValue(boundingBox.value.handlers, true, "", "x");
  const maxx = getMinMaxValue(boundingBox.value.handlers, false, "", "x");
  const miny = getMinMaxValue(boundingBox.value.handlers, true, "", "y");
  const maxy = getMinMaxValue(boundingBox.value.handlers, false, "", "y");

  let xScale = maxX - minX !== 0 ? (maxx - minx) / (maxX - minX) : 1;
  let yScale = maxY - minY !== 0 ? (maxy - miny) / (maxY - minY) : 1;

  if (xScale === 0 || yScale === 0) return;

  // Calculate the center of the original bounding box
  const originalCenterX = (maxX + minX) / 2;
  const originalCenterY = (maxY + minY) / 2;

  // Calculate the center of the new bounding box
  const newCenterX = (maxx + minx) / 2;
  const newCenterY = (maxy + miny) / 2;

  // Translate the polygon to the center of the original bounding box
  const translatedNodes = targetEl.nodes.map(
      (node) => {
        node.rect.x -= originalCenterX;
        node.rect.y -= originalCenterY;
        if (!node.circles) return node;
        for (let i = 0; i < node.circles.length; i++) {
          node.circles[i].x -= originalCenterX;
          node.circles[i].y -= originalCenterY;

          node.lines[i].x1 -= originalCenterX;
          node.lines[i].y1 -= originalCenterY;
          node.lines[i].x2 -= originalCenterX;
          node.lines[i].y2 -= originalCenterY;
        }
        return node;
      },
  );

  // Scale the polygon vertices
  const scaledNodes = translatedNodes.map((node) => {
    node.rect.x *= xScale;
    node.rect.y *= yScale;
    if (!node.circles) return node;
    for (let i = 0; i < node.circles.length; i++) {
      node.circles[i].x *= xScale;
      node.circles[i].y *= yScale;

      node.lines[i].x1 *= xScale;
      node.lines[i].y1 *= yScale;
      node.lines[i].x2 *= xScale;
      node.lines[i].y2 *= yScale;
    }
    return node;
  });

  // Translate the polygon back to its original position
  const fixedNodes = [].concat(targetEl.nodes);
  scaledNodes.forEach((node, i) => {
    node.rect.x += newCenterX;
    node.rect.y += newCenterY;

    if (!node.circles) {
      autoUpdateSegments(node.rect, i, fixedNodes);
      return node;
    }
    for (let i = 0; i < node.circles.length; i++) {
      node.circles[i].x += newCenterX;
      node.circles[i].y += newCenterY;

      node.lines[i].x1 += newCenterX;
      node.lines[i].y1 += newCenterY;
      node.lines[i].x2 += newCenterX;
      node.lines[i].y2 += newCenterY;
    }
    autoUpdateSegments(node.rect, i, fixedNodes);
  });
};
const resetBoundingBox = () => {
  boundingBox.value.handlers.length = 0
  boundingBox.value.segments.length = 0
  isResetBoundingBox.value = false
}
/*
* Watch */
watch(() => props.isReCalcBoundingBox, (val) => {
  if (val) {
    createBoundingBox()
    calcSegmentBoudingBox()
    emits('update:boundingBox', boundingBox.value)
  }
}, { deep: true})
watch(() => isResetBoundingBox, (val) => {
  if (val) {
    resetBoundingBox()
  }
}, {deep: true})
watch(() => props.isDrawingSpeechBubble, (val) => {
  if (val) {
    drawSpeechBubble()
  }
}, {deep: true, immediate: true})
</script>
