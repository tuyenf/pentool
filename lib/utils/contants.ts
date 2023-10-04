export const enum KEY_BOARD {
  BACK_SPACE = "Backspace",
  DELETE = "Delete",
  ALT = "Alt",
}
export const COLOR_TYPES = {
  DEFAULT: 'default',
  COLORS: 'colors',
  PICKER: 'picker',
}

export const FILL_TYPES = {
  COLOR: 'color',
  GRADIENT: 'gradient',
  DEFAULT: 'none',
}
export const GRADIENT_DEFAULT = {
  points: [
    {
      "left": 0,
      "red": 0,
      "green": 0,
      "blue": 0,
      "alpha": 1
    },
    {
      "left": 0,
      "red": 0,
      "green": 0,
      "blue": 0,
      "alpha": 1
    },
    {
      "left": 100,
      "red": 0,
      "green": 0,
      "blue": 0,
      "alpha": 0
    },
    {
      "left": 100,
      "red": 0,
      "green": 0,
      "blue": 0,
      "alpha": 1
    }
  ],
  type: "linear",
  degree: 90,
  style: "linear-gradient(90deg,rgba(0, 0, 0, 1) 0%,rgba(0, 0, 0, 1) 0%,rgba(0, 0, 0, 0) 100%,rgba(0, 0, 0, 1) 100%)"
}

