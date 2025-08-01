const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const tileSize = 40;
const rows = 15;
const cols = 20;

const textures = {};
const keys = {};

const player = {
  x: 5,
  y: 5,
  vx: 0,
  vy: 0,
  width: 1,
  height: 2,
  grounded: false
};

const world = [];
for (let y = 0; y < rows; y++) {
  world[y] = [];
  for (let x = 0; x < cols; x++) {
    if (y > 11) world[y][x] = "stone";
    else if (y > 9) world[y][x] = "dirt";
    else if (y === 9) world[y][x] = "grass";
    else world[y][x] = null;
  }
}

const cow = { x: 10, y: 7 };

function loadImages(callback) {
  const names = ["grass", "dirt", "stone", "wood", "cow"];
  let loaded = 0;
  for (const name of names) {
    textures[name] = new Image();
    textures[name].src = `assets/${name}.png`;
    textures[name].onload = () => {
      if (++loaded === names.length) callback();
    };
  }
}

function drawTile(name, x, y) {
  if (textures[name])
    ctx.drawImage(textures[name], x * tileSize, y * tileSize, tileSize, tileSize);
}

function drawPlayer() {
  ctx.fillStyle = "black";
  ctx.fillRect(player.x * tileSize, player.y * tileSize, player.width * tileSize, player.height * tileSize);
}

function drawWorld() {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const block = world[y][x];
      if (block) drawTile(block, x, y);
    }
  }
  drawTile("cow", cow.x, cow.y);
}

function updatePhysics() {
  player.vy += 0.2; // gravity
  player.grounded = false;

  let nextX = player.x + player.vx;
  let nextY = player.y + player.vy;

  if (collides(nextX, player.y)) player.vx = 0;
  else player.x = nextX;

  if (collides(player.x, nextY)) {
    if (player.vy > 0) player.grounded = true;
    player.vy = 0;
  } else {
    player.y = nextY;
  }
}

function collides(x, y) {
  const minX = Math.floor(x);
  const minY = Math.floor(y + player.height);
  return world[minY] && world[minY][minX];
}

function handleInput() {
  player.vx = 0;
  if (keys["ArrowLeft"]) player.vx = -0.15;
  if (keys["ArrowRight"]) player.vx = 0.15;
  if (keys["Space"] && player.grounded) {
    player.vy = -0.5;
  }
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  handleInput();
  updatePhysics();
  drawWorld();
  drawPlayer();
  requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

loadImages(gameLoop);
