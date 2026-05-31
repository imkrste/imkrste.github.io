const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const btn = document.getElementById("btn");


const GRID_SIZE = 100; 
const CELL_SIZE = 6;   
canvas.width = GRID_SIZE * CELL_SIZE;  
canvas.height = GRID_SIZE * CELL_SIZE; 
const STEPS_PER_FRAME = 5;

let steps = 0;
let animationId = null;


let grid = [];
for (let i = 0; i < GRID_SIZE; i++) {
  grid[i] = [];
  for (let j = 0; j < GRID_SIZE; j++) {
    grid[i][j] = 0;
  }
}


let ant = { x: Math.floor(GRID_SIZE / 2), y: Math.floor(GRID_SIZE / 2), dir: 0 };

function draw() {
  
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
  
  for (let i = 0; i < STEPS_PER_FRAME; i++) {
    steps++;
      
    const currentCell = grid[ant.x][ant.y];
    
   
    if (currentCell === 0) {
      ant.dir = (ant.dir + 1) % 4;
      grid[ant.x][ant.y] = 1;
      ctx.fillStyle = "black";
    } else {
      ant.dir = (ant.dir + 3) % 4;
      grid[ant.x][ant.y] = 0;
      ctx.fillStyle = "white";
    }

   
    ctx.fillRect(ant.x * CELL_SIZE, ant.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);

   
    if (ant.dir === 0) ant.y--;      // Up
    else if (ant.dir === 1) ant.x++; // Right
    else if (ant.dir === 2) ant.y++; // Down
    else if (ant.dir === 3) ant.x--; // Left

    
    ant.x = (ant.x + GRID_SIZE) % GRID_SIZE;
    ant.y = (ant.y + GRID_SIZE) % GRID_SIZE;

    
    ctx.fillStyle = "magenta";
    ctx.fillRect(ant.x * CELL_SIZE, ant.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  }

 
  btn.textContent = steps;

  animationId = requestAnimationFrame(sim);
}

draw();
sim();