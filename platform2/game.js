const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// Set canvas size to fill the screen
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Load images
const playerImg = new Image();
playerImg.src = 'player-sprite.png';
const platformImg = new Image();
platformImg.src = 'platform-sprite.png';
const checkpointImg = new Image();
checkpointImg.src = 'checkpoint-sprite.png';

// Game variables
const gravity = 0.5;
const jumpStrength = -10;
const player = {
    x: 100,
    y: 100,
    width: 50,
    height: 50,
    velocityY: 0,
    velocityX: 0,
    speed: 5,
    jumping: false
};

const keys = {
    left: false,
    right: false,
    up: false
};

// Platforms and checkpoints
const platforms = [];
const checkpoints = [];
const collectedCheckpoints = new Set();

// Generate random platforms
function generatePlatforms() {
    // Add a starting platform under the player
    platforms.push({ x: 50, y: 200, width: 200, height: 20 });
    
    for (let i = 0; i < 100; i++) {
        const x = Math.random() * 5000 + 200; // spread out horizontally
        const y = Math.random() * (canvas.height - 100) + 50; // vertical position
        platforms.push({ x, y, width: 100, height: 20 });
    }
}

// Generate checkpoints near platforms
function generateCheckpoints() {
    for (let i = 0; i < 30; i++) {
        const platform = platforms[Math.floor(Math.random() * platforms.length)];
        const x = platform.x + platform.width / 2 - 15;
        const y = platform.y - 40; // above the platform
        checkpoints.push({ x, y, width: 30, height: 30, collected: false });
    }
}

// Handle input
window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a') keys.left = true;
    if (e.key === 'ArrowRight' || e.key === 'd') keys.right = true;
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === ' ') keys.up = true;
});
window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a') keys.left = false;
    if (e.key === 'ArrowRight' || e.key === 'd') keys.right = false;
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === ' ') keys.up = false;
});

// For mobile controls
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const touchX = touch.clientX;
    
    // Left third of screen = move left
    if (touchX < canvas.width / 3) {
        keys.left = true;
    } 
    // Right third of screen = move right
    else if (touchX > canvas.width * 2 / 3) {
        keys.right = true;
    } 
    // Middle of screen = jump
    else {
        keys.up = true;
    }
});

canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    keys.left = false;
    keys.right = false;
    keys.up = false;
});

// Game state
let cameraX = 0;

// Show messages
const messageDiv = document.getElementById('message');
function showMessage(text) {
    messageDiv.textContent = text;
    setTimeout(() => {
        if (messageDiv.textContent === text) {
            messageDiv.textContent = '';
        }
    }, 2000);
}

// Check platform collision
function checkPlatformCollision() {
    player.onGround = false;
    
    for (const platform of platforms) {
        // Check if player is above the platform and falling down
        if (player.velocityY > 0 && 
            player.x + player.width > platform.x && 
            player.x < platform.x + platform.width &&
            player.y + player.height >= platform.y && 
            player.y + player.height <= platform.y + player.velocityY + 5) {
            
            player.y = platform.y - player.height;
            player.velocityY = 0;
            player.onGround = true;
            break;
        }
    }
}

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply horizontal movement
    if (keys.left) {
        player.x -= player.speed;
    }
    if (keys.right) {
        player.x += player.speed;
    }
    
    // Apply jump if on ground or enable infinite jump
    if (keys.up) {
        // For infinite jump like Flappy Bird, remove the onGround condition
        player.velocityY = jumpStrength;
        keys.up = false; // Reset to prevent continuous jumping while holding the key
    }

    // Apply gravity
    player.velocityY += gravity;
    player.y += player.velocityY;

    // Check platform collision
    checkPlatformCollision();

    // Prevent player from falling below ground
    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
        player.velocityY = 0;
        player.onGround = true;
    }

    // Scroll camera with player
    cameraX = player.x - canvas.width / 3;
    if (cameraX < 0) cameraX = 0;

    // Draw background
    ctx.fillStyle = '#87ceeb';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw platforms
    platforms.forEach(platform => {
        const screenX = platform.x - cameraX;
        if (screenX + platform.width > 0 && screenX < canvas.width) {
            ctx.drawImage(platformImg, screenX, platform.y, platform.width, platform.height);
        }
    });

    // Draw checkpoints
    checkpoints.forEach((checkpoint, index) => {
        if (!checkpoint.collected) {
            const screenX = checkpoint.x - cameraX;
            if (screenX + checkpoint.width > 0 && screenX < canvas.width) {
                ctx.drawImage(checkpointImg, screenX, checkpoint.y, checkpoint.width, checkpoint.height);
            }

            // Check collision with player
            if (player.x < checkpoint.x + checkpoint.width &&
                player.x + player.width > checkpoint.x &&
                player.y < checkpoint.y + checkpoint.height &&
                player.y + player.height > checkpoint.y) {
                checkpoint.collected = true;
                collectedCheckpoints.add(index);
                showMessage(`Checkpoint collected! (${collectedCheckpoints.size}/30)`);

                if (collectedCheckpoints.size === checkpoints.length) {
                    showMessage('All checkpoints collected! You win!');
                    // Stop the game loop
                    cancelAnimationFrame(animationId);
                    return;
                }
            }
        }
    });

    // Draw player
    ctx.drawImage(playerImg, player.x - cameraX, player.y, player.width, player.height);

    // Display checkpoint counter
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.fillText(`Checkpoints: ${collectedCheckpoints.size}/${checkpoints.length}`, 10, 30);

    // Continue the game loop
    animationId = requestAnimationFrame(gameLoop);
}

let animationId;
generatePlatforms();
generateCheckpoints();
animationId = requestAnimationFrame(gameLoop);
