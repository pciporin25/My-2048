var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");

var sizeInput = document.getElementById('size');
var changeSize = document.getElementById('change-size');
var scoreLabel = document.getElementById('score');

var score = 0;
var size = 4;
var width = canvas.width / size - 6;

var cells = [];
var fontSize;
var loss = false;

changeSize.onclick = function() {
  if (sizeInput.value >=2 && sizeInput.value<=20) {
    size = sizeInput.value;
    width = canvas.width/size - 6;
    canvasClear();
    startGame();
  }
}

function canvasClear() {
  ctx.clearRect(0,0,500,500);
  loss = false;
  canvas.style.opacity = "1.0";
}

var image = new Image();
image.src = "./opera-house.jpg"
var pattern;
image.onload = function () {
  pattern = ctx.createPattern(this, "no-repeat");
  startGame();
}

function startGame() {
  createCells();
  drawAllCells();
  pasteNewCell();
  pasteNewCell();
}

function cell(row, col) {
  this.value = 0;
  this.x = col * width + 5 * (col + 1);
  this.y = row * width + 5 * (row + 1);
}

function createCells() {
  for (var i=0; i<size; i++){
    cells[i] = [];
    for (var j=0; j<size; j++) {
      cells[i][j] = new cell(i,j);
    }
  }
}

function drawCell(cell) {
  ctx.beginPath();
  ctx.rect(cell.x, cell.y, width, width);

  switch(cell.value) {
    case 0 : ctx.fillStyle = pattern; break;
    case 2 : ctx.fillStyle = "#FF0051"; break;
    case 4 : ctx.fillStyle = "#FF00AB"; break;
    case 8 : ctx.fillStyle = "#EB00FF"; break;
    case 16 : ctx.fillStyle = "#6600FF"; break;
    case 32 : ctx.fillStyle = "#001EFF"; break;
    case 64 : ctx.fillStyle = "#009EFF"; break;
    case 128 : ctx.fillStyle = "#00F7FF"; break;
    case 256 : ctx.fillStyle = "#00FFA2"; break;
    case 512 : ctx.fillStyle = "#00FF4D"; break;
    case 1024 : ctx.fillStyle = "#ABFF00"; break;
    case 2048 : ctx.fillStyle = "#FCFF00"; break;
    case 4096 : ctx.fillStyle = "#FF9A00"; break;
    default : ctx.fillStyle = "#FFFFFF";
  }

  ctx.fill();
  if (cell.value) {
    fontSize = width/2;
    ctx.font = fontSize + "px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(cell.value, cell.x + width / 2, cell.y + width / 2);
  }
}

function drawAllCells() {
  for (var i=0; i<size; i++) {
    for (var j=0; j<size; j++) {
      drawCell(cells[i][j]);
    }
  }
}

function pasteNewCell() {
  var countFree = 0;
  for (var i=0; i<size; i++) {
    for (var j=0; j<size; j++) {
      if(!cells[i][j].value) {
        countFree++;
      }
    }
  }

  if(!countFree) {
    finishGame();
    return;
  }

  while (true) {
    var row = Math.floor(Math.random()*size);
    var col = Math.floor(Math.random()*size);
    if(!cells[row][col].value) {
      cells[row][col].value = 2 * Math.ceil(Math.random() * 2);
      drawAllCells();
      return;
    }
  }
}


document.onkeydown = function(event) {
  if (!loss) {
    if (event.keyCode == 38 || event.keyCode == 87) moveUp();
    else if (event.keyCode == 39 || event.keyCode == 68) moveRight();
    else if (event.keyCode == 40 || event.keyCode == 83) moveDown();
    else if (event.keyCode == 37 || event.keyCode == 65) moveLeft();
    scoreLabel.innerHTML = "Score : " + score;
  }
}


function moveUp() {
  for (var j=0; j<size; j++) {
    for (var i=1; i<size; i++) {
      if (cells[i][j].value) {
        var row = i;
        while (row>0) {
          //if nothing above, move tile up
          if(!cells[row - 1][j].value) {
            cells[row - 1][j].value = cells[row][j].value;
            cells[row][j].value = 0;
            row--;
          }
          //if equal to cell above, merge cells
          else if(cells[row-1][j].value == cells[row][j].value) {
            cells[row - 1][j].value*=2;
            score+=cells[row-1][j].value;
            cells[row][j].value = 0;
            break;
          }
          else break;
        }
      }
    }
  }
  pasteNewCell();
}

function moveRight() {
  for (var i=0; i<size; i++) {
    for (var j=size-2; j>=0; j--) {
      if (cells[i][j].value) {
        var col = j;
        while (col + 1 < size) {
          //if nothing above, move tile up
          if(!cells[i][col + 1].value) {
            cells[i][col + 1].value = cells[i][col].value;
            cells[i][col].value = 0;
            col++;
          }
          //if equal to cell above, merge cells
          else if(cells[i][col].value == cells[i][col + 1].value) {
            cells[i][col + 1].value*=2;
            score+=cells[i][col + 1].value;
            cells[i][col].value = 0;
            break;
          }
          else break;
        }
      }
    }
  }
  pasteNewCell();
}

function moveDown() {
  for (var j=0; j<size; j++) {
    for (var i=size-2; i>=0; i--) {
      if (cells[i][j].value) {
        var row = i;
        while (row+1 < size) {
          //if nothing above, move tile up
          if(!cells[row + 1][j].value) {
            cells[row + 1][j].value = cells[row][j].value;
            cells[row][j].value = 0;
            row++;
          }
          //if equal to cell above, merge cells
          else if(cells[row+1][j].value == cells[row][j].value) {
            cells[row + 1][j].value*=2;
            score+=cells[row+1][j].value;
            cells[row][j].value = 0;
            break;
          }
          else break;
        }
      }
    }
  }
  pasteNewCell();
}

function moveLeft() {
  for (var i=0; i<size; i++) {
    for (var j=1; j<size; j++) {
      if (cells[i][j].value) {
        var col = j;
        while (col-1>=0) {
          //if nothing above, move tile up
          if(!cells[i][col - 1].value) {
            cells[i][col - 1].value = cells[i][col].value;
            cells[i][col].value = 0;
            col--;
          }
          //if equal to cell above, merge cells
          else if(cells[i][col].value == cells[i][col - 1].value) {
            cells[i][col - 1].value*=2;
            score+=cells[i][col - 1].value;
            cells[i][col].value = 0;
            break;
          }
          else break;
        }
      }
    }
  }
  pasteNewCell();
}

function finishGame() {
  canvas.style.opacity = "0.5";
  loss = true;
}
