export const enum KEY_BOARD {
  BACK_SPACE = "Backspace",
  DELETE = "Delete",
  ALT = "Alt",
}
export const BUBBLE_TYPES = ["Bubble 1", "Bubble 2", "Bubble 3", "Bubble 4"];
export const BUBBLE_TEMPLATES = {
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