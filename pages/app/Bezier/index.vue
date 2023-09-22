<template>
  <div class="bezier-container">
    <div ref="imgContainerElement" class="workspace">
      <!--START BEZIER PANEL-->
      <bezier-panel
          v-model:onPenTool="onPenTool"
          v-model:onDirectSelectionTool="onDirectSelectionTool"
          v-model:onSelectionTool="onSelectionTool"
          v-model:onDrawSpeechBubble="onDrawSpeechBubble"
          v-model:isSelectedBubbleType="isSelectedBubbleType"
          @update:targetPolygonIndex="(newVal) => targetPolygonIndex = newVal"
          :isDrawing="isDrawing"
      />
      <!--END BEZIER PANEL-->
      <svg
          id="workspace"
          ref="workspace"
          @mouseout="preventMouseOut"
          @mouseover="preventMouseOver"
          @mouseup="handleMouseUp"
          @mousedown="handleMouseDown($event)"
      >
        <!--START BEZIER POLYGON-->
        <bezier-polygon v-if="polygons.length"
                        :onPenTool="onPenTool"
                        :onSelectionTool="onSelectionTool"
                        :onDirectSelectionTool="onDirectSelectionTool"
                        :onDrawSpeechBubble="onDrawSpeechBubble"
                        :polygons="polygons"
                        v-model:targetPolygonIndex="targetPolygonIndex"
                        v-model:polygon="polygons[targetPolygonIndex]"
                        :isDrawingSpeechBubble="isDrawingSpeechBubble"
                        :isStageEnded="isStageEnded"
                        v-model:isResetBoundingBox="isResetBoundingBox"
        />
        <!--END BEZIER POLYGON-->
      </svg>
      <div id="workspace-virtual" v-if="onDrawSpeechBubble && isSelectedBubbleType">
        <div @mousedown="mouseDown($event)"
             class="tw-absolute tw-w-full tw-h-full tw-top-0 tw-left-0"
        >
        </div>
      </div>
    </div>
    <div id="virtualRectangle" ref="virtualRectangleElement"></div>
  </div>
</template>
<script lang="ts" setup>
import {BUBBLE_TEMPLATES, KEY_BOARD} from "~/lib/utils/contants";
import BezierPanel from "~/pages/app/Bezier/Panel.vue";
import BezierPolygon from "~/pages/app/Bezier/Polygon.vue";
import {useKeyModifier} from "@vueuse/core";

const route = useRoute();

const workspace = ref<HTMLElement>();
const polygons = ref<CommonModule.Polygon[]>([]);

const targetPoint = ref(0);
const targetPolygonIndex = ref(0);
const handlerIndex = ref<number | null>();

const isStageStarted = ref<boolean>(false);
const isStageEnded = ref<boolean[]>([false]);
const isStageMove = ref<boolean>(false);
const isMousePress = ref<boolean>(false);
const mouseDownEvent = ref(null);
const mousePressEvent = ref(null);
const createNewPolygon = ref<boolean>(false);

const onDirectSelectionTool = ref<boolean>(false);
const onSelectionTool = ref<boolean>(false);
const onPenTool = ref<boolean>(false);
const onDrawSpeechBubble = ref<boolean>(false);

const imgContainerElement: Ref<HTMLElement | undefined> = ref()
const virtualRectangleElement: Ref<HTMLElement | undefined> = ref()
const movementLimit = ref<CommonModule.MovementLimit>()
const isSelectedBubbleType = ref<String>()
const virtualRectangle = ref<CommonModule.VirtualRectangle>({
  top: 0,
  left: 0,
  width: 0,
  height: 0
})
const isDrawing = ref<boolean>(false)
const isDrawingSpeechBubble = ref<boolean>(false)
const isResetBoundingBox = ref<boolean>(false)
const isAlt = useKeyModifier(KEY_BOARD.ALT)
/*
 * Hooks */
onMounted(() => {
  onPenTool.value = true
  nextTick(() => {
    if (!workspace.value) return
    const wrapper = workspace.value.getBoundingClientRect()
    movementLimit.value = {
      minX: 4,
      minY: 4,
      maxX: wrapper.width - 6,
      maxY: wrapper.height - 6,
    }
  })
})
onUnmounted(() => {
  document.removeEventListener("keydown", undo);
  document.removeEventListener("keydown", deletePolygon);
});
/*
 * Methods */
