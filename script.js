const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const resetBtn = document.querySelector("#resetBtn");

const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = "white";
const snakeColor = "lightgreen";
const snakeBorder = "black";
const foodColor = "red";
const unitSize = 25;

let running = false;
let xVelocity = unitSize;
let yVelocity = 0;
let foodX;
let foodY;
let score = 0;

let snake = [
  { x: unitSize * 8, y: 0 },
  { x: unitSize * 7, y: 0 },
  { x: unitSize * 6, y: 0 },
  { x: unitSize * 5, y: 0 },
  { x: unitSize * 4, y: 0 },
  { x: unitSize * 3, y: 0 },
  { x: unitSize * 2, y: 0 },
  { x: unitSize, y: 0 },
  { x: 0, y: 0 },
];

window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", resetGame);

gameStart();

function gameStart() {
  running = true;
  scoreText.textContent = score;
  createFood();
  drawFood();
  nextTick();
}

function nextTick() {
  if (running) {
    setTimeout(() => {
      clearBoard();
      drawFood();
      moveSnake();
      drawSnake();
      checkGameover();
      nextTick();
    }, 140);
  } else {
    displayGameOver();
  }
}

function clearBoard() {
  ctx.fillStyle = boardBackground;
  ctx.fillRect(0, 0, gameWidth, gameHeight);
}

function createFood() {
  function randomFood(min, max) {
    return Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
  }
  foodX = randomFood(0, gameWidth - unitSize);
  foodY = randomFood(0, gameHeight - unitSize);
}

function drawFood() {
  ctx.fillStyle = foodColor;
  ctx.fillRect(foodX, foodY, unitSize, unitSize);
}

function moveSnake() {
  const head = { x: snake[0].x + xVelocity, y: snake[0].y + yVelocity };
  snake.unshift(head);

  if (snake[0].x === foodX && snake[0].y === foodY) {
    score++;
    scoreText.textContent = score;
    createFood();
  } else {
    snake.pop();
  }
}

function drawSnake() {
  snake.forEach((snakePart, index) => {

    if (index === 0) {
      ctx.fillStyle = "limegreen";
      ctx.beginPath();
      ctx.arc(
        snakePart.x + unitSize / 2,
        snakePart.y + unitSize / 2,
        unitSize / 2,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // 👀 Eyes direction logic
      ctx.fillStyle = "black";
      let eyeOffsetX = 0;
      let eyeOffsetY = 0;

      if (xVelocity > 0) { // Right
        eyeOffsetX = 6; eyeOffsetY = -5;
      } 
      else if (xVelocity < 0) { // Left
        eyeOffsetX = -6; eyeOffsetY = -5;
      } 
      else if (yVelocity > 0) { // Down
        eyeOffsetX = -5; eyeOffsetY = 6;
      } 
      else if (yVelocity < 0) { // Up
        eyeOffsetX = -5; eyeOffsetY = -6;
      }

      // Left Eye
      ctx.beginPath();
      ctx.arc(
        snakePart.x + unitSize / 2 + eyeOffsetX,
        snakePart.y + unitSize / 2 + eyeOffsetY,
        2,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Right Eye
      ctx.beginPath();
      ctx.arc(
        snakePart.x + unitSize / 2 - eyeOffsetX,
        snakePart.y + unitSize / 2 + eyeOffsetY,
        2,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    // 🧩 BODY
    else {
      ctx.fillStyle = "green";
      ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
      ctx.strokeStyle = "darkgreen";
      ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
    }
  });
}

function changeDirection(event) {
  const keyPressed = event.keyCode;
  const LEFT = 37;
  const RIGHT = 39;
  const UP = 38;
  const DOWN = 40;

  const goingUp = yVelocity === -unitSize;
  const goingDown = yVelocity === unitSize;
  const goingRight = xVelocity === unitSize;
  const goingLeft = xVelocity === -unitSize;
  console.log(keyPressed)

  switch (true) {
    case keyPressed === LEFT && !goingRight:
      xVelocity = -unitSize;
      yVelocity = 0;
      break;

    case keyPressed === UP && !goingDown:
      xVelocity = 0;
      yVelocity = -unitSize;
      break;

    case keyPressed === RIGHT && !goingLeft:
      xVelocity = unitSize;
      yVelocity = 0;
      break;

    case keyPressed === DOWN && !goingUp:
      xVelocity = 0;
      yVelocity = unitSize;
      break;
  }
}

function checkGameover() {
  switch (true) {
    case snake[0].x < 0:
    case snake[0].x >= gameWidth:
    case snake[0].y < 0:
    case snake[0].y >= gameHeight:
      running = false;
  }

  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      running = false;
    }
  }
}

function displayGameOver() {
  ctx.font = "50px Verdana";
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.fillText("GAME OVER!", gameWidth / 2, gameHeight / 2);
  running = false;
}

function resetGame() {
  score = 0;
  xVelocity = unitSize;
  yVelocity = 0;

  snake = [
    { x: unitSize * 4, y: 0 },
    { x: unitSize * 3, y: 0 },
    { x: unitSize * 2, y: 0 },
    { x: unitSize, y: 0 },
    { x: 0, y: 0 },
  ];

  gameStart();
}
