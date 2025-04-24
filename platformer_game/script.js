// At the top of your script.js file
const images = {
  player: new Image(),
  platform: new Image(),
  checkpoint: new Image()
};

// Set the source for each image
images.player.src = './player-sprite.png';
images.platform.src = './platform-sprite.png';
images.checkpoint.src = './checkpoint-sprite.png';

// Track loading progress
let imagesLoaded = 0;
const totalImages = Object.keys(images).length;

// Function to handle image loading
function imageLoaded() {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
      // All images loaded, now we can start the game
      startBtn.disabled = false; // Enable the start button
  }
}

// Add load event listeners to all images
Object.values(images).forEach(img => {
  img.addEventListener('load', imageLoaded);
});

const startBtn = document.getElementById("start-btn");
const canvas = document.getElementById("canvas");
const startScreen = document.querySelector(".start-screen");
const checkpointScreen = document.querySelector(".checkpoint-screen");
const checkpointMessage = document.querySelector(".checkpoint-screen > p");
const mobileControls = document.getElementById("mobile-controls");
const leftControl = document.getElementById("left-control");
const rightControl = document.getElementById("right-control");
const ctx = canvas.getContext("2d");

// Mobile detection
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Touch control variables
let touchStartX = 0;
let touchStartY = 0;
let isTouchingLeft = false;
let isTouchingRight = false;
let isJumping = false;

canvas.width = innerWidth;
canvas.height = innerHeight;

const gravity = 0.5;
let isCheckpointCollisionDetectionActive = true;

const proportionalSize = (size) => {
  return innerHeight < 500 ? Math.ceil((size / 500) * innerHeight) : size;
};

class Player {
  constructor() {
      this.position = {
          x: proportionalSize(10),
          y: proportionalSize(400),
      };
      this.velocity = {
          x: 0,
          y: 0,
      };
      this.width = proportionalSize(80);
      this.height = proportionalSize(80);
  }

  draw() {
      ctx.drawImage(
          images.player,
          this.position.x,
          this.position.y,
          this.width,
          this.height
      );
  }

  update() {
      this.draw();
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
      if (this.position.y + this.height + this.velocity.y <= canvas.height) {
          if (this.position.y < 0) {
              this.position.y = 0;
              this.velocity.y = gravity;
          }
          this.velocity.y += gravity;
      } else {
          this.velocity.y = 0;
      }

      if (this.position.x < this.width) {
          this.position.x = this.width;
      }

      if (this.position.x >= canvas.width - this.width * 2) {
          this.position.x = canvas.width - this.width * 2;
      }
  }
}

class Platform {
  constructor(x, y) {
      this.position = {
          x,
          y,
      };
      this.width = 300;
      this.height = proportionalSize(40);
  }

  draw() {
      ctx.drawImage(
          images.platform,
          this.position.x,
          this.position.y,
          this.width,
          this.height
      );
  }
}

class CheckPoint {
  constructor(x, y, z) {
      this.position = {
          x,
          y,
      };
      this.width = proportionalSize(60);
      this.height = proportionalSize(90);
      this.claimed = false;
  }

  draw() {
      if (!this.claimed) {
          // Only draw if not claimed
          ctx.drawImage(
              images.checkpoint,
              this.position.x,
              this.position.y,
              this.width,
              this.height
          );
      }
  }

  claim() {
      this.width = 0;
      this.height = 0;
      this.position.y = Infinity;
      this.claimed = true;
  }
}

const player = new Player();

const platformPositions = [
  { x: 500, y: proportionalSize(450) },
  { x: 700, y: proportionalSize(400) },
  { x: 850, y: proportionalSize(350) },
  { x: 900, y: proportionalSize(350) },
  { x: 1050, y: proportionalSize(150) },
  { x: 2500, y: proportionalSize(450) },
  { x: 2900, y: proportionalSize(400) },
  { x: 3150, y: proportionalSize(350) },
  { x: 3900, y: proportionalSize(450) },
  { x: 4200, y: proportionalSize(400) },
  { x: 4400, y: proportionalSize(200) },
  { x: 4700, y: proportionalSize(150) },
];

const platforms = platformPositions.map(
  (platform) => new Platform(platform.x, platform.y)
);

const checkpointPositions = [
  { x: 1170, y: proportionalSize(80), z: 1 },
  { x: 2900, y: proportionalSize(330), z: 2 },
  { x: 4800, y: proportionalSize(80), z: 3 },
];

const checkpoints = checkpointPositions.map(
  (checkpoint) => new CheckPoint(checkpoint.x, checkpoint.y, checkpoint.z)
);

