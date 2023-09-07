export const getMinMaxValue = (
  data: any,
  isMin?: boolean,
  property?: string,
  key?: string,
) => {
  let val = 0;
  if (!key) return;
  if (!property) {
    val = data.reduce((old: any, current: any) => {
      return isMin
        ? current[key] < old
          ? current[key]
          : old
        : current[key] > old
        ? current[key]
        : old;
    }, data[0][key]);
  } else {
    val = data.reduce((old: any, current: any) => {
      return isMin
        ? current[property][key] < old
          ? current[property][key]
          : old
        : current[property][key] > old
        ? current[property][key]
        : old;
    }, data[0][property][key]);
  }
  return val;
};
export const bezierMinMax = (
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number,
) => {
  let tvalues = [],
    xvalues = [],
    yvalues = [],
    a,
    b,
    c,
    t,
    t1,
    t2,
    b2ac,
    sqrtb2ac;
  for (let i = 0; i < 2; ++i) {
    if (i == 0) {
      b = 6 * x0 - 12 * x1 + 6 * x2;
      a = -3 * x0 + 9 * x1 - 9 * x2 + 3 * x3;
      c = 3 * x1 - 3 * x0;
    } else {
      b = 6 * y0 - 12 * y1 + 6 * y2;
      a = -3 * y0 + 9 * y1 - 9 * y2 + 3 * y3;
      c = 3 * y1 - 3 * y0;
    }
    if (Math.abs(a) < 1e-12) {
      if (Math.abs(b) < 1e-12) {
        continue;
      }
      t = -c / b;
      if (0 < t && t < 1) {
        tvalues.push(t);
      }
      continue;
    }
    b2ac = b * b - 4 * c * a;
    if (b2ac < 0) {
      if (Math.abs(b2ac) < 1e-12) {
        t = -b / (2 * a);
        if (0 < t && t < 1) {
          tvalues.push(t);
        }
      }
      continue;
    }
    sqrtb2ac = Math.sqrt(b2ac);
    t1 = (-b + sqrtb2ac) / (2 * a);
    if (0 < t1 && t1 < 1) {
      tvalues.push(t1);
    }
    t2 = (-b - sqrtb2ac) / (2 * a);
    if (0 < t2 && t2 < 1) {
      tvalues.push(t2);
    }
  }

  let j = tvalues.length,
    mt;
  while (j--) {
    t = tvalues[j];
    mt = 1 - t;
    xvalues[j] =
      mt * mt * mt * x0 +
      3 * mt * mt * t * x1 +
      3 * mt * t * t * x2 +
      t * t * t * x3;
    yvalues[j] =
      mt * mt * mt * y0 +
      3 * mt * mt * t * y1 +
      3 * mt * t * t * y2 +
      t * t * t * y3;
  }

  xvalues.push(x0, x3);
  yvalues.push(y0, y3);

  return {
    min: { x: Math.min.apply(0, xvalues), y: Math.min.apply(0, yvalues) },
    max: { x: Math.max.apply(0, xvalues), y: Math.max.apply(0, yvalues) },
  };
};
