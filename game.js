const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let frames = 0;
let score = 0;
let best = 0;
let gameState = 0; // 0: ready, 1: playing, 2: game over

// Bird properties
const bird = {
  x: 60,
  y: 150,
  w: 34,
  h: 24,
  gravity: 0.25,
  lift: -4.6,
  velocity: 0,
  draw() {
    ctx.fillStyle = "#FFD700";
    ctx.fillRect(this.x, this.y, this.w, this.h);
  },
  flap() {
    this.velocity = this.lift;
  },
  update() {
    this.velocity += this.gravity;
    this.y += this.velocity;
    if (this.y + this.h > canvas.height) {
      this.y = canvas.height - this.h;
      gameState = 2;
    }
    if (this.y < 0) {
      this.y = 0;
      this.velocity = 0;
    }
  },
  reset() {
    this.y = 150;
    this.velocity = 0;
  }
};

// Pipe properties
const pipes = [];
function resetPipes() {
  pipes.length = 0;
  pipes.push({ x: canvas.width, h: randomHeight() });
}
function randomHeight() {
  return Math.floor(Math.random() * 200) + 50;
}
function addPipe() {
  pipes.push({ x: canvas.width, h: randomHeight() });
}
function updatePipes() {
  for (let i = 0; i < pipes.length; i++) {
    pipes[i].x -= 2;
    // Add new pipe
    if (pipes[i].x === 160) {
      addPipe();
    }
    // Remove pipe off screen
    if (pipes[i].x + 52 < 0) {
      pipes.shift();
      score++;
      if (score > best) best = score;
    }
  }
}
function drawPipes() {
  ctx.fillStyle = "#228B22";
  for (let i = 0; i < pipes.length; i++) {
    // Top pipe
    ctx.fillRect(pipes[i].x, 0, 52, pipes[i].h);
    // Bottom pipe
    ctx.fillRect(pipes[i].x, pipes[i].h + 100, 52, canvas.height - pipes[i].h - 100);
  }
}
function checkCollision() {
  for (let i = 0; i < pipes.length; i++) {
    // Bird and pipe collision
    if (
      bird.x < pipes[i].x + 52 &&
      bird.x + bird.w > pipes[i].x &&
      (bird.y < pipes[i].h ||
        bird.y + bird.h > pipes[i].h + 100)
    ) {
      gameState = 2;
    }
  }
}

// Draw score and messages
function drawScore() {
  ctx.fillStyle = "#fff";
  ctx.font = "30px Arial";
  ctx.fillText(`Score: ${score}`, 10, 40);
  ctx.font = "16px Arial";
  ctx.fillText(`Best: ${best}`, 10, 60);
}

// Main game loop
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  bird.draw();
  drawPipes();
  drawScore();

  if (gameState === 0) {
    ctx.fillStyle = "#fff";
    ctx.font = "24px Arial";
    ctx.fillText("Press SPACE or click to start", 30, canvas.height / 2);
  }
  if (gameState === 2) {
    ctx.fillStyle = "#fff";
    ctx.font = "30px Arial";
    ctx.fillText("GAME OVER", 80, canvas.height / 2 - 20);
    ctx.font = "20px Arial";
    ctx.fillText("Press SPACE or click to restart", 30, canvas.height / 2 + 20);
  }
}

function update() {
  if (gameState === 1) {
    bird.update();
    updatePipes();
    checkCollision();
  }
}

function loop() {
  update();
  draw();
  frames++;
  requestAnimationFrame(loop);
}

// Controls
document.addEventListener('keydown', function(e) {
  if (e.code === 'Space') {
    if (gameState === 0) {
      gameState = 1;
      score = 0;
      bird.reset();
      resetPipes();
    } else if (gameState === 1) {
      bird.flap();
    } else if (gameState === 2) {
      gameState = 0;
      score = 0;
      bird.reset();
      resetPipes();
    }
  }
});
canvas.addEventListener('mousedown', function() {
  if (gameState === 0) {
    gameState = 1;
    score = 0;
    bird.reset();
    resetPipes();
  } else if (gameState === 1) {
    bird.flap();
  } else if (gameState === 2) {
    gameState = 0;
    score = 0;
    bird.reset();
    resetPipes();
  }
});

// Start game
resetPipes();
loop();