const mouseDown = (event: MouseEvent) => {
  if (virtualRectangleElement.value) {
    virtualRectangle.value.width = 0
    virtualRectangle.value.height = 0
    virtualRectangleElement.value.style.width = '0px'
    virtualRectangleElement.value.style.height = '0px'
  }
  isDrawingSpeechBubble.value = false
  event.stopPropagation();
  targetPolygonIndex.value = -1

  document.addEventListener('mouseup', mouseUp)
  mouseDownEvent.value = setTimeout(() => {
    isMousePress.value = true
    virtualRectangle.value.top = event.clientY
    virtualRectangle.value.left = event.clientX
    if (!virtualRectangleElement.value) return
    virtualRectangleElement.value.style.top = virtualRectangle.value.top + 'px'
    virtualRectangleElement.value.style.left = virtualRectangle.value.left + 'px'
    virtualRectangleElement.value.style.opacity = '1'
    document.addEventListener('mousemove', mouseMove)
  }, 150)
}
const mouseMove = (event: MouseEvent) => {
  event.stopPropagation();
  event.preventDefault();
  if (!virtualRectangleElement.value) return
  const elVal = virtualRectangleElement.value.getBoundingClientRect()
  if (event.clientY < elVal.top || event.clientX < elVal.left) return;
  virtualRectangleElement.value.style.width = event.clientX - elVal.left + 'px'
  virtualRectangleElement.value.style.height = event.clientY - elVal.top + 'px'
}
const mouseUp = (event: MouseEvent) => {
  if (mouseDownEvent.value) clearTimeout(mouseDownEvent.value)
  if (!isMousePress.value || !workspace.value || !virtualRectangleElement.value) return
  isMousePress.value = false
  event.stopPropagation();
  document.removeEventListener('mousemove', mouseMove)
  document.removeEventListener('mouseup', mouseUp)
  const workspaceEl = workspace.value.getBoundingClientRect()
  const elVal = virtualRectangleElement.value.getBoundingClientRect()
  virtualRectangle.value.width =  Math.min(Math.max(event.clientX - elVal.left, 60), workspaceEl.width)
  virtualRectangle.value.height = Math.min(Math.max(event.clientY - elVal.top, 60), workspaceEl.height)
  virtualRectangleElement.value.style.width = virtualRectangle.value.width + 'px'
  virtualRectangleElement.value.style.height = virtualRectangle.value.height + 'px'
  if (virtualRectangle.value.width === workspaceEl.width) {
    virtualRectangle.value.left = workspaceEl.left
    virtualRectangleElement.value.style.left = virtualRectangle.value.left + 'px'
  }
  if (virtualRectangle.value.height === workspaceEl.height) {
    virtualRectangle.value.top = workspaceEl.top
    virtualRectangleElement.value.style.top = virtualRectangle.value.top + 'px'
  }


  isDrawingSpeechBubble.value = true
  targetPolygonIndex.value = polygons.value.length;
  const bubbleTemplates = JSON.parse(JSON.stringify(BUBBLE_TEMPLATES))
  if (isSelectedBubbleType.value) polygons.value.push(bubbleTemplates[isSelectedBubbleType.value.toString()])
  if (virtualRectangleElement.value) virtualRectangleElement.value.style.opacity = '0'
  isStageEnded.value[targetPolygonIndex.value] = true
  createNewPolygon.value = true
}
const handleMouseUp = () => {
  if (isStageStarted.value) document.addEventListener("mousemove", stageMoved);
  document.removeEventListener("mousemove", curveStarted);
  clearTimeout(mouseDownEvent.value);
  clearTimeout(mousePressEvent.value);
  isMousePress.value = false;
  handlerIndex.value = null;
  isStageMove.value = false
}
const handleMouseDown = (event: MouseEvent) => {
  if (!onPenTool.value) return;
  if (!isStageEnded.value[targetPolygonIndex.value] || !onDirectSelectionTool.value) stageStarted(event);
  mouseDownEvent.value = setTimeout(() => {
    isMousePress.value = true;
    document.addEventListener("mousemove", curveStarted);
  }, 150);
};
/* Drawing
* */
const stageStarted = (e: MouseEvent, isEnd?: boolean) => {
  isStageStarted.value = true;
  isDrawing.value = true
  const el = e.target as HTMLElement
  if (polygons.value[targetPolygonIndex.value]?.nodes.length === 1 && (el.parentElement!.classList.contains("startpoint") || el.classList.contains("startpoint"))) return
  if ((isStageEnded.value[targetPolygonIndex.value]
          && el.parentElement!.classList.contains("startpoint"))
      || el.classList.contains("startpoint")) return;

  if (!isStageEnded.value[targetPolygonIndex.value]) isStageEnded.value[targetPolygonIndex.value] = el.parentElement!.classList.contains("startpoint") || el.classList.contains("startpoint");

  const handler: CommonModule.Point = {
    x: e.offsetX,
    y: e.offsetY,
  };
  const segments: CommonModule.Segment[] = polygons.value[targetPolygonIndex.value]?.segments || []
  const nodes: CommonModule.Node[] = polygons.value[targetPolygonIndex.value]?.nodes || []
  const polygon: CommonModule.Polygon = polygons.value[targetPolygonIndex.value] || null

  if (!polygons.value.length || createNewPolygon.value) {
    const firstNode: CommonModule.Node = {
      rect: {x: handler.x, y: handler.y},
      isStartPoint: true,
      isZigzag: false,
      circles: [],
      lines: [],
    };
    polygons.value.push({
      nodes: [firstNode],
      segments: [],
    });
    targetPoint.value = 0;
    createNewPolygon.value = false;
  } else if (isEnd && nodes && segments) {
    createNewPolygon.value = true;
    nodes.splice(-2)
    segments.splice(-2)
    const fixedNodes = JSON.parse(JSON.stringify(nodes))
    segments.push({
      start: fixedNodes[fixedNodes.length - 1].rect,
      end: nodes[0].rect,
      controlPoint1: fixedNodes[fixedNodes.length - 1].circles[0] || fixedNodes[fixedNodes.length - 1].rect,
      controlPoint2: nodes[0].rect,
    });
    nodes[0].isZigzag = true
    isDrawing.value = false
    nodes[0].lines.pop()
    nodes[0].circles.pop()
  } else if (!isStageEnded.value[targetPolygonIndex.value]) {
    targetPoint.value += 1;
    const node: CommonModule.Node = {
      rect: {
        x: handler.x,
        y: handler.y,
      },
      isStartPoint: false,
      isZigzag: false,
      circles: [],
      lines: [],
    };
    nodes?.push(node);
    if (nodes.length > 1) {
      const controlPoint1: CommonModule.Point = nodes[targetPoint.value - 1].circles.length
          ? nodes[targetPoint.value - 1].circles[0]
          : nodes[targetPoint.value - 1].rect;
      const segment = {
        start: {
          x: nodes[targetPoint.value - 1].rect.x,
          y: nodes[targetPoint.value - 1].rect.y,
        },
        end: {
          x: nodes[targetPoint.value].rect.x,
          y: nodes[targetPoint.value].rect.y,
        },
        controlPoint1: controlPoint1,
        controlPoint2: nodes[targetPoint.value].rect,
      };
      segments[targetPoint.value - 1] = segment;
    }
  } else {
    createNewPolygon.value = true;
    if (polygon.pathAbsolute) segments[targetPoint.value] = polygon.pathAbsolute;
    segments[targetPoint.value].controlPoint2 = nodes[0].circles[1] ? nodes[0].circles[1] : nodes[0].rect;
    segments[targetPoint.value].end = segments[0].start;
    isDrawing.value = false
  }
  targetPolygonIndex.value = polygons.value.length - 1;
  if (targetPoint.value === 1 && nodes[0].circles.length > 1) {
    nodes[0].circles[1] = nodes[0].rect
    nodes[0].lines[1] = {
      x1: nodes[0].rect.x,
      y1: nodes[0].rect.y,
      x2: nodes[0].rect.x,
      y2: nodes[0].rect.y,
    }
  }
};
const curveStarted = (e: MouseEvent) => {
  isStageMove.value = true
  const controlPoint1: CommonModule.Point = {
    x: e.offsetX,
    y: e.offsetY,
  };

  if (isStageEnded.value[targetPolygonIndex.value]) targetPoint.value = 0;
  const mainPoint: CommonModule.Point = polygons.value[polygons.value.length - 1].nodes[targetPoint.value].rect;
  let controlPoint2: CommonModule.Point = {x: 0, y: 0};
  if (controlPoint1.x > mainPoint.x) {
    controlPoint2.x = controlPoint1.x - 2 * (controlPoint1.x - mainPoint.x);
  } else {
    controlPoint2.x = mainPoint.x + mainPoint.x - controlPoint1.x;
  }

  if (controlPoint1.y > mainPoint.y) {
    controlPoint2.y = controlPoint1.y - 2 * (controlPoint1.y - mainPoint.y);
  } else {
    controlPoint2.y = mainPoint.y + mainPoint.y - controlPoint1.y;
  }

  const line1: CommonModule.Line = {
    x1: mainPoint.x,
    y1: mainPoint.y,
    x2: controlPoint1.x,
    y2: controlPoint1.y,
  };
  const line2: CommonModule.Line = {
    x1: mainPoint.x,
    y1: mainPoint.y,
    x2: controlPoint2.x,
    y2: controlPoint2.y,
  };

  if (isAlt.value && !targetPoint.value) polygons.value[polygons.value.length - 1].nodes[0].isZigzag = true
  if (!polygons.value[polygons.value.length - 1].nodes[targetPoint.value].isZigzag) {
    polygons.value[polygons.value.length - 1].nodes[targetPoint.value].circles = [controlPoint1, controlPoint2];
    polygons.value[polygons.value.length - 1].nodes[targetPoint.value].lines = [line1, line2];
  } else if (polygons.value[polygons.value.length - 1].nodes.length > 1 && targetPoint.value === 0) {
    polygons.value[polygons.value.length - 1].nodes[targetPoint.value].circles[1] = controlPoint2
    polygons.value[polygons.value.length - 1].nodes[targetPoint.value].lines[1] = line2
    polygons.value[targetPolygonIndex.value].segments[polygons.value[targetPolygonIndex.value].segments.length - 1].controlPoint2 = controlPoint2;
  } else {
    polygons.value[polygons.value.length - 1].nodes[targetPoint.value].circles[0] = controlPoint1
    polygons.value[polygons.value.length - 1].nodes[targetPoint.value].lines[0] = line1
  }

  if (polygons.value[targetPolygonIndex.value].nodes?.length > 1 && targetPoint.value > 0) {
    polygons.value[targetPolygonIndex.value].segments[targetPoint.value - 1].controlPoint2 = polygons.value[targetPolygonIndex.value].nodes[targetPoint.value].circles[1];
  } else if (polygons.value[targetPolygonIndex.value].nodes?.length > 1 && !polygons.value[polygons.value.length - 1].nodes[targetPoint.value].isZigzag && !targetPoint.value) {
    polygons.value[targetPolygonIndex.value].segments[0].controlPoint1 = controlPoint1
    polygons.value[targetPolygonIndex.value].segments[polygons.value[targetPolygonIndex.value].segments.length - 1].controlPoint2 = controlPoint2;
  }
};
const stageMoved = (e: MouseEvent) => {
  if (isStageEnded.value[targetPolygonIndex.value] || targetPoint.value === null || !polygons.value.length) return;
  const newPoint: CommonModule.Point = {
    x: e.offsetX,
    y: e.offsetY,
  };
  if (!polygons.value[polygons.value.length - 1].nodes[targetPoint.value]) return;
  const startPoint: CommonModule.Point = polygons.value[polygons.value.length - 1].nodes[targetPoint.value].rect;
  const controlPoint1: CommonModule.Point = polygons.value[polygons.value.length - 1].nodes[targetPoint.value].circles.length
      ? polygons.value[polygons.value.length - 1].nodes[targetPoint.value].circles[0]
      : startPoint;
  const controlPoint2: CommonModule.Point = polygons.value[polygons.value.length - 1].nodes[targetPoint.value].circles.length
      ? polygons.value[polygons.value.length - 1].nodes[targetPoint.value].circles[1]
      : startPoint;

  polygons.value[polygons.value.length - 1].pathAbsolute = {
    start: {x: startPoint.x, y: startPoint.y},
    end: {x: newPoint.x, y: newPoint.y},
    controlPoint1,
    controlPoint2,
  };
};

