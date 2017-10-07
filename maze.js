var canvas;

// TO KNOW WHICH CELL PLAYER IS IN
var playerX = 0;
var playerY = 0;

// KEEP TRACK OF NUM OF COLS AND ROWS
var cols; 
var rows;

// TO DEFINE DIMENTIONS OF ONE CELL
var w = 20;

// TO STORE CELL OBJECTS IN ORDER: LEFT - RIGHT & TOP - BOTTOM
var grid = [];

// KEEPS TRACK OF CURRENT CELL
var current;

// KEEPS TRACK OF VISITED CELLS WHEN GENERATING THE MAZE
var stack = [];

// STORES THE FURTHEST CELL TO MAXIMIZE CORRECT MAZE PATH
var furthestCell;

// USED TO TRACK WHICH CELL IS FURTHEST FROM START
var stackLength = 0;

// SET TO TRUE WHEN MAZE IS FINISHED GENERATING
var mazeFinished = false;

// SET TO TRUE WHEN PLAYER HAS COMPLETED MAZE
var gameOver = false;

// SET TIMER
var timer = 0;

// USER TIMER
var userTime;

// DEFINED HERE BECAUSE VARIABLES DEFINED IN SETUP() ARE NOT ACCESSABLE
var time;

var timerDiv;

var timeTaken;

// SETUP IS A P5.JS FUNCTION
function setup() {

    canvas = createCanvas(400, 400);
    centerCanvas();


    cols = floor(width / w);
    rows = floor(height / w);


    timeTaken = createDiv('Timer: ');
    timeTaken.position(windowWidth / 2 - 50, 50)

    // FOR TESTING TO SLOW DOWN FRAME RATE
    //frameRate(5);

    time = setInterval(() => {
        if (mazeFinished) {
            timer += 100;
        }
    }, 10);


    // PUSHES A NEW CELL TO THE GRID
    for (var j = 0; j < rows; j++) {

        for (var i = 0; i < cols; i++) {

            var cell = new Cell(i, j);

            grid.push(cell);

        }

    }

    // SETS CURRENT CELL TO TOP LEFT CORNER
    current = grid[0];

}

function centerCanvas() {
    let x = (windowWidth - width) / 2;
    canvas.position(x, 100);
}

function windowResized() {
    centerCanvas();
}

// DRAW IS A P5.JS FUNCTION
// IT RUNS CONTINUOUSLY UNTIL noLopp() IS CALLED
function draw() {

    background(100);

    // CREATE GRID THAT GETS COVERED AS MAZE IS GENERATED
    for (var i = 0; i < grid.length; i++) {

        grid[i].show();

    }

    current.visited = true;

    current.highlight();
    
    // CALLS FUNCTION THAT SETS THE NEXT CELL THE GENERATOR WILL VISIT BASED ON THE UNVISITED CELLS AROUND THE CURRENT CELL
    var next = current.checkNeighbors();

    if (next) {
        

        next.visited = true;
        
        // PUSHES CURRENT CELL TO THE STACK FOR BACK TRACKING PURPOSES
        stack.push(current);
        
        // REMOVES WALLS BETWEEN CURRENT AND NEXT CELL
        removeWalls(current, next);
        
        // SETS CURRENT CELL TO THE NEXT CELL
        current = next;
        

    // AS LONG AS THERE IS SOMETHING IN THE STACK THE GENERATOR WILL CONTINUE TO RUN
    } else if (stack.length > 0) {
        
        // CHECKS TO SEE IF CURRENT CELL IS FURTHEST FROM STARTING POINT
        if (stack.length > stackLength) {

            // SETS STACKLENGTH CHECKER VARIABLE
            stackLength = stack.length;

            // SETS FURTHEST CELL TO CURRENT CELL
            furthestCell = current;

        }
        
        // SETS CURRENT CELL TO MOST RECENT CELL IN STACK IN ORDER TO BACK TRACK
        // THIS IS THE ENTIRE BACKTRACKING PART
        current = stack.pop();
        

    // WHEN THERE IS NOTHING LEFT IN THE STACK 
    // MEANING THE CURRENT CELL IS AT THE STARTING POSITION    
    } else {

        // CREATES THE ENDING GOAL CELL FROM THE FURTHEST CELL
        var endX = (furthestCell.i) * w;
        var endY = (furthestCell.j) * w;

        fill(0, 255, 0, 100);
        ellipse(endX + w/2, endY + w/2, w/1.5, w/1.5);


        // SETS VARIABLE TO TRUE SIGNALING THE MAZE HAS FINISHED GENERATING
        mazeFinished = true;

        userTime = timer / 10000
        userTime = userTime.toFixed(2);
    
        timeTaken.elt.innerHTML = `Timer: ${userTime}`;
            
    }

}