const animate = () => {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  platforms.forEach((platform) => {
      platform.draw();
  });

  checkpoints.forEach(checkpoint => {
      checkpoint.draw();
  });

  player.update();

  // Handle movement based on keys or touch
  if ((keys.rightKey.pressed || isTouchingRight) && player.position.x < proportionalSize(400)) {
      player.velocity.x = 5;
  } else if ((keys.leftKey.pressed || isTouchingLeft) && player.position.x > proportionalSize(100)) {
      player.velocity.x = -5;
  } else {
      player.velocity.x = 0;

      if ((keys.rightKey.pressed || isTouchingRight) && isCheckpointCollisionDetectionActive) {
          platforms.forEach((platform) => {
              platform.position.x -= 5;
          });
          checkpoints.forEach((checkpoint) => {
              checkpoint.position.x -= 5;
          });
      } else if ((keys.leftKey.pressed || isTouchingLeft) && isCheckpointCollisionDetectionActive) {
          platforms.forEach((platform) => {
              platform.position.x += 5;
          });
          checkpoints.forEach((checkpoint) => {
              checkpoint.position.x += 5;
          });
      }
  }

  platforms.forEach((platform) => {
      // AABB collision detection
      const collision =
          player.position.x < platform.position.x + platform.width &&
          player.position.x + player.width > platform.position.x &&
          player.position.y < platform.position.y + platform.height &&
          player.position.y + player.height > platform.position.y;

      if (collision) {
          // Determine which side was hit based on velocity and previous position
          // Top collision (landing on platform)
          if (player.velocity.y > 0 &&
              player.position.y + player.height - player.velocity.y <= platform.position.y) {
              player.position.y = platform.position.y - player.height;
              player.velocity.y = 0;
          }
          // Bottom collision (hitting platform from below)
          else if (player.velocity.y < 0 &&
              player.position.y >= platform.position.y + platform.height) {
              player.position.y = platform.position.y + platform.height;
              player.velocity.y = gravity;
          }
          // Left collision
          else if (player.velocity.x > 0 &&
              player.position.x + player.width - player.velocity.x <= platform.position.x) {
              player.position.x = platform.position.x - player.width;
          }
          // Right collision
          else if (player.velocity.x < 0 &&
              player.position.x >= platform.position.x + platform.width) {
              player.position.x = platform.position.x + platform.width;
          }
      }
  });

  checkpoints.forEach((checkpoint, index, checkpoints) => {
      // AABB collision detection for checkpoints
      const checkpointCollision =
          player.position.x < checkpoint.position.x + checkpoint.width &&
          player.position.x + player.width > checkpoint.position.x &&
          player.position.y < checkpoint.position.y + checkpoint.height &&
          player.position.y + player.height > checkpoint.position.y;

      // Additional game logic conditions
      const gameLogicConditions =
          isCheckpointCollisionDetectionActive &&
          (index === 0 || checkpoints[index - 1].claimed === true);

      if (checkpointCollision && gameLogicConditions) {
          checkpoint.claim();
          if (index === checkpoints.length - 1) {
              isCheckpointCollisionDetectionActive = false;
              showCheckpointScreen("Ивона го лапна последното куре!");
              movePlayer("ArrowRight", 0, false);
          } else {
              showCheckpointScreen("Лапнавте куре!");
          }
      }
  });
};

const keys = {
  rightKey: {
      pressed: false
  },
  leftKey: {
      pressed: false
  }
};

const movePlayer = (key, xVelocity, isPressed) => {
  if (!isCheckpointCollisionDetectionActive) {
      player.velocity.x = 0;
      player.velocity.y = 0;
      return;
  }

  switch (key) {
      case "ArrowLeft":
          keys.leftKey.pressed = isPressed;
          if (xVelocity === 0) {
              player.velocity.x = xVelocity;
          }
          player.velocity.x -= xVelocity;
          break;
      case "ArrowUp":
      case " ":
      case "Spacebar":
      case "Jump":
          if (player.velocity.y === 0) { // Only jump if on ground
              player.velocity.y -= 8;
          }
          break;
      case "ArrowRight":
          keys.rightKey.pressed = isPressed;
          if (xVelocity === 0) {
              player.velocity.x = xVelocity;
          }
          player.velocity.x += xVelocity;
          break;
  }
};

const startGame = () => {
  canvas.style.display = "block";
  startScreen.style.display = "none";
  
  // Show mobile controls if on mobile device
  if (isMobile) {
      mobileControls.style.display = "block";
  }
  
  animate();
};

const showCheckpointScreen = (msg) => {
  checkpointScreen.style.display = "block";
  checkpointMessage.textContent = msg;
  if (isCheckpointCollisionDetectionActive) {
      setTimeout(() => (checkpointScreen.style.display = "none"), 2000);
  }
};

// Touch event handlers
function handleTouchStart(e) {
  e.preventDefault();
  const touch = e.touches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
  
  // Determine which half of the screen was touched
  if (touch.target === leftControl) {
      isTouchingLeft = true;
  } else if (touch.target === rightControl) {
      isTouchingRight = true;
      movePlayer("Jump", 0, true);
  }
}

function handleTouchMove(e) {
  e.preventDefault();
  // Not needed for this simple control scheme
}

function handleTouchEnd(e) {
  e.preventDefault();
  if (e.target === leftControl || (e.changedTouches && e.changedTouches[0].target === leftControl)) {
      isTouchingLeft = false;
  } else if (e.target === rightControl || (e.changedTouches && e.changedTouches[0].target === rightControl)) {
      isTouchingRight = false;
  }
}

// Window resize handler
function handleResize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

// Event listeners
startBtn.addEventListener("click", startGame);

window.addEventListener("keydown", ({ key }) => {
  movePlayer(key, 8, true);
});

window.addEventListener("keyup", ({ key }) => {
  movePlayer(key, 0, false);
});

// Add touch event listeners for mobile
if (isMobile) {
  leftControl.addEventListener("touchstart", handleTouchStart, { passive: false });
  leftControl.addEventListener("touchend", handleTouchEnd, { passive: false });
  
  rightControl.addEventListener("touchstart", handleTouchStart, { passive: false });
  rightControl.addEventListener("touchend", handleTouchEnd, { passive: false });
}

// Handle window resize
window.addEventListener("resize", handleResize);