const preventMouseOut = () => {
  if (!onPenTool.value) document.removeEventListener('mouseup', handleMouseUpOutsideWindow)
  nextTick(() => {
    const pathAbsolute = document.getElementById(`pathAbsolute-${targetPolygonIndex.value}`)
    if (pathAbsolute) pathAbsolute.style.opacity = '0'
    if (isStageMove.value) {
      document.addEventListener('mouseup', handleMouseUpOutsideWindow)
      const targetNode = document.getElementById(`anchorPoint-${targetPolygonIndex.value}-${targetPoint.value}`)
      if (!targetNode) return
      targetNode.childNodes.forEach((node: any) => {
        if (node.tagName === 'line' || node.tagName === 'circle') node.style.opacity = '0'
      })
    }
  })
}
const preventMouseOver = () => {
  if (!onPenTool.value) document.removeEventListener('mouseup', handleMouseUpOutsideWindow)
  nextTick(() => {
    document.removeEventListener('mouseup', handleMouseUpOutsideWindow)
    const pathAbsolute = document.getElementById(`pathAbsolute-${targetPolygonIndex.value}`)
    if (pathAbsolute) pathAbsolute.style.opacity = '1'
    const targetNode = document.getElementById(`anchorPoint-${targetPolygonIndex.value}-${targetPoint.value}`)
    if (!targetNode) return
    targetNode.childNodes.forEach((node: any) => {
      if (node.tagName === 'line' || node.tagName === 'circle') node.style.opacity = '1'
    })
  })
}
/* Move
* */
const handleMouseUpOutsideWindow = () => {
  handleMouseUp()
  const segments = polygons.value[targetPolygonIndex.value].segments
  const nodes = polygons.value[targetPolygonIndex.value].nodes
  nodes[targetPoint.value].lines = []
  nodes[targetPoint.value].circles = []
  if (!targetPoint.value && nodes.length > 1) {
    segments[segments.length - 1].controlPoint2 =  segments[segments.length - 1].end
    if (!nodes[0].isZigzag) segments[0].controlPoint1 =  segments[0].start
  } else if (segments.length) {
    segments[targetPoint.value - 1].controlPoint2 = segments[targetPoint.value - 1].end
  }
}

