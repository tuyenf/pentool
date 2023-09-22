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
    segments: Segment[];
    nodes: Node[];
    pathAbsolute?: Segment;
    coordinates?: string;
    isFilled?: boolean;
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
}
