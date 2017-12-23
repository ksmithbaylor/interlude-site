// Code adapted from https://medium.com/@francoisromain/smooth-a-svg-path-with-cubic-bezier-curves-e37b49d46c74

const line = (pointA, pointB) => {
  const lengthX = pointB[0] - pointA[0];
  const lengthY = pointB[1] - pointA[1];

  return {
    length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
    angle: Math.atan2(lengthY, lengthX)
  };
};

const controlPoint = (lineCalc, smooth) => (
  current,
  previous,
  next,
  reverse
) => {
  const p = previous ? previous : current;
  const n = next ? next : current;
  const l = lineCalc(p, n);
  const angle = l.angle + (reverse ? Math.PI : 0);
  const length = l.length * smooth;
  const x = current[0] + Math.cos(angle) * length;
  const y = current[1] + Math.sin(angle) * length;

  return [x, y];
};

const bezierCommand = controlPointCalc => (point, i, a) => {
  const [cpsX, cpsY] = controlPointCalc(a[i - 1], a[i - 2], point);
  const [cpeX, cpeY] = controlPointCalc(point, a[i - 1], a[i + 1], true);

  return `C ${cpsX},${cpsY} ${cpeX},${cpeY} ${point[0]},${point[1]}`;
};

const svgPath = (points, command) =>
  points.reduce(
    (acc, point, i, a) =>
      i === 0 ? `M ${point[0]},${point[1]}` : `${acc} ${command(point, i, a)}`,
    ''
  );

const smoothing = 0.2;

const controlPointCalc = controlPoint(line, smoothing);
const bezierCommandCalc = bezierCommand(controlPointCalc);

const points = [
  [119, 77],
  [122, 83],
  [132, 85],
  [142, 84],
  [145, 83],
  [150, 79],
  [152, 74],
  [151, 69],
  [147, 66],
  [142, 65],
  [136, 66],
  [132, 70],
  [131.5, 75],
  [135.5, 77],
  [138, 76.5]
];

const tipPoints = [
  [139.3, 77.2],
  [139.6, 76.5],
  [139.7, 75.7],
  [139.7, 75.4],
  [139.6, 74.6],
  [139.45, 74.2],
  [139.2, 73.9],
  [139.0, 73.75],
  [138.8, 73.6],
  [138.5, 73.5],
  [138.3, 73.45],
  [138.0, 73.4],
  [137.8, 73.4],
  [137.6, 73.4],
  [137.4, 73.5],
  [137.3, 73.6],
  [137.28, 73.65],
  [137.4, 73.75],
  [137.45, 73.8],
  [137.53, 73.9],
  [137.57, 74.1],
  [137.57, 74.3],
  [137.56, 74.5],
  [137.54, 74.6],
  [137.51, 74.8],
  [137.43, 75],
  [137.38, 75.2]
];

const accentColor = 'white';

// Close up on treble: viewBox="100 75 70 20" width="600" height="700"
const svgHTML = `
  <svg viewBox="98 45 283 76" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs>
      <style>
        @import url('https://fonts.googleapis.com/css?family=Rouge+Script');
      </style>
    </defs>
    <text
      x="100"
      y="110"
      font-family="Rouge Script"
      font-size="96"
      fill="${accentColor}"
    >
      I
    </text>
    <text
      x="159"
      y="110"
      font-family="Rouge Script"
      font-size="96"
      fill="white"
    >
      nterlude
    </text>
    <path
      stroke="${accentColor}"
      stroke-width="3"
      stroke-linecap="round"
      fill="none"
      d="${svgPath(points, bezierCommandCalc)}"
    />
    <path
      stroke="${accentColor}"
      stroke-width="0.1"
      stroke-linecap="round"
      fill="${accentColor}"
      d="${svgPath(tipPoints, bezierCommandCalc)} Z"
    />
  </svg>
`;

console.log(svgHTML.trim());