const undo = () => {
  if (!onPenTool.value || !polygons.value[targetPolygonIndex.value]) return;
  if (isStageEnded.value[targetPolygonIndex.value]) {
    targetPoint.value = polygons.value[targetPolygonIndex.value].nodes.length - 1
    if (polygons.value[targetPolygonIndex.value].segments) polygons.value[targetPolygonIndex.value].segments.pop();
    if (polygons.value[targetPolygonIndex.value].nodes[0].circles) polygons.value[targetPolygonIndex.value].nodes[0].circles.pop()
    if (polygons.value[targetPolygonIndex.value].nodes[0].lines) polygons.value[targetPolygonIndex.value].nodes[0].lines.pop()
    isStageEnded.value[targetPolygonIndex.value] = false
    createNewPolygon.value = false
  } else {
    if (polygons.value[targetPolygonIndex.value].nodes) {
      polygons.value[targetPolygonIndex.value].nodes.pop();
      targetPoint.value--;
    }
    if (polygons.value[targetPolygonIndex.value].segments) polygons.value[targetPolygonIndex.value].segments.pop();
  }
  if (targetPoint.value < 0) {
    polygons.value.pop();
    createNewPolygon.value = true
    isDrawing.value = false
  }
};
const checkUndoWithKeyBoard = () => {
  const userAgent = window.navigator.userAgent;
  const isMac = userAgent.includes("Mac OS X");
  document.addEventListener("keydown", (event: KeyboardEvent) => {
    if (
        (event.key === "z" && isMac && event.metaKey) ||
        (!isMac && event.ctrlKey)
    ) {
      undo();
    } else if (
        (isMac &&
            (event.key === KEY_BOARD.BACK_SPACE ||
                event.key === KEY_BOARD.DELETE)) ||
        (!isMac && event.key === KEY_BOARD.DELETE)
    ) {
      deletePolygon();
    }
  });
};