function keyPressed() {

    var cI = current.i;
    var cJ = current.j;
    

    // KEYPRESSES ONLY WORK ONCE THE MAZE HAS FINISHED GENERATING
    if (mazeFinished && gameOver === false) {
        // setInterval(() => {
        //     timer += 1;
        //     console.log('timer', timer);
        // }, 1000);

        // THESE IF STATEMENTS CHECK FOR FOUR THINGS 
        // 1. WHICH KEY IS PRESSED (ie. LEFT, RIGHT, UP, or DOWN)
        // 2. IF THE PLAYER IS AT THE EDGE OF THE CANVAS
        // 3. IF THE NEXT CELL THE PLAYER IS ATTEMPTING TO GO TO HAS A WALL
        // 4. IF THE CURRENT CELL THE PLAYER IS IN HAS A WALL

        // LEFT ARROW
        if (keyCode === LEFT_ARROW && playerX !== 0 && (grid[index(cI - 1, cJ)].walls[1] !== true) && current.walls[3] !== true) {
            
            current = grid[(playerX - 1) + playerY * cols];
            playerX -= 1;
            
        // RIGHT ARROW
        } else if (keyCode === RIGHT_ARROW && playerX + 1 !== cols && (grid[index(cI + 1, cJ)].walls[3] !== true) && current.walls[1] !== true ) {

            current = grid[(playerX + 1) + playerY * cols];
            playerX += 1;
          
        // UP ARROW
        } else if (keyCode === UP_ARROW && playerY !== 0 && (grid[index(cI, cJ - 1)].walls[2] !== true) && current.walls[0] !== true) {

            current = grid[playerX + (playerY - 1) * cols];
            playerY -= 1;
       
        // BOTTOM ARROW
        } else if (keyCode === DOWN_ARROW && playerY + 1 !== rows && (grid[index(cI, cJ + 1)].walls[0] !== true) && current.walls[2] !== true) {

            current = grid[playerX + (playerY + 1) * cols];
            playerY += 1;
            
        }

        // CHECKS TO SEE IF THE PLAYER HAS WON!!!!

        if (current === furthestCell) {

            console.log('stackLength', stackLength);

            // SET GAME OVER VARIABLE TO TRUE
            gameOver = true;

            // STOP TIMER
            clearInterval(time);

            // LET USER KNOW THEY COMPLETED THE MAZE
            text = createDiv('YOU WON!');
            text.position(windowWidth/2 - 35, 25);

            // CREATE USER TIME AND SHOW TO 2 DECIMAL PLACES
            
            timeTaken.elt.innerHTML = `Time: ${userTime} seconds`;
            timeTaken.position(windowWidth / 2 - 35, 50);


            var score = userTime/stackLength;
            score = (1 / score) * 10;

            score = score.toFixed(2);

            var scoreDiv = createDiv(`Your Score: ${score}`);
            scoreDiv.position(windowWidth / 2 - 50, 75)
            return;
        }
    }
}




// NIFTY LITTLE FUNCTION FOR FINDING THE INDEX OF A CELL IN A 1 DIMENSIONAL ARRAY
function index(i, j) {

    if (i < 0 || j < 0 || i > cols - 1 || j > rows - 1) {

        return -1;

    }

    return i + j * cols;

}



// FUNCTION TO REMOVE THE CORRECT WALLS
// TAKES PARAMETER (CURRENT, NEXT)
function removeWalls(a, b) {

    // CHECKS TO SEE IF THE NEXT CELL IS ABOVE, BELOW, LEFT, or RIGHT OF CURRENT CELL
    // AND SETS THE CURRENT AND NEXT CELLS WALLS ARRAY TO FALSE AT CORRECT INDEX
    // REPRESENTING EITHER THE TOP, RIGHT, BOTTOM, or LEFT WALLS FOR THOSE CELLS

    var x = a.i - b.i;

    var y = a.j - b.j;

    // IF NEXT CELL IS TO THE RIGHT OF CURRENT CELL
    if (x === 1) {

        a.walls[3] = false;

        b.walls[1] = false;

    // IF THE NEXT CELL IS TO THE LEFT OF CURRENT CELL
    } else if (x === -1) {

        a.walls[1] = false;

        b.walls[3] = false;

    }

    // IF THE NEXT CELL IS BELOW THE CURRENT CELL
    if (y === 1) {

        a.walls[0] = false;

        b.walls[2] = false;

    // IF THE NEXT CELL IS ABOVE THE CURRENT CELL
    } else if (y === -1) {

        a.walls[2] = false;

        b.walls[0] = false;

    }

}
