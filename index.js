const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let circleDiameter = 10;

const initCanvas = aspectRatio => {
  const noScrollbarOffset = 3;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  if (canvas.width / canvas.height > aspectRatio) {
    canvas.width -= canvas.width - canvas.height * aspectRatio;
  } else if (canvas.width / canvas.height < aspectRatio) {
    console.log(canvas.height - canvas.width * aspectRatio);
    canvas.height -= canvas.height - canvas.width / aspectRatio;
  }

  canvas.width -= noScrollbarOffset;
  canvas.height -= noScrollbarOffset;
};

const getImgData = img => {
  const imgDataCanvas = document.getElementById("js-canvas-img-data");
  const imgDataCanvasCtx = imgDataCanvas.getContext("2d");
  imgDataCanvas.width = img.width;
  imgDataCanvas.height = img.height;
  imgDataCanvasCtx.drawImage(img, 0, 0);
  return imgDataCanvasCtx.getImageData(
    0,
    0,
    imgDataCanvas.width,
    imgDataCanvas.height
  );
};

const getAvgLightness = (imgData, x, y, width, height) => {
  let sum = 0;
  for (let i = y; i < y + height; i++) {
    for (let j = x; j < x + width; j++) {
      for (let k = 0; k < 4; k++) {
        sum += imgData.data[4 * i * imgData.width + j * 4 + k];
      }
    }
  }
  return sum / (width * height * 4);
};

const displayImage = () => {
  const img = document.getElementById("js-selected-img");
  initCanvas(img.width / img.height);
  const imgData = getImgData(img);
  const scale = {
    x: imgData.width / canvas.width,
    y: imgData.height / canvas.height
  };
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  for (let x = 0; x < canvas.width - circleDiameter; x += circleDiameter) {
    for (let y = 0; y < canvas.height - circleDiameter; y += circleDiameter) {
      const lightness = getAvgLightness(
        imgData,
        Math.floor(x * scale.x),
        Math.floor(y * scale.y),
        Math.floor(circleDiameter * scale.x),
        Math.floor(circleDiameter * scale.y)
      );
      const radius = (lightness / 255) * (circleDiameter / 2);
      ctx.beginPath();
      ctx.arc(
        x + circleDiameter / 2,
        y + circleDiameter / 2,
        radius,
        0,
        2 * Math.PI
      );
      ctx.fill();
    }
  }
};

displayImage();
