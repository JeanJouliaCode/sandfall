var image = document.getElementById("box");
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

window.devicePixelRatio = 2;

var img = new Image();
//img.src = './box.png';
img.src = './Capture.png';

imageWidth = 75
imageHeight = 100

imageX = 75
imageY = 20

ctx.drawImage(img, imageX, imageY, imageWidth, imageHeight);

var width = 200
var height = 150

// var width = 20
// var height = 20

var activePixel = []


//matrix to avoid double check active pixel
var matrix = [];
for (var i = 0; i < height; i++) {
  matrix[i] = new Array(width);
}

// for (var x = 0; x < 10; x++) {
//   for (var y = 0; y < 10; y++) {
//     ctx.fillStyle = "rgba(" + Math.floor(Math.random() * 200) + ", " + Math.floor(Math.random() * 200) + ", " + Math.floor(Math.random() * 200) + ", 255)";
//     ctx.fillRect(x + 5, y + 10, 1, 1);
//     if (x == 0 || x == 9 || y == 0) {
//       activePixel.push({ x: x + 5, y: y + 10, active: true })
//     }

//   }
// }

for (var i = 0; i < imageHeight; i++) {
  activePixel.push({ x: imageX, y: imageY + i, active: true })
}

for (var i = 0; i < imageHeight; i++) {
  activePixel.push({ x: imageX + imageWidth - 1, y: imageY + i, active: true })
}


// ctx.getImageData(pixel.x, pixel.y + 1, 1, 1).data
// ctx.clearRect(pixel.x, pixel.y, 1, 1);
// ctx.fillStyle = "rgba(" + data[0] + "," + data[1] + "," + data[2] + "," + data[3] + ")";
// ctx.fillRect(pixel.x, pixel.y, 1, 1);

var fakeRnd = 0

setInterval(() => {
  for (var i = 0; i < activePixel.length; i++) {
    if (activePixel[i].x && activePixel[i].y) {
      pixelFall(activePixel[i])
      //await sleep(100)
    }
  }
  activePixel = activePixel.filter(pixel => !isStable(pixel))
  activePixel = [...activePixel, ...findActivePixel(activePixel)]
}, 1)

function pixelFall(pixel) {
  fakeRnd = (fakeRnd + 1) % 1000

  pixel.old_x = pixel.x
  pixel.old_y = pixel.y

  if (isEmpty(pixel.x, pixel.y + 1) && pixel.y + 1 < height) {
    movePixel(pixel, 0, 1)
  }

  else if (isEmpty(pixel.x - 1, pixel.y + 1) && isEmpty(pixel.x + 1, pixel.y + 1) && pixel.y + 1 < height && pixel.x - 1 < 200 && pixel.x > 0) {
    movePixel(pixel, fakeRnd % 2 == 0 ? 1 : -1, 1)
  }

  else if (isEmpty(pixel.x - 1, pixel.y + 1) && pixel.y + 1 < height && pixel.x - 1 >= 0) {
    movePixel(pixel, -1, 1)
  }

  else if (isEmpty(pixel.x + 1, pixel.y + 1) && pixel.y + 1 < height && pixel.x + 1 < width) {
    movePixel(pixel, 1, 1)
  }
}

function isStable(pixel) {
  return (pixel.y >= height - 1 || (!isEmpty(pixel.x - 1, pixel.y + 1) && !isEmpty(pixel.x, pixel.y + 1) && !isEmpty(pixel.x + 1, pixel.y + 1)))
}

function isEmpty(x, y) {
  return ctx.getImageData(x, y, 1, 1).data[3] == 0
}

function movePixel(pixel, xDirection, yDirection) {
  //copy pixel data
  var dataCpy = ctx.getImageData(pixel.x, pixel.y, 1, 1).data

  //delete pixel
  ctx.clearRect(pixel.x, pixel.y, 1, 1);

  pixel.x += xDirection
  pixel.y += yDirection

  ctx.fillStyle = "rgba(" + dataCpy[0] + "," + dataCpy[1] + "," + dataCpy[2] + "," + dataCpy[3] + ")";
  ctx.fillRect(pixel.x, pixel.y, 1, 1);
}

function findActivePixel(pixels) {
  var posibility = [{ x: -1, y: -1 }, { x: 0, y: -1 }, { x: 1, y: -1 }]
  var pixelsCpy = pixels
  var newPixel = []

  var mat = matrix.map(function (arr) {
    return arr.slice();
  });

  pixelsCpy.forEach(pixel => {
    mat[pixel.y][pixel.x] = 1
  })

  pixelsCpy.forEach(pixel => {
    posibility.forEach(potentialPixel => {
      var x = pixel.old_x + potentialPixel.x
      var y = pixel.old_y + potentialPixel.y
      if (!isEmpty(x, y) && !isStable({ x, y }) && mat[y][x] != 1 && x < height && x >= 0) {
        mat[y][x] = 1
        newPixel.push({ x, y })
      }
    })
  })
  return newPixel
}

function colorPixel(x, y, color) {
  ctx.fillStyle = color// "rgba(100,100,0,255)"
  ctx.fillRect(x, y, 1, 1);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
