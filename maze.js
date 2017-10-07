var playerX = 0;
var playerY = 0;
var cols, rows;
var w = 20;
var grid = [];
var current;
var stack = [];
var furthestCell;
var stackLength = 0;
var mazeFinished = false;

function setup() {

    createCanvas(200, 200);

    cols = floor(width / w);
    rows = floor(height / w);

    //frameRate(5);

    for (var j = 0; j < rows; j++) {

        for (var i = 0; i < cols; i++) {

            var cell = new Cell(i, j);

            grid.push(cell);

        }

    }

    current = grid[0];

}

function draw() {

    background(100);

    for (var i = 0; i < grid.length; i++) {

        grid[i].show();

    }

    current.visited = true;

    current.highlight();
    // STEP 1
    var next = current.checkNeighbors();

    if (next) {
        
        next.visited = true;
        
        // STEP 2
        stack.push(current);
        
        // STEP 3
        removeWalls(current, next);
        
        // STEP 4
        current = next;
        
    } else if (stack.length > 0) {
        
        if (stack.length > stackLength) {

            stackLength = stack.length;
            furthestCell = current;

        }
        
        current = stack.pop();
        
    } else {

        endX = (furthestCell.i) * w;
        endY = (furthestCell.j) * w;

        fill(0, 255, 0, 100);
        rect(endX, endY, w, w);


        mazeFinished = true;
    }

}

function keyPressed() {

    var cI = current.i;
    var cJ = current.j;
    
    if (mazeFinished) {

        if (keyCode === LEFT_ARROW && playerX !== 0 && (grid[index(cI - 1, cJ)].walls[1] !== true) && current.walls[3] !== true) {
            
            current = grid[(playerX - 1) + playerY * cols];
            playerX -= 1;
            
        } else if (keyCode === RIGHT_ARROW && playerX + 1 !== cols && (grid[index(cI + 1, cJ)].walls[3] !== true) && current.walls[1] !== true ) {

            current = grid[(playerX + 1) + playerY * cols];
            playerX += 1;
            
        } else if (keyCode === UP_ARROW && playerY !== 0 && (grid[index(cI, cJ - 1)].walls[2] !== true) && current.walls[0] !== true) {

            current = grid[playerX + (playerY - 1) * cols];
            playerY -= 1;
       
        } else if (keyCode === DOWN_ARROW && playerY + 1 !== rows && (grid[index(cI, cJ + 1)].walls[0] !== true) && current.walls[2] !== true) {

            current = grid[playerX + (playerY + 1) * cols];
            playerY += 1;
            
        }
    }
}

function index(i, j) {

    if (i < 0 || j < 0 || i > cols - 1 || j > rows - 1) {

        return -1;

    }

    return i + j * cols;

}


function removeWalls(a, b) {

    var x = a.i - b.i;

    var y = a.j - b.j;

    if (x === 1) {

        a.walls[3] = false;

        b.walls[1] = false;

    } else if (x === -1) {

        a.walls[1] = false;

        b.walls[3] = false;

    }
    if (y === 1) {

        a.walls[0] = false;

        b.walls[2] = false;

    } else if (y === -1) {

        a.walls[2] = false;

        b.walls[0] = false;

    }

}
