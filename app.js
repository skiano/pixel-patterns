const canvasWrapElm = document.getElementById('canvas-wrap');

const STATE = {
  backgroundColor: '',
};

console.log(canvasWrapElm);

const scale = window.devicePixelRatio; // Change to 1 on retina screens to see blurry canvas.
const canvas = document.createElement('canvas');

canvas.width = canvasWrapElm.clientWidth;
canvas.height = canvasWrapElm.clientHeight;
const ctx = canvas.getContext('2d', { alpha: false });
ctx.scale(scale, scale); // Normalize coordinate system to use css pixels.

canvasWrapElm.appendChild(canvas);

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

function loop(cursorX, cursorY) {
  const { width, height } = canvas;

  const imageData = ctx.getImageData(0, 0, width, height);
  const { data } = imageData;

  let pxSize = 18;

  let currentX = Math.floor(cursorX / pxSize);
  let currentY = Math.floor(cursorY / pxSize);

  let p = 0;
  for (let i = 0; i < data.length; i += 4) {

    let x = p % width;
    let y = Math.floor(p / width);

    let px = Math.floor(x / pxSize);
    let py = Math.floor(y / pxSize);


    if (false && (x % pxSize === 0 || y % pxSize === 0)) {
      data[i] = 200;
      data[i + 1] = 200;
      data[i + 2] = 200;
    } else {
      
      const isTarget = currentX % 10 === px % 10 && currentY % 10 === py % 10;

      const c = (px % 2 === 0) === (py % 2 === 0)
        ? 250
        : 240;

      data[i] = c;
      data[i + 1] = isTarget ? 0 : c;
      data[i + 2] = c;
    }

    p++;
  }

  ctx.putImageData(imageData, 0, 0);
  
  // requestAnimationFrame(loop);
}

loop();

canvas.addEventListener('mousemove', (e) => {
  loop(e.layerX, e.layerY);
});