export const GRADIENT_TYPE = {
  LINEAR: 'linear',
  RADIAL: 'radial'
}
export const BUBBLE_TEMPLATES = [
  {
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
    name: "Bubble 1",
    colors: {
      fill: {
        style: '#ffffff40',
        isGradient: false,
        type: GRADIENT_DEFAULT.type,
        degree: GRADIENT_DEFAULT.degree,
        points: GRADIENT_DEFAULT.points
      },
      stroke: {
        style: '#4e7fff',
        isGradient: false,
        type: GRADIENT_DEFAULT.type,
        degree: GRADIENT_DEFAULT.degree,
        points: GRADIENT_DEFAULT.points
      }
    }
  },
  {
    nodes: [
      {
        "rect": {
          "x": 518,
          "y": 299
        },
        "isStartPoint": true,
        "isZigzag": false,
        "circles": [
          {
            "x": 520,
            "y": 392
          },
          {
            "x": 516,
            "y": 206
          }
        ],
        "lines": [
          {
            "x1": 518,
            "y1": 299,
            "x2": 520,
            "y2": 392
          },
          {
            "x1": 518,
            "y1": 299,
            "x2": 516,
            "y2": 206
          }
        ]
      },
      {
        "rect": {
          "x": 688,
          "y": 363
        },
        "isStartPoint": false,
        "isZigzag": false,
        "circles": [
          {
            "x": 729,
            "y": 349
          },
          {
            "x": 647,
            "y": 377
          }
        ],
        "lines": [
          {
            "x1": 688,
            "y1": 363,
            "x2": 729,
            "y2": 349
          },
          {
            "x1": 688,
            "y1": 363,
            "x2": 647,
            "y2": 377
          }
        ]
      },
      {
        "rect": {
          "x": 666,
          "y": 419
        },
        "isStartPoint": false,
        "isZigzag": true,
        "circles": [
          {
            "x": 762,
            "y": 388
          },
          {
            "x": 708,
            "y": 409
          }
        ],
        "lines": [
          {
            "x1": 666,
            "y1": 419,
            "x2": 762,
            "y2": 388
          },
          {
            "x1": 666,
            "y1": 419,
            "x2": 708,
            "y2": 409
          }
        ]
      },
      {
        "rect": {
          "x": 759,
          "y": 249
        },
        "isStartPoint": false,
        "isZigzag": false,
        "circles": [
          {
            "x": 722,
            "y": 200
          },
          {
            "x": 796,
            "y": 298
          }
        ],
        "lines": [
          {
            "x1": 759,
            "y1": 249,
            "x2": 722,
            "y2": 200
          },
          {
            "x1": 759,
            "y1": 249,
            "x2": 796,
            "y2": 298
          }
        ]
      }
    ],
    segments: [
      {
        "start": {
          "x": 518,
          "y": 299
        },
        "end": {
          "x": 688,
          "y": 363
        },
        "controlPoint1": {
          "x": 520,
          "y": 392
        },
        "controlPoint2": {
          "x": 647,
          "y": 377
        }
      },
      {
        "start": {
          "x": 688,
          "y": 363
        },
        "end": {
          "x": 666,
          "y": 419
        },
        "controlPoint1": {
          "x": 729,
          "y": 349
        },
        "controlPoint2": {
          "x": 708,
          "y": 409
        }
      },
      {
        "start": {
          "x": 666,
          "y": 419
        },
        "end": {
          "x": 759,
          "y": 249
        },
        "controlPoint1": {
          "x": 762,
          "y": 388
        },
        "controlPoint2": {
          "x": 796,
          "y": 298
        }
      },
      {
        "start": {
          "x": 759,
          "y": 249
        },
        "end": {
          "x": 518,
          "y": 299
        },
        "controlPoint1": {
          "x": 722,
          "y": 200
        },
        "controlPoint2": {
          "x": 516,
          "y": 206
        }
      }
    ],
    name: "Bubble 2",
    colors: {
      fill: {
        style: '#ffffff40',
        isGradient: false,
        type: GRADIENT_DEFAULT.type,
        degree: GRADIENT_DEFAULT.degree,
        points: GRADIENT_DEFAULT.points
      },
      stroke: {
        style: '#4e7fff',
        isGradient: false,
        type: GRADIENT_DEFAULT.type,
        degree: GRADIENT_DEFAULT.degree,
        points: GRADIENT_DEFAULT.points
      }
    }
  },
  {
    nodes: [
      {
        "rect": {
          "x": 281,
          "y": 148
        },
        "isStartPoint": true,
        "isZigzag": true,
        "circles": [
          {
            "x": 257,
            "y": 202
          },
          {
            "x": 246,
            "y": 121
          }
        ],
        "lines": [
          {
            "x1": 281,
            "y1": 148,
            "x2": 257,
            "y2": 202
          },
          {
            "x1": 281,
            "y1": 148,
            "x2": 246,
            "y2": 121
          }
        ]
      },
      {
        "rect": {
          "x": 334,
          "y": 212
        },
        "isStartPoint": false,
        "isZigzag": true,
        "circles": [
          {
            "x": 323,
            "y": 282
          },
          {
            "x": 298,
            "y": 233
          }
        ],
        "lines": [
          {
            "x1": 334,
            "y1": 212,
            "x2": 323,
            "y2": 282
          },
          {
            "x1": 334,
            "y1": 212,
            "x2": 298,
            "y2": 233
          }
        ]
      },
      {
        "rect": {
          "x": 435,
          "y": 247
        },
        "isStartPoint": false,
        "isZigzag": true,
        "circles": [
          {
            "x": 469,
            "y": 291
          },
          {
            "x": 414,
            "y": 270
          }
        ],
        "lines": [
          {
            "x1": 435,
            "y1": 247,
            "x2": 469,
            "y2": 291
          },
          {
            "x1": 435,
            "y1": 247,
            "x2": 414,
            "y2": 270
          }
        ]
      },
      {
        "rect": {
          "x": 532,
          "y": 200
        },
        "isStartPoint": false,
        "isZigzag": true,
        "circles": [
          {
            "x": 584,
            "y": 222
          },
          {
            "x": 534,
            "y": 234
          }
        ],
        "lines": [
          {
            "x1": 532,
            "y1": 200,
            "x2": 584,
            "y2": 222
          },
          {
            "x1": 532,
            "y1": 200,
            "x2": 534,
            "y2": 234
          }
        ]
      },
      {
        "rect": {
          "x": 543,
          "y": 91
        },
        "isStartPoint": false,
        "isZigzag": true,
        "circles": [
          {
            "x": 565,
            "y": 39
          },
          {
            "x": 615,
            "y": 102
          }
        ],
        "lines": [
          {
            "x1": 543,
            "y1": 91,
            "x2": 565,
            "y2": 39
          },
          {
            "x1": 543,
            "y1": 91,
            "x2": 615,
            "y2": 102
          }
        ]
      },
      {
        "rect": {
          "x": 447,
          "y": 57
        },
        "isStartPoint": false,
        "isZigzag": true,
        "circles": [
          {
            "x": 425,
            "y": 15
          },
          {
            "x": 475,
            "y": 19
          }
        ],
        "lines": [
          {
            "x1": 447,
            "y1": 57,
            "x2": 425,
            "y2": 15
          },
          {
            "x1": 447,
            "y1": 57,
            "x2": 475,
            "y2": 19
          }
        ]
      },
      {
        "rect": {
          "x": 349,
          "y": 74
        },
        "isStartPoint": false,
        "isZigzag": true,
        "circles": [
          {
            "x": 291,
            "y": 60
          },
          {
            "x": 335,
            "y": 27
          }
        ],
        "lines": [
          {
            "x1": 349,
            "y1": 74,
            "x2": 291,
            "y2": 60
          },
          {
            "x1": 349,
            "y1": 74,
            "x2": 335,
            "y2": 27
          }
        ]
      }
    ],
    segments: [
      {
        "start": {
          "x": 281,
          "y": 148
        },
        "end": {
          "x": 334,
          "y": 212
        },
        "controlPoint1": {
          "x": 257,
          "y": 202
        },
        "controlPoint2": {
          "x": 298,
          "y": 233
        }
      },
      {
        "start": {
          "x": 334,
          "y": 212
        },
        "end": {
          "x": 435,
          "y": 247
        },
        "controlPoint1": {
          "x": 323,
          "y": 282
        },
        "controlPoint2": {
          "x": 414,
          "y": 270
        }
      },
      {
        "start": {
          "x": 435,
          "y": 247
        },
        "end": {
          "x": 532,
          "y": 200
        },
        "controlPoint1": {
          "x": 469,
          "y": 291
        },
        "controlPoint2": {
          "x": 534,
          "y": 234
        }
      },
      {
        "start": {
          "x": 532,
          "y": 200
        },
        "end": {
          "x": 543,
          "y": 91
        },
        "controlPoint1": {
          "x": 584,
          "y": 222
        },
        "controlPoint2": {
          "x": 615,
          "y": 102
        }
      },
      {
        "start": {
          "x": 543,
          "y": 91
        },
        "end": {
          "x": 447,
          "y": 57
        },
        "controlPoint1": {
          "x": 565,
          "y": 39
        },
        "controlPoint2": {
          "x": 475,
          "y": 19
        }
      },
      {
        "start": {
          "x": 447,
          "y": 57
        },
        "end": {
          "x": 349,
          "y": 74
        },
        "controlPoint1": {
          "x": 425,
          "y": 15
        },
        "controlPoint2": {
          "x": 335,
          "y": 27
        }
      },
      {
        "start": {
          "x": 349,
          "y": 74
        },
        "end": {
          "x": 281,
          "y": 148
        },
        "controlPoint1": {
          "x": 291,
          "y": 60
        },
        "controlPoint2": {
          "x": 246,
          "y": 121
        }
      }
    ],
    name: "Bubble 3",
    colors: {
      fill: {
        style: '#ffffff40',
        isGradient: false,
        type: GRADIENT_DEFAULT.type,
        degree: GRADIENT_DEFAULT.degree,
        points: GRADIENT_DEFAULT.points
      },
      stroke: {
        style: '#4e7fff',
        isGradient: false,
        type: GRADIENT_DEFAULT.type,
        degree: GRADIENT_DEFAULT.degree,
        points: GRADIENT_DEFAULT.points
      }
    }
  },
  {
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
    name: "Bubble 3",
    colors: {
      fill: {
        style: '#ffffff40',
        isGradient: false,
        type: GRADIENT_DEFAULT.type,
        degree: GRADIENT_DEFAULT.degree,
        points: GRADIENT_DEFAULT.points
      },
      stroke: {
        style: '#4e7fff',
        isGradient: false,
        type: GRADIENT_DEFAULT.type,
        degree: GRADIENT_DEFAULT.degree,
        points: GRADIENT_DEFAULT.points
      }
    }
  }
]