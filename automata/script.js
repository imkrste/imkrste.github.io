const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const btn = document.getElementById("btn");

// --- Configuration Variables ---
const GRID_SIZE = 100; // Big enough for the highway
const CELL_SIZE = 6;   // 6 pixels per cell
canvas.width = GRID_SIZE * CELL_SIZE;  // 600px
canvas.height = GRID_SIZE * CELL_SIZE; // 600px
const STEPS_PER_FRAME = 10;

let steps = 0;
let animationId = null;

// Build the grid using the GRID_SIZE variable
let grid = [];
for (let i = 0; i < GRID_SIZE; i++) {
  grid[i] = [];
  for (let j = 0; j < GRID_SIZE; j++) {
    grid[i][j] = 0;
  }
}

// Start ant in the middle of the new grid
let ant = { x: Math.floor(GRID_SIZE / 2), y: Math.floor(GRID_SIZE / 2), dir: 0 };

function draw() {
  // Draw grid lines based on variables
  for (let i = CELL_SIZE; i < canvas.height + CELL_SIZE; i = i + CELL_SIZE) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, i, canvas.width, 1);
  }

  for (let j = CELL_SIZE; j < canvas.width + CELL_SIZE; j = j + CELL_SIZE) {
    ctx.fillStyle = "red";
    ctx.fillRect(j, 0, 1, canvas.height);
  }
}

function sim() {
  // Run the logic multiple times instantly
  for (let i = 0; i < STEPS_PER_FRAME; i++) {
    steps++;
      
    const currentCell = grid[ant.x][ant.y];
    
    // Apply Rules
    if (currentCell === 0) {
      ant.dir = (ant.dir + 1) % 4;
      grid[ant.x][ant.y] = 1;
      ctx.fillStyle = "black";
    } else {
      ant.dir = (ant.dir + 3) % 4;
      grid[ant.x][ant.y] = 0;
      ctx.fillStyle = "white";
    }

    // Draw the flipped cell (This also erases the magenta ant from the previous step!)
    ctx.fillRect(ant.x * CELL_SIZE, ant.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);

    // Move
    if (ant.dir === 0) ant.y--;      // Up
    else if (ant.dir === 1) ant.x++; // Right
    else if (ant.dir === 2) ant.y++; // Down
    else if (ant.dir === 3) ant.x--; // Left

    // Wrap-around logic
    ant.x = (ant.x + GRID_SIZE) % GRID_SIZE;
    ant.y = (ant.y + GRID_SIZE) % GRID_SIZE;

    // Draw the ant's new position
    ctx.fillStyle = "magenta";
    ctx.fillRect(ant.x * CELL_SIZE, ant.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  }

  // Update the UI only ONCE per visual frame to save processing power
  btn.textContent = steps;

  // Loop the animation frame
  animationId = requestAnimationFrame(sim);
}

draw();
sim();