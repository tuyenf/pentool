import {b} from "vite-node/types-516036fa";

declare namespace CommonModule {
  interface Point {
    x: number;
    y: number;
  }

  interface Line {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
  }

  interface Node {
    rect: Point;
    circles: Point[];
    lines: Line[];
    isStartPoint?: boolean;
    isZigzag?: boolean;
  }

  interface Segment {
    start: Point;
    end: Point;
    controlPoint1: Point;
    controlPoint2: Point;
  }

  interface BoundingBoxSegment {
    start: Point;
    end: Point;
  }
  interface Polygon {
    path: string;
    segments: Segment[];
    nodes: Node[];
    pathAbsolute?: Segment;
    coordinates?: string;
    backgroundColor: string,
    strokeColor: string,
    isGradientBackground: boolean,
    isGradientStroke: boolean
  }

  interface BoundingBox {
    handlers: Point[];
    segments: BoundingBoxSegment[];
  }

  interface MinMax {
    min: Point;
    max: Point;
  }

  interface BoundingClientRect {
    x: number;
    y: number;
    width: number;
    height: number;
    top: number;
    right: number;
    bottom: number;
    left: number;
  }

  interface BubbleType {
    nodes: Node[],
    segments: Segment[],
    name: string;
  }

  interface MovementLimit {
    minX?: number;
    maxX?: number;
    minY?: number;
    maxY?: number;
  }
  interface VirtualRectangle {
    top: number,
    left: number,
    width: number,
    height: number
  }
  interface Limit {
    minX: number,
    maxX: number,
    minY: number
    maxY: number
  }
  interface SelectedBubbleType {
    type: number,
    isManual: boolean
  }
  interface ColorPickerResponse {
    hex: string
    hsv: {
      a: number
      h: number
      s: number
      v: number
    }
  }
  interface RecentColor {
    degree?: number;
    points?: [IPoitItem];
    style?: string;
    type?: string;
    color?: string,
    isBackground?: boolean,
  }


  interface SelectedColor {
    color: string;
    isGradient: boolean
  }
}
