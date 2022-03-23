const canvasWrapElm = document.getElementById('canvas-wrap');

const STATE = {
  backgroundColor: '',
};

console.log(canvasWrapElm);

const scale = window.devicePixelRatio; // Change to 1 on retina screens to see blurry canvas.
const canvas = document.createElement('canvas');

canvas.width = canvasWrapElm.clientWidth;
canvas.height = canvasWrapElm.clientHeight - 3;
const ctx = canvas.getContext('2d', { alpha: false });
ctx.scale(scale, scale); // Normalize coordinate system to use css pixels.

canvasWrapElm.appendChild(canvas);


let offset;

function loop() {
  const { width, height } = canvas;

  const imageData = ctx.getImageData(0, 0, width, height);
  const { data } = imageData;


  let p = 0;
  for (let i = 0; i < data.length; i += 4) {

    let x = p % width;
    let y = Math.floor(p / width);

    const c = (Math.floor(x / 15) % 2 === 0) === (Math.floor(y / 15) % 2 === 0)
      ? 240
      : 230;

    data[i] = c;
    data[i + 1] = c;
    data[i + 2] = c;

    p++;
  }

  ctx.putImageData(imageData, 0, 0);
  
  // requestAnimationFrame(loop);
}

loop();