const deletePolygon = () => {
  if (!polygons.value.length || !polygons.value[targetPolygonIndex.value]) return;
  polygons.value.splice(targetPolygonIndex.value, 1);
  isStageEnded.value.splice(targetPolygonIndex.value, 1);
  isStageStarted.value = true;
  targetPolygonIndex.value--;
  isResetBoundingBox.value = true
};
/*
/*
* Watch */
watch(isAlt, (val) => {
  if (val && isDrawing.value) {
    if (!targetPoint.value && polygons.value[targetPolygonIndex.value].nodes.length > 1) return
    polygons.value[targetPolygonIndex.value].nodes[targetPoint.value].isZigzag = true
  }
})
watch(isStageStarted, (val) => {
  if (val) {
    document.addEventListener("dblclick", ($event) => {
      if (!onPenTool.value || polygons.value[targetPolygonIndex.value].nodes.length <= 1) return
      isStageEnded.value[targetPolygonIndex.value] = true;
      stageStarted($event, true);
    });
  }
});

watch(onDirectSelectionTool, (val) => {
  if (val) {
    isStageStarted.value = false;
  }
});
watch(onPenTool, (val) => {
  if (!imgContainerElement.value) return
  if (val) {
    imgContainerElement.value.classList.add("stageStarted");
  } else {
    document.removeEventListener('mouseup', handleMouseUpOutsideWindow)
    imgContainerElement.value.classList.remove("stageStarted");
    document.removeEventListener("mousemove", stageMoved)
  }
});
watch(
    () => route.query,
    () => {
      checkUndoWithKeyBoard();
    },
    {immediate: true, deep: true},
);
</script>
