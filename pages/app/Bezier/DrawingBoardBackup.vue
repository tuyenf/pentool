<template>
  <div class="bezier-container">
    <bezier-panel
        v-model:onPenTool="onPenTool"
        v-model:onDirectSelectionTool="onDirectSelectionTool"
        v-model:onSelectionTool="onSelectionTool"
        v-model:onDrawSpeechBubble="onDrawSpeechBubble"
        v-model:isSelectedBubbleType="isSelectedBubbleType"
        :isDrawing="isDrawing"
    />
    <div ref="imgContainerElement" class="workspace">
      <svg
          id="workspace"
          ref="workspace"
          @mouseout="preventMouseOut"
          @mouseover="preventMouseOver"
          @mouseup="handleMouseUp"
          @mousedown="handleMouseDown($event)"
      >
        <g
            @mousedown.self="handleMouseDownPolygon($event)"
            id="bounding-box"
            ref="boundingElement"
            v-if="
            boundingBox.handlers.length &&
            boundingBox.segments.length &&
            onSelectionTool && targetPolygon !== null || isShowBoundingBox
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
        <g
            v-for="(polygon, i) in polygons"
            :key="i"
            class="polygon"
            :id="`polygon-${i}`"
            :class="{
            isFilled: polygon.isFilled,
            isSelected: targetPolygon === i,
            isMoving: targetPolygon === i && isMoveAPolygon,
          }"
            @mousedown="handleMouseDownPolygon($event)"
            @click="activePolygon(i)"
        >
          <path class="pathAbsolute" ref="pathAbsolute"
                :d="`M ${polygon.pathAbsolute?.start?.x} ${polygon.pathAbsolute.start.y}
                C ${polygon.pathAbsolute.controlPoint1.x} ${polygon.pathAbsolute.controlPoint1.y}
                ${polygon.pathAbsolute.end.x} ${polygon.pathAbsolute.end.y}
                ${polygon.pathAbsolute.end.x} ${polygon.pathAbsolute.end.y}`"
                :id="`pathAbsolute-${i}`"
                v-if="polygon.pathAbsolute && !isStageEnded[i] && targetPoint >= 0"
                style="opacity: 1"
                stroke="#000000"
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
                stroke="#000000"
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
                  :class="{ hide: i !== targetPolygon || !(onPenTool || onDirectSelectionTool) }"
                  stroke="#4E7FFF"
                  style="opacity: 1"
              ></line>
              <circle
                  v-for="(circle, ci) in node.circles"
                  :key="ci"
                  :cx="circle.x"
                  :cy="circle.y"
                  :r="r"
                  @click.alt.exact="
                  handleMoveControler($event, i, index, ci, true)
                "
                  @mousedown.self="handleMoveControler($event, i, index, ci)"
                  :class="{
                  hide: i !== targetPolygon || !(onPenTool || onDirectSelectionTool),
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
                  hide: i !== targetPolygon || !(onPenTool || onDirectSelectionTool),
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
      </svg>
      <div id="workspace-fake" v-if="onDrawSpeechBubble && isSelectedBubbleType">
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
import { KEY_BOARD} from "~/lib/utils/contants";
import {getMinMaxValue, bezierMinMax} from "~/lib/utils/global";
import BezierPanel from "~/pages/app/Bezier/Panel.vue";

const route = useRoute();

const r = 4;
const a = 8;
const b = 8;

const workspace = ref<HTMLElement>();
const pathAbsolute = ref<HTMLElement>();
const polygons = ref<CommonModule.Polygon[]>([]);

const targetPoint = ref(0);
const targetPolygon = ref(0);
const nodeIndex = ref(0);
const polygonIndex = ref(0);
const circleIndex = ref(0);
const handlerIndex = ref<number | null>();

const isStageStarted = ref<boolean>(false);
const isStageEnded = ref<boolean[]>([false]);
const isStageMove = ref<boolean>([false]);
const isMousePress = ref<boolean>(false);
const mouseDownEvent = ref(null);
const mousePressEvent = ref(null);
const createNewPolygon = ref<boolean>(false);

const onDirectSelectionTool = ref<boolean>(false);
const onSelectionTool = ref<boolean>(false);
const onPenTool = ref<boolean>(false);
const onDrawSpeechBubble = ref<boolean>(false);

const isMoveAnAnchorPoint = ref<boolean>(false);
const isMoveAController = ref<boolean>(false);
const isMoveAPolygon = ref<boolean>(false);
const editOneController = ref<boolean>(false);

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
const isShowBoundingBox = ref<boolean>(false)
const isAltPress = ref<boolean>(false)
const isDrawing = ref<boolean>(false)
/*
 * Hooks */
onMounted(() => {
  onPenTool.value = true
  nextTick(() => {
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
  event.stopPropagation();
  boundingBox.value.handlers = []
  boundingBox.value.segments = []
  isShowBoundingBox.value = false
  targetPolygon.value = null

  document.addEventListener('mouseup', mouseUp)
  mouseDownEvent.value = setTimeout(() => {
    isMousePress.value = true
    virtualRectangle.value.top = event.clientY
    virtualRectangle.value.left = event.clientX
    if (!virtualRectangleElement.value) return
    virtualRectangleElement.value.style.top = event.clientY + 'px'
    virtualRectangleElement.value.style.left = event.clientX + 'px'
    virtualRectangleElement.value.style.opacity = 1
    document.addEventListener('mousemove', mouseMove)
  }, 150)
}
const mouseMove = (event: MouseEvent) => {
  event.stopPropagation();
  event.preventDefault();
  if (!virtualRectangleElement.value) return
  const elVal = virtualRectangleElement.value.getBoundingClientRect()
  if (event.clientY < elVal.top || event.clientX < elVal.left) return;
  virtualRectangle.value.width = event.clientX -elVal.left
  virtualRectangle.value.height = event.clientY - elVal.top
  virtualRectangleElement.value.style.width = virtualRectangle.value.width + 'px'
  virtualRectangleElement.value.style.height = virtualRectangle.value.height + 'px'
}
const mouseUp = (event: MouseEvent) => {
  if (mouseDownEvent.value) clearTimeout(mouseDownEvent.value)
  if (!isMousePress.value) return
  isMousePress.value = false
  event.stopPropagation();
  document.removeEventListener('mousemove', mouseMove)
  document.removeEventListener('mouseup', mouseUp)
  drawSpeechBubble()
}
const drawSpeechBubble = () => {
  targetPolygon.value = polygons.value.length;
  const template = {
    "Bubble 1": {
      nodes: [
        {
          rect: {
            x: 197,
            y: 218,
          },
          isStartPoint: true,
          isZigzag: false,
          circles: [],
          lines: [],
        },
        {
          rect: {
            x: 353,
            y: 217,
          },
          isStartPoint: false,
          isZigzag: false,
          circles: [],
          lines: [],
        },
        {
          rect: {
            x: 355,
            y: 309,
          },
          isStartPoint: false,
          isZigzag: false,
          circles: [],
          lines: [],
        },
        {
          rect: {
            x: 189,
            y: 304,
          },
          isStartPoint: false,
          isZigzag: false,
          circles: [],
          lines: [],
        },
      ],
      segments: [
        {
          start: {
            x: 197,
            y: 218,
          },
          end: {
            x: 353,
            y: 217,
          },
          controlPoint1: {
            x: 197,
            y: 218,
          },
          controlPoint2: {
            x: 353,
            y: 217,
          },
        },
        {
          start: {
            x: 353,
            y: 217,
          },
          end: {
            x: 355,
            y: 309,
          },
          controlPoint1: {
            x: 353,
            y: 217,
          },
          controlPoint2: {
            x: 355,
            y: 309,
          },
        },
        {
          start: {
            x: 355,
            y: 309,
          },
          end: {
            x: 189,
            y: 304,
          },
          controlPoint1: {
            x: 355,
            y: 309,
          },
          controlPoint2: {
            x: 189,
            y: 304,
          },
        },
        {
          start: {
            x: 189,
            y: 304,
          },
          end: {
            x: 197,
            y: 218,
          },
          controlPoint1: {
            x: 189,
            y: 304,
          },
          controlPoint2: {
            x: 197,
            y: 218,
          },
        },
      ],
      isAutoCreate: true
    },
    "Bubble 2": {
      nodes: [
        {
          "rect": {
            "x": 289.94508327880715,
            "y": 150.71528056135008
          },
          "isStartPoint": true,
          "isZigzag": false,
          "circles": [
            {
              "x": 286.13190243300096,
              "y": 238.30865233656314
            },
            {
              "x": 293.75826412461333,
              "y": 63.12190878613599
            }
          ],
          "lines": [
            {
              "x1": 289.94508327880715,
              "y1": 150.71528056135008,
              "x2": 286.13190243300096,
              "y2": 238.30865233656314
            },
            {
              "x1": 289.94508327880715,
              "y1": 150.71528056135008,
              "x2": 293.75826412461333,
              "y2": 63.12190878613599
            }
          ]
        },
        {
          "rect": {
            "x": 418.3221717542797,
            "y": 194.85682224334724
          },
          "isStartPoint": false,
          "isZigzag": false,
          "circles": [
            {
              "x": 439.2946664062132,
              "y": 170.71691663600498
            },
            {
              "x": 397.34967710234577,
              "y": 218.99672785068992
            }
          ],
          "lines": [
            {
              "x1": 418.3221717542797,
              "y1": 194.85682224334724,
              "x2": 439.2946664062132,
              "y2": 170.71691663600498
            },
            {
              "x1": 418.3221717542797,
              "y1": 194.85682224334724,
              "x2": 397.34967710234577,
              "y2": 218.99672785068992
            }
          ]
        },
        {
          "rect": {
            "x": 404,
            "y": 240
          },
          "isStartPoint": false,
          "isZigzag": true,
          "circles": [
            {
              "x": 458.6555921232212,
              "y": 202.7555742058149
            },
            {
              "x": 430.05673577967536,
              "y": 224.13663345803187
            }
          ],
          "lines": [
            {
              "x1": 404,
              "y1": 240,
              "x2": 458.6555921232212,
              "y2": 202.7555742058149
            },
            {
              "x1": 404,
              "y1": 240,
              "x2": 430.05673577967536,
              "y2": 224.13663345803187
            }
          ]
        },
        {
          "rect": {
            "x": 452.00526922556696,
            "y": 112.0914315896021
          },
          "isStartPoint": false,
          "isZigzag": false,
          "circles": [
            {
              "x": 424.0419430229888,
              "y": 67.94988990760451
            },
            {
              "x": 479.96859542814525,
              "y": 156.23297327159932
            }
          ],
          "lines": [
            {
              "x1": 452.00526922556696,
              "y1": 112.0914315896021,
              "x2": 424.0419430229888,
              "y2": 67.94988990760451
            },
            {
              "x1": 452.00526922556696,
              "y1": 112.0914315896021,
              "x2": 479.96859542814525,
              "y2": 156.23297327159932
            }
          ]
        }
      ],
      segments: [
        {
          "start": {
            "x": 289.94508327880715,
            "y": 150.71528056135008
          },
          "end": {
            "x": 418.3221717542797,
            "y": 194.85682224334724
          },
          "controlPoint1": {
            "x": 286.13190243300096,
            "y": 238.30865233656314
          },
          "controlPoint2": {
            "x": 397.34967710234577,
            "y": 218.99672785068992
          }
        },
        {
          "start": {
            "x": 418.3221717542797,
            "y": 194.85682224334724
          },
          "end": {
            "x": 404,
            "y": 240
          },
          "controlPoint1": {
            "x": 439.2946664062132,
            "y": 170.71691663600498
          },
          "controlPoint2": {
            "x": 430.05673577967536,
            "y": 224.13663345803187
          }
        },
        {
          "start": {
            "x": 404,
            "y": 240
          },
          "end": {
            "x": 452.00526922556696,
            "y": 112.0914315896021
          },
          "controlPoint1": {
            "x": 458.6555921232212,
            "y": 202.7555742058149
          },
          "controlPoint2": {
            "x": 479.96859542814525,
            "y": 156.23297327159932
          }
        },
        {
          "start": {
            "x": 452.00526922556696,
            "y": 112.0914315896021
          },
          "end": {
            "x": 289.94508327880715,
            "y": 150.71528056135008
          },
          "controlPoint1": {
            "x": 424.0419430229888,
            "y": 67.94988990760451
          },
          "controlPoint2": {
            "x": 293.75826412461333,
            "y": 63.12190878613599
          }
        }
      ],
      isAutoCreate: true
    },
    "Bubble 3": {
      nodes: [
        {
          "rect": {
            "x": 291,
            "y": 260
          },
          "isStartPoint": true,
          "isZigzag": true,
          "circles": [
            {
              "x": 247,
              "y": 312
            },
            {
              "x": 226,
              "y": 244
            }
          ],
          "lines": [
            {
              "x1": 291,
              "y1": 260,
              "x2": 247,
              "y2": 312
            },
            {
              "x1": 291,
              "y1": 260,
              "x2": 226,
              "y2": 244
            }
          ]
        },
        {
          "rect": {
            "x": 362,
            "y": 306
          },
          "isStartPoint": false,
          "isZigzag": true,
          "circles": [
            {
              "x": 359,
              "y": 398
            },
            {
              "x": 340,
              "y": 355
            }
          ],
          "lines": [
            {
              "x1": 362,
              "y1": 306,
              "x2": 359,
              "y2": 398
            },
            {
              "x1": 362,
              "y1": 306,
              "x2": 340,
              "y2": 355
            }
          ]
        },
        {
          "rect": {
            "x": 463,
            "y": 304
          },
          "isStartPoint": false,
          "isZigzag": true,
          "circles": [
            {
              "x": 510,
              "y": 356
            },
            {
              "x": 473,
              "y": 364
            }
          ],
          "lines": [
            {
              "x1": 463,
              "y1": 304,
              "x2": 510,
              "y2": 356
            },
            {
              "x1": 463,
              "y1": 304,
              "x2": 473,
              "y2": 364
            }
          ]
        },
        {
          "rect": {
            "x": 524,
            "y": 234
          },
          "isStartPoint": false,
          "isZigzag": true,
          "circles": [
            {
              "x": 557,
              "y": 185
            },
            {
              "x": 580,
              "y": 264
            }
          ],
          "lines": [
            {
              "x1": 524,
              "y1": 234,
              "x2": 557,
              "y2": 185
            },
            {
              "x1": 524,
              "y1": 234,
              "x2": 580,
              "y2": 264
            }
          ]
        },
        {
          "rect": {
            "x": 452,
            "y": 176
          },
          "isStartPoint": false,
          "isZigzag": true,
          "circles": [
            {
              "x": 438,
              "y": 110
            },
            {
              "x": 487,
              "y": 130
            }
          ],
          "lines": [
            {
              "x1": 452,
              "y1": 176,
              "x2": 438,
              "y2": 110
            },
            {
              "x1": 452,
              "y1": 176,
              "x2": 487,
              "y2": 130
            }
          ]
        },
        {
          "rect": {
            "x": 338,
            "y": 180
          },
          "isStartPoint": false,
          "isZigzag": true,
          "circles": [
            {
              "x": 268,
              "y": 149
            },
            {
              "x": 325,
              "y": 131
            }
          ],
          "lines": [
            {
              "x1": 338,
              "y1": 180,
              "x2": 268,
              "y2": 149
            },
            {
              "x1": 338,
              "y1": 180,
              "x2": 325,
              "y2": 131
            }
          ]
        }
      ],
      segments: [
        {
          "start": {
            "x": 291,
            "y": 260
          },
          "end": {
            "x": 362,
            "y": 306
          },
          "controlPoint1": {
            "x": 247,
            "y": 312
          },
          "controlPoint2": {
            "x": 340,
            "y": 355
          }
        },
        {
          "start": {
            "x": 362,
            "y": 306
          },
          "end": {
            "x": 463,
            "y": 304
          },
          "controlPoint1": {
            "x": 359,
            "y": 398
          },
          "controlPoint2": {
            "x": 473,
            "y": 364
          }
        },
        {
          "start": {
            "x": 463,
            "y": 304
          },
          "end": {
            "x": 524,
            "y": 234
          },
          "controlPoint1": {
            "x": 510,
            "y": 356
          },
          "controlPoint2": {
            "x": 580,
            "y": 264
          }
        },
        {
          "start": {
            "x": 524,
            "y": 234
          },
          "end": {
            "x": 452,
            "y": 176
          },
          "controlPoint1": {
            "x": 557,
            "y": 185
          },
          "controlPoint2": {
            "x": 487,
            "y": 130
          }
        },
        {
          "start": {
            "x": 452,
            "y": 176
          },
          "end": {
            "x": 338,
            "y": 180
          },
          "controlPoint1": {
            "x": 438,
            "y": 110
          },
          "controlPoint2": {
            "x": 325,
            "y": 131
          }
        },
        {
          "start": {
            "x": 338,
            "y": 180
          },
          "end": {
            "x": 291,
            "y": 260
          },
          "controlPoint1": {
            "x": 268,
            "y": 149
          },
          "controlPoint2": {
            "x": 226,
            "y": 244
          }
        }
      ],
      isAutoCreate: true
    },
    "Bubble 4": {
      nodes: [
        {
          "rect": {
            "x": 461,
            "y": 354
          },
          "isStartPoint": true,
          "isZigzag": false,
          "circles": [
            {
              "x": 416,
              "y": 354
            },
            {
              "x": 461,
              "y": 354
            }
          ],
          "lines": [
            {
              "x1": 461,
              "y1": 354,
              "x2": 416,
              "y2": 354
            },
            {
              "x1": 461,
              "y1": 354,
              "x2": 461,
              "y2": 354
            }
          ]
        },
        {
          "rect": {
            "x": 252,
            "y": 355
          },
          "isStartPoint": false,
          "isZigzag": false,
          "circles": [
            {
              "x": 240,
              "y": 336
            },
            {
              "x": 264,
              "y": 374
            }
          ],
          "lines": [
            {
              "x1": 252,
              "y1": 355,
              "x2": 240,
              "y2": 336
            },
            {
              "x1": 252,
              "y1": 355,
              "x2": 264,
              "y2": 374
            }
          ]
        },
        {
          "rect": {
            "x": 252,
            "y": 246
          },
          "isStartPoint": false,
          "isZigzag": false,
          "circles": [
            {
              "x": 275,
              "y": 232
            },
            {
              "x": 229,
              "y": 260
            }
          ],
          "lines": [
            {
              "x1": 252,
              "y1": 246,
              "x2": 275,
              "y2": 232
            },
            {
              "x1": 252,
              "y1": 246,
              "x2": 229,
              "y2": 260
            }
          ]
        },
        {
          "rect": {
            "x": 535,
            "y": 237
          },
          "isStartPoint": false,
          "isZigzag": false,
          "circles": [
            {
              "x": 546,
              "y": 256
            },
            {
              "x": 524,
              "y": 218
            }
          ],
          "lines": [
            {
              "x1": 535,
              "y1": 237,
              "x2": 546,
              "y2": 256
            },
            {
              "x1": 535,
              "y1": 237,
              "x2": 524,
              "y2": 218
            }
          ]
        },
        {
          "rect": {
            "x": 544,
            "y": 350
          },
          "isStartPoint": false,
          "isZigzag": false,
          "circles": [
            {
              "x": 539,
              "y": 358
            },
            {
              "x": 549,
              "y": 342
            }
          ],
          "lines": [
            {
              "x1": 544,
              "y1": 350,
              "x2": 539,
              "y2": 358
            },
            {
              "x1": 544,
              "y1": 350,
              "x2": 549,
              "y2": 342
            }
          ]
        },
        {
          "rect": {
            "x": 495,
            "y": 355
          },
          "isStartPoint": false,
          "isZigzag": false,
          "circles": [],
          "lines": []
        },
        {
          "rect": {
            "x": 431,
            "y": 408
          },
          "isStartPoint": false,
          "isZigzag": true,
          "circles": [
            {
              "x": 477,
              "y": 345
            },
            {
              "x": 489,
              "y": 370
            }
          ],
          "lines": [
            {
              "x1": 431,
              "y1": 408,
              "x2": 477,
              "y2": 345
            },
            {
              "x1": 431,
              "y1": 408,
              "x2": 489,
              "y2": 370
            }
          ]
        }
      ],
      segments: [
        {
          "start": {
            "x": 461,
            "y": 354
          },
          "end": {
            "x": 252,
            "y": 355
          },
          "controlPoint1": {
            "x": 416,
            "y": 354
          },
          "controlPoint2": {
            "x": 264,
            "y": 374
          }
        },
        {
          "start": {
            "x": 252,
            "y": 355
          },
          "end": {
            "x": 252,
            "y": 246
          },
          "controlPoint1": {
            "x": 240,
            "y": 336
          },
          "controlPoint2": {
            "x": 229,
            "y": 260
          }
        },
        {
          "start": {
            "x": 252,
            "y": 246
          },
          "end": {
            "x": 535,
            "y": 237
          },
          "controlPoint1": {
            "x": 275,
            "y": 232
          },
          "controlPoint2": {
            "x": 524,
            "y": 218
          }
        },
        {
          "start": {
            "x": 535,
            "y": 237
          },
          "end": {
            "x": 544,
            "y": 350
          },
          "controlPoint1": {
            "x": 546,
            "y": 256
          },
          "controlPoint2": {
            "x": 549,
            "y": 342
          }
        },
        {
          "start": {
            "x": 544,
            "y": 350
          },
          "end": {
            "x": 495,
            "y": 355
          },
          "controlPoint1": {
            "x": 539,
            "y": 358
          },
          "controlPoint2": {
            "x": 495,
            "y": 355
          }
        },
        {
          "start": {
            "x": 495,
            "y": 355
          },
          "end": {
            "x": 431,
            "y": 408
          },
          "controlPoint1": {
            "x": 495,
            "y": 355
          },
          "controlPoint2": {
            "x": 489,
            "y": 370
          }
        },
        {
          "start": {
            "x": 431,
            "y": 408
          },
          "end": {
            "x": 461,
            "y": 354
          },
          "controlPoint1": {
            "x": 477,
            "y": 345
          },
          "controlPoint2": {
            "x": 461,
            "y": 354
          }
        }
      ],
      isAutoCreate: true
    }
  }
  polygons.value.push(template[isSelectedBubbleType.value])

  // Create Old Bounding Box
  isShowBoundingBox.value = true
  createBoundingBox();
  calcSegmentBoudingBox();

  // Move polygon to new position
  let elVal = virtualRectangleElement.value.getBoundingClientRect()
  const boundingEl = workspace.value.getBoundingClientRect()
  const newCenterPoint = {
    x: elVal.left + ((elVal.right - elVal.left) / 2) - boundingEl.left,
    y: elVal.top + ((elVal.bottom - elVal.top) / 2) - boundingEl.top,
  };
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
  isShowBoundingBox.value = false
  virtualRectangleElement.value.style.opacity = 0
  virtualRectangleElement.value.style.width = 0
  virtualRectangleElement.value.style.height = 0
  isStageEnded.value[targetPolygon.value] = true
  targetPolygon.value = null
  createNewPolygon.value = true
};
const handleMouseUp = () => {
  if (isStageStarted.value) document.addEventListener("mousemove", stageMoved);
  document.removeEventListener("mousemove", curveStarted);
  document.removeEventListener("mousemove", moveAnAnchorPoint);
  document.removeEventListener("mousemove", moveAPolygon);
  document.removeEventListener("mousemove", resizeBoundingBox);
  document.removeEventListener("mousemove", moveAController);
  clearTimeout(mouseDownEvent.value);
  clearTimeout(mousePressEvent.value);
  isMousePress.value = false;
  isMoveAnAnchorPoint.value = false;
  isMoveAController.value = false;
  editOneController.value = false;
  handlerIndex.value = null;
  isAltPress.value = false
  isStageMove.value = false

  const isAutoCreate = polygons.value[targetPolygon.value]?.isAutoCreate
  if (!(isAutoCreate && onDrawSpeechBubble.value)) {
    updateNewPosition();
  } else {
    updateAutoPosition()
  }
  if (!isStageEnded.value[targetPolygon.value] || polygons.value[targetPolygon.value].nodes[0].isZigzag) return
  if (polygons.value[targetPolygon.value].nodes[0].circles[1] === polygons.value[targetPolygon.value].nodes[0].rect) {
    polygons.value[targetPolygon.value].nodes[0].isZigzag = true
  } else {
    polygons.value[targetPolygon.value].nodes[0].isZigzag = false
  }
};
const handleMouseDown = (event: MouseEvent) => {
  if (!onPenTool.value) return;
  if (!isStageEnded.value[targetPolygon.value] || !onDirectSelectionTool.value)
    stageStarted(event);
  mouseDownEvent.value = setTimeout(() => {
    isMousePress.value = true;
    document.addEventListener("mousemove", curveStarted);
    document.addEventListener("keydown", (event: MouseEvent) => {
      if (event.key === KEY_BOARD.ALT) {
        isAltPress.value = true
        if (!targetPoint.value &&  polygons.value[targetPolygon.value].nodes.length > 1) return
        polygons.value[targetPolygon.value].nodes[targetPoint.value].isZigzag = true
      }
    });
  }, 150);
};
const handleMouseDownNode = (event: MouseEvent, polygonId: number, nodeId: number) => {
  if (!onDirectSelectionTool.value) return;
  nodeIndex.value = nodeId;
  polygonIndex.value = polygonId;
  mouseDownEvent.value = setTimeout(() => {
    isMousePress.value = true;
    isMoveAnAnchorPoint.value = true;
    document.addEventListener("mousemove", moveAnAnchorPoint);
  }, 150);
};
const handleMouseDownPolygon = () => {
  if (!onSelectionTool.value || targetPolygon.value == null) return;
  isMoveAPolygon.value = true;
  mousePressEvent.value = setTimeout(() => {
    isMousePress.value = true;
    document.addEventListener("mousemove", moveAPolygon);
  }, 150);
};
const handleMouseDownBoundingBox = (event: MouseEvent, handlerId: number) => {
  if (!onSelectionTool.value) return;
  handlerIndex.value = handlerId;
  mouseDownEvent.value = setTimeout(() => {
    isMousePress.value = true;
    document.addEventListener("mousemove", resizeBoundingBox);
  }, 150);
};
const handleMoveControler = (event: MouseEvent, polygonId: number, nodeId: number, circleId: number, isOne?: boolean,) => {
  if (!onDirectSelectionTool.value || targetPolygon.value == null) return;
  if (isOne) editOneController.value = true;
  nodeIndex.value = nodeId;
  polygonIndex.value = polygonId;
  circleIndex.value = circleId;
  mouseDownEvent.value = setTimeout(() => {
    isMousePress.value = true;
    isMoveAController.value = true;
    document.addEventListener("mousemove", moveAController);
  }, 100);
};

/* Drawing
* */
const stageStarted = (e: MouseEvent, isEnd: boolean) => {
  isStageStarted.value = true;
  isDrawing.value = true
  if ((isStageEnded.value[targetPolygon.value]
          && e.target.parentElement.classList.contains("startpoint"))
      || e.target.classList.contains("startpoint")) return;

  if (!isStageEnded.value[targetPolygon.value]) isStageEnded.value[targetPolygon.value] = e.target.parentElement.classList.contains("startpoint") || e.target.classList.contains("startpoint");

  const handler: CommonModule.Point = {
    x: e.offsetX,
    y: e.offsetY,
  };
  const segments = polygons.value[targetPolygon.value]?.segments || []
  const nodes = polygons.value[targetPolygon.value]?.nodes || []
  const polygon = polygons.value[targetPolygon.value] || []

  if (!polygons.value.length || createNewPolygon.value) {
    const firstNode: Node = {
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
  } else if (isEnd) {
    createNewPolygon.value = true;
    nodes.pop()
    segments.pop()
    const fixedNodes = JSON.parse(JSON.stringify(nodes))
    segments.push({
      start: fixedNodes[fixedNodes.length - 1].rect,
      end: nodes[0].rect,
      controlPoint1: fixedNodes[fixedNodes.length - 1].rect,
      controlPoint2: nodes[0].rect,
    });
    nodes[0].isZigzag = true
    isDrawing.value = false
  } else if (!isStageEnded.value[targetPolygon.value]) {
    targetPoint.value += 1;
    const node: Node = {
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
    if (nodes?.length > 1) {
      const controlPoint1 = nodes[targetPoint.value - 1].circles.length
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
    segments[targetPoint.value] = polygon.pathAbsolute;
    segments[targetPoint.value].controlPoint2 = nodes[0].circles[1] ? nodes[0].circles[1] : nodes[0].rect;
    segments[targetPoint.value].end = segments[0].start;
    isDrawing.value = false
  }
  targetPolygon.value = polygons.value.length - 1;
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

  if (isStageEnded.value[targetPolygon.value]) targetPoint.value = 0;
  const mainPoint: CommonModule.Point = polygons.value[polygons.value.length - 1].nodes[targetPoint.value].rect;
  let controlPoint2: CommonModule.Point = {};
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

  if (isAltPress.value && !targetPoint.value) polygons.value[polygons.value.length - 1].nodes[0].isZigzag = true
  if (!polygons.value[polygons.value.length - 1].nodes[targetPoint.value].isZigzag) {
    polygons.value[polygons.value.length - 1].nodes[targetPoint.value].circles = [controlPoint1, controlPoint2];
    polygons.value[polygons.value.length - 1].nodes[targetPoint.value].lines = [line1, line2];
  } else if (polygons.value[polygons.value.length - 1].nodes.length > 1 && targetPoint.value === 0) {
    polygons.value[polygons.value.length - 1].nodes[targetPoint.value].circles[1] = controlPoint2
    polygons.value[polygons.value.length - 1].nodes[targetPoint.value].lines[1] = line2
    polygons.value[targetPolygon.value].segments[polygons.value[targetPolygon.value].segments.length - 1].controlPoint2 = controlPoint2;
  } else {
    polygons.value[polygons.value.length - 1].nodes[targetPoint.value].circles[0] = controlPoint1
    polygons.value[polygons.value.length - 1].nodes[targetPoint.value].lines[0] = line1
  }

  if (polygons.value[targetPolygon.value].nodes?.length > 1 && targetPoint.value > 0) {
    polygons.value[targetPolygon.value].segments[targetPoint.value - 1].controlPoint2 = polygons.value[targetPolygon.value].nodes[targetPoint.value].circles[1];
  } else if (polygons.value[targetPolygon.value].nodes?.length > 1 && !polygons.value[polygons.value.length - 1].nodes[targetPoint.value].isZigzag && !targetPoint.value) {
    polygons.value[targetPolygon.value].segments[0].controlPoint1 = controlPoint1
    polygons.value[targetPolygon.value].segments[polygons.value[targetPolygon.value].segments.length - 1].controlPoint2 = controlPoint2;
  }
};
const stageMoved = (e: MouseEvent) => {
  if (isStageEnded.value[targetPolygon.value] || targetPoint.value === null || !polygons.value.length) return;
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

  const path = {
    start: {x: startPoint.x, y: startPoint.y},
    end: {x: newPoint.x, y: newPoint.y},
    controlPoint1,
    controlPoint2,
  };
  polygons.value[polygons.value.length - 1].pathAbsolute = path;
};
const activePolygon = (i: number) => {
  if (!onDirectSelectionTool.value && !onSelectionTool.value) return;
  targetPolygon.value = i;
  polygonIndex.value = i
  createBoundingBox()
  calcSegmentBoudingBox();
};
const createBoundingBox = () => {
  let points: CommonModule.MinMax[] = [];
  boundingBox.value.handlers = [];
  polygons.value[targetPolygon.value].segments.forEach((segment) => {
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
  const newPosition: CommonModule.Point = {
    x: e.offsetX,
    y: e.offsetY,
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
  const isAutoCreate = polygons.value[targetPolygon.value]?.isAutoCreate
  if (!(isAutoCreate && onDrawSpeechBubble.value)) resizePolygon();
  else autoResizePolygon();
};
const resizePolygon = () => {
  let points: CommonModule.MinMax[] = [];
  polygons.value[targetPolygon.value].segments.forEach((segment) => {
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
  const translatedNodes = polygons.value[targetPolygon.value].nodes.map(
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
  const fixedNodes = [].concat(polygons.value[targetPolygon.value].nodes);
  polygons.value[targetPolygon.value].nodes = scaledNodes.map((node, i) => {
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
const updateNewPosition = () => {
  if (!fixedPolygonPosition.value.spaceX && !fixedPolygonPosition.value.spaceY || !polygons.value[targetPolygon.value]) return;
  isMoveAPolygon.value = false;
  fixedPolygonPosition.value.x = 0;
  fixedPolygonPosition.value.y = 0;
  polygons.value[targetPolygon.value].nodes.forEach((node) => {
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

  polygons.value[targetPolygon.value].segments.forEach((s, i) => {
    if (i === polygons.value[targetPolygon.value].segments?.length - 1) {
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

  polygons.value[targetPolygon.value].nodes.forEach((node) => {
    if (!node.lines || !node.lines[0]) return;
    if (node.rect.x !== node.lines[0].x1) node.rect.x = node.lines[0].x1;
    if (node.rect.y !== node.lines[0].y1) node.rect.y = node.lines[0].y1;
  });
  const polygon: HTMLElement = document.getElementById(
      `polygon-${targetPolygon.value}`,
  );
  if (!polygon) return;
  polygon.style.transform = "translate(0px, 0px)";
  boundingElement.value.style.transform = "translate(0px, 0px)";
};
const updateSegments = (node: CommonModule.Point, nodeIndex: number, fixedNodes: Node[]) => {
  const newPosition = {x: node.x, y: node.y,};
  const segments = polygons.value[polygonIndex.value].segments
  const nodes = polygons.value[polygonIndex.value].nodes
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

/* Speech Draw
* */
const updateAutoPosition = () => {
  if (!fixedPolygonPosition.value.spaceX && !fixedPolygonPosition.value.spaceY || !polygons.value[targetPolygon.value]) return;
  isMoveAPolygon.value = false;
  fixedPolygonPosition.value.x = 0;
  fixedPolygonPosition.value.y = 0;
  polygons.value[targetPolygon.value].nodes.forEach((node) => {
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

  polygons.value[targetPolygon.value].segments.forEach((s, i) => {
    if (i === polygons.value[targetPolygon.value].segments?.length - 1) {
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

  polygons.value[targetPolygon.value].nodes.forEach((node) => {
    if (!node.lines || !node.lines[0]) return;
    if (node.rect.x !== node.lines[0].x1) node.rect.x = node.lines[0].x1;
    if (node.rect.y !== node.lines[0].y1) node.rect.y = node.lines[0].y1;
  });
  const polygon: HTMLElement = document.getElementById(
      `polygon-${targetPolygon.value}`,
  );
  if (!polygon) return;
  polygon.style.transform = "translate(0px, 0px)";
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
const preventMouseOut = () => {
  if (!onPenTool.value) document.removeEventListener('mouseup', handleMouseUpOutsideWindow)
  nextTick(() => {
    if (pathAbsolute.value && pathAbsolute.value[0]) pathAbsolute.value[0].style.opacity = 0
    if (isStageMove.value) {
      document.addEventListener('mouseup', handleMouseUpOutsideWindow)
      const targetNode = document.getElementById(`anchorPoint-${targetPolygon.value}-${targetPoint.value}`)
      if (!targetNode) return
      targetNode.childNodes.forEach(node => {
        if (node.tagName === 'line' || node.tagName === 'circle') node.style.opacity = 0
      })
    }
  })
}
const preventMouseOver = () => {
  if (!onPenTool.value) document.removeEventListener('mouseup', handleMouseUpOutsideWindow)
  nextTick(() => {
    document.removeEventListener('mouseup', handleMouseUpOutsideWindow)
    if (pathAbsolute.value && pathAbsolute.value[0]) pathAbsolute.value[0].style.opacity = 1
    const targetNode = document.getElementById(`anchorPoint-${targetPolygon.value}-${targetPoint.value}`)
    if (!targetNode) return
    targetNode.childNodes.forEach(node => {
      if (node.tagName === 'line' || node.tagName === 'circle') node.style.opacity = 1
    })
  })
}
/* Move
* */
const moveAController = (e: MouseEvent) => {
  const newPosition = {
    x: e.offsetX,
    y: e.offsetY,
  };
  const nodes = polygons.value[polygonIndex.value].nodes
  const segments = polygons.value[polygonIndex.value].segments
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
const moveAnAnchorPoint = (e: MouseEvent) => {
  const newPosition = {
    x: e.offsetX,
    y: e.offsetY,
  };
  const nodes = polygons.value[polygonIndex.value].nodes
  const segments = polygons.value[polygonIndex.value].segments
  const numberController = nodes[nodeIndex.value].lines.length
  if (
      nodes[nodeIndex.value].lines &&
      nodes[nodeIndex.value].lines.length &&
      nodes[nodeIndex.value].circles &&
      nodes[nodeIndex.value].circles.length
  ) {
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
const moveAPolygon = (e: any) => {
  if (e.target.matches('svg')) return;
  fixedPolygonPosition.value.spaceX = 0;
  fixedPolygonPosition.value.spaceY = 0;
  let pointerPosition: CommonModule.Point = {
    x: e.offsetX,
    y: e.offsetY,
  };

  if (fixedPolygonPosition.value.x) fixedPolygonPosition.value.spaceX = pointerPosition.x - fixedPolygonPosition.value.x;
  if (fixedPolygonPosition.value.y) fixedPolygonPosition.value.spaceY = pointerPosition.y - fixedPolygonPosition.value.y;
  if (!fixedPolygonPosition.value.x) fixedPolygonPosition.value.x = pointerPosition.x;
  if (!fixedPolygonPosition.value.y) fixedPolygonPosition.value.y = pointerPosition.y;

  if (!fixedPolygonPosition.value.spaceX && !fixedPolygonPosition.value.spaceY) return;
  const polygon: HTMLElement = document.getElementById(`polygon-${targetPolygon.value}`);
  if (!polygon) return;
  polygon.style.transform = `translate(${fixedPolygonPosition.value.spaceX}px, ${fixedPolygonPosition.value.spaceY}px)`;
  boundingElement.value.style.transform = `translate(${fixedPolygonPosition.value.spaceX}px, ${fixedPolygonPosition.value.spaceY}px)`;
};
const pointToString = (nodes) => {
  return nodes.map((point) => `${point.rect.x},${point.rect.y}`).join(" ");
};
const handleMouseUpOutsideWindow = () => {
  handleMouseUp()
  const segments = polygons.value[targetPolygon.value].segments
  const nodes = polygons.value[targetPolygon.value].nodes
  nodes[targetPoint.value].lines = []
  nodes[targetPoint.value].circles = []
  if (!targetPoint.value && nodes.length > 1) {
    segments[segments.length - 1].controlPoint2 =  segments[segments.length - 1].end
    if (!nodes[0].isZigzag) segments[0].controlPoint1 =  segments[0].start
  } else if (segments.length) {
    segments[targetPoint.value - 1].controlPoint2 = segments[targetPoint.value - 1].end
  }
}
const fillColor = () => {
  if (targetPolygon.value == null) return;
  polygons.value[targetPolygon.value].isFilled = true;
};

const undo = () => {
  if (!onPenTool.value || !polygons.value[targetPolygon.value]) return;
  if (isStageEnded.value[targetPolygon.value]) {
    targetPoint.value = polygons.value[targetPolygon.value].nodes.length - 1
    if (polygons.value[targetPolygon.value].segments) polygons.value[targetPolygon.value].segments.pop();
    if (polygons.value[targetPolygon.value].nodes[0].circles) polygons.value[targetPolygon.value].nodes[0].circles.pop()
    if (polygons.value[targetPolygon.value].nodes[0].lines) polygons.value[targetPolygon.value].nodes[0].lines.pop()
    isStageEnded.value[targetPolygon.value] = false
    createNewPolygon.value = false
  } else {
    if (polygons.value[targetPolygon.value].nodes) {
      polygons.value[targetPolygon.value].nodes.pop();
      targetPoint.value--;
    }
    if (polygons.value[targetPolygon.value].segments) polygons.value[targetPolygon.value].segments.pop();
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
  document.addEventListener("keydown", (event: MouseEvent) => {
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
  if (!polygons.value.length || !polygons.value[targetPolygon.value]) return;
  polygons.value.splice(targetPolygon.value, 1);
  isStageEnded.value.splice(targetPolygon.value, 1);
  boundingBox.value.handlers = [];
  isStageStarted.value = true;
  targetPolygon.value--;
};
/*
/*
* Watch */
watch(isStageStarted, (val) => {
  if (val) {
    document.addEventListener("dblclick", ($event) => {
      if (!onPenTool.value) return
      isStageEnded.value[targetPolygon.value] = true;
      stageStarted($event, true);
    });
  }
});

watch(onDirectSelectionTool, (val) => {
  if (val) {
    targetPolygon.value = null;
    isStageStarted.value = false;
  }
});
watch(onPenTool, (val) => {
  if (val) {
    imgContainerElement.value.classList.add("stageStarted");
  } else {
    document.removeEventListener('mouseup', handleMouseUpOutsideWindow)
    imgContainerElement.value.classList.remove("stageStarted");
    document.removeEventListener("mousemove", stageMoved)
    targetPolygon.value = null;
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
