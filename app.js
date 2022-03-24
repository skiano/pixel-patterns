const scale = window.devicePixelRatio; // Change to 1 on retina screens to see blurry canvas.
const canvasWrapElm = document.getElementById('canvas-wrap');

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d', { alpha: false });
ctx.scale(scale, scale); // Normalize coordinate system to use css pixels.
canvasWrapElm.appendChild(canvas);

let READY = true;
const STATE = new Proxy({
  canvas: {},
  cursor: null,
  background: [0, 0, 0, 1],
}, {
  set(o, k, v) {
    if (o[k] !== v) {
      o[k] = v;
      if (READY) {
        READY = false;
        requestAnimationFrame(loop);
      }
    }
  },
});

// function setCharAt(str,index,chr) {
//   if(index > str.length-1) return str;
//   return str.substring(0,index) + chr + str.substring(index+1);
// }


const BRICK = 'BRICK';
const HALF_DROP = 'HALF_DROP';
const FULL_DROP = 'FULL_DROP';

const pattern = {
  background: null,
  colors: {
    A: null,
    B: null,
    C: null,
  },
  layers: [
    {
      size: 20,
      mode: BRICK,
      fill: 'A........BC.......D......DDDD......',
    }
  ]
}

let offset;


function loop() {
  const { width, height } = canvas;

  const imageData = ctx.getImageData(0, 0, width, height);
  const { data } = imageData;

  let pxSize = 15;

  let blockSize = 10;

  let currentX = STATE.cursor && Math.floor(STATE.cursor.x / pxSize);
  let currentY = STATE.cursor && Math.floor(STATE.cursor.y / pxSize);

  let p = 0;
  for (let i = 0; i < data.length; i += 4) {

    let x = p % width;
    let y = Math.floor(p / width);

    let px = Math.floor(x / pxSize);
    let py = Math.floor(y / pxSize);

    const oddBlock = (Math.floor(px / blockSize) % 2 === 0) === (Math.floor(py / blockSize) % 2 === 0);

    if (STATE.cursor && (currentX % blockSize === px % blockSize && currentY % blockSize === py % blockSize)) {
      data[i] = 0;
      data[i + 1] = 55;
      data[i + 2] = 250;
    } else {
      const c = (px % 2 === 0) === (py % 2 === 0)
        ? (oddBlock ? 250 : 230)
        : (oddBlock ? 240 : 220);

      data[i] = c;
      data[i + 1] = c;
      data[i + 2] = c;
    }

    p++;
  }

  ctx.putImageData(imageData, 0, 0);

  READY = true;
}

function resizeCanvas() {
  const { clientWidth, clientHeight } = canvasWrapElm;
  canvas.width = clientWidth;
  canvas.height = clientHeight;
  STATE.canvas = {
    width: clientWidth,
    height: clientHeight
  };
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas, false);

function trackCursor(e) {
  STATE.cursor = { x: e.layerX, y: e.layerY };
};

canvas.addEventListener('mouseenter', (e) => {
  canvas.addEventListener('mousemove', trackCursor);
});

canvas.addEventListener('mouseleave', (e) => {
  STATE.cursor = null;
  canvas.removeEventListener('mousemove', trackCursor);
});

