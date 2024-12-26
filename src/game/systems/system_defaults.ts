const canvas_height = 1080;
const canvas_width = 1920;

const playerRediculeColor = "fuchsia";
const playerRediculeRadius = 10;
const playerRediculeWidth = 5;
const playerHeight = 100;
const playerWidth = 100;
const playerMovementControls = {
  ArrowLeft: 'left',
  a: 'left',
  A: 'left',
  ArrowRight: 'right',
  d: 'right',
  D: 'right',
  ArrowUp: 'up',
  w: 'up',
  W: 'up',
  ArrowDown: 'down',
  s: 'down',
  S: 'down',
};

const bulletColor = "rgb(255, 0, 255)";
const bulletRadius = 10;
const bulletSpeed = 50;

const enemyRadius = 50;
const enemySpeed = 7;
const enemySpawnTime = 1_500;
const enemySpawnCoordinates = [
  {
    x: enemyRadius * 2,
    y: enemyRadius * 2
  },
  {
    x: enemyRadius * 2,
    y: canvas_height - (enemyRadius * 2),
  },
  {
    x: canvas_width - (enemyRadius * 2),
    y: enemyRadius * 2
  },
  {
    x: canvas_width - (enemyRadius * 2),
    y: canvas_height - (enemyRadius * 2),
  },
];

export const CANVAS_DEFAULTS = {
  height: canvas_height,
  width: canvas_width
}

export const PLAYER_SETTINGS = {
  height: playerHeight,
  width: playerWidth,
  redicule_color: playerRediculeColor,
  redicule_radius: playerRediculeRadius,
  redicule_width: playerRediculeWidth,
  controls: playerMovementControls
}

export const BULLET_SETTINGS = {
  color: bulletColor,
  radius: bulletRadius,
  speed: bulletSpeed,
}

export const ENEMY_SETTINGS = {
  colors: [
    "red",
    "orange",
    "yellow",
    "green",
    "cyan",
    "blue",
    "indigo",
    "purple"
  ],
  polygon_width: 10,
  radius: enemyRadius,
  speed: enemySpeed,
  spawn_coordinates: enemySpawnCoordinates,
  spawn_time: enemySpawnTime,
}