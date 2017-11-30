var canvas;

// WIDTH AND HEIGHT OF CANVAS
var canvasSize = 900;

// SET FRAME RATE
var frames = 60;

// TO KNOW WHICH CELL PLAYER IS IN
var playerX = 0;
var playerY = 0;
var playerMoveX = 0;
var playerMoveY = 0;

// STANDARD DIFFICULTIES FOR EACH LEVEL
var easyDif = 2;
var mediumDif = 5;
var hardDif = 7;

// KEEP TRACK OF NUM OF COLS AND ROWS
var cols; 
var rows;

// TO DEFINE DIMENTIONS OF ONE CELL
var w = 30;

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

// DISPLAY SECONDS
var seconds = 0;

// DISPLAY MINUTES
var minutes = 0;

// TOTAL SECONDS USER HAS TO COMPLETE MAZE
var userTime;

// BOOLEAN TO DETERMINE IF USER HAS SELECTED A DIFFICULTY LEVEL
var difficultyChosen = false;

// ACTUAL DIFFICULTY LEVEL SELECTED BY USER
var difficulty;

var userDif;

// DIV TO DISPLAY THE TIMER 
var outputDiv;

// COUNTDOWN BEFORE GAME STARTS
var countDown = 3;

// RADIO BUTTONS FOR DIFFICULTY SELECTION
var levelRadios;

// STACK OF CORRECT PATH TO END GOAL IN REVERSE ORDER
var correctPathStack = [];

var cPSLength = 0;

// USED FOR FINDING THE CORRECT PATH
var allUnvisited = [];


// CELL THE GHOST IS SUPPOSED TO BE IN
var ghostCell = {i: 0, j: 0};

var drawGhost = false;

var userCell = [];

var counter = 0;

var ghostInterval = 2;

var framerCount = 0;

var ghostReady = false;

var stackCopy;

var canCopy = true;

var canReset = false;

var canPlay = false;

var drawReplay = true;


// INTERVAL FUNCTION TO DISPLAY TIME RUNS EVERY SECOND
var time = setInterval(() => {

    // CHECKS 3 THINGS
    // 1. IS THE MAZE FINISHED BUILDING
    // 2. IS THE GAME COMPLETED
    // 3. HAS USER SELECTED DIFFICULTY
    if (mazeFinished && gameOver === false && difficultyChosen && canPlay) {


        // CHECKS TO SEE IF STILL COUNTING DOWN
        // IF TRUE DECREMENT COUNTER
        if (countDown > 0) {

            countDown -= 1;

        }

        // IF COUNTDOW COMPLETE
        if (countDown === 0) {

            // CHECKS TO SEE WHICH DIFFICULTY SELECTED AND THEN
            // SETS userTime TO CORRECT VALUE ACCORDINGLY
            // ie. (MORE TIME FOR EASIER LEVELS)
            if (difficulty === 'EASY') {
                
                userTime = floor(stackLength / easyDif);
                
                stackLength -= easyDif;

                userDif = easyDif;
                
            } else if (difficulty === 'MEDIUM') {
                
                userTime = floor(stackLength / mediumDif);
    
                stackLength -= mediumDif;

                userDif = mediumDif;

            } else if (difficulty === 'HARD') {
                
                userTime = floor(stackLength / hardDif);
                
                stackLength -= hardDif;

                userDif = hardDif;

            } 
    
            // // CHECKS TO SEE IF USER HAS LESS THAN 60 SECONDS REMAINING
            // // SETS MINUTS AND SECONDS FOR DISPLAY
            // if (userTime > 59) {
            //     minutes = floor(userTime / 60);
            //     seconds = userTime % 60;
            // } else {
            //     minutes = 0;
            //     seconds = userTime;
            // }

            
        }
        
    }
}, 1000);

var ghostTimer = setInterval(() => {

    if (countDown === 0) {

        if (ghostReady) {

            drawGhost = true;
    
            cPSLength = correctPathStack.length;
    
            ghostCell = correctPathStack[(correctPathStack.length - (floor((userDif * 0.6) * ghostInterval)))];
    
            if (ghostCell) {
    
                correctPathStack.splice((correctPathStack.length - ( floor((userDif * 0.6) * ghostInterval))), correctPathStack.length);
    
            } else {
    
                ghostCell = furthestCell;
    
            }

        }

        ghostReady = true;        

    }

}, ghostInterval * 500);

// SETUP IS A P5.JS FUNCTION
function setup() {

    canvas = createCanvas(canvasSize, canvasSize);
    centerCanvas();


    // SET NUMBER OF COLUMNS AND ROWS BASED ON WIDTH & HEIGHT OF CANVAS
    cols = floor(width / w);
    rows = floor(height / w);



    outputDiv = $('.output-div');

    // FOR TESTING TO SLOW DOWN FRAME RATE
    frameRate(frames);   

    levelRadios = $('.dif-input');

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

// FUNCTION TO CENTER CANVAS BASED ON WINDOW WIDTH
function centerCanvas() {
    let x = (windowWidth - width) / 2;
    let y = ($(window).height() / 2) - (height / 2);
    canvas.position(x, y);
}

// P5.JS FUNCTION TO CALL FUNCTION ON WINDOW RESIZING
function windowResized() {
    centerCanvas();
}

// DRAW IS A P5.JS FUNCTION
// IT RUNS CONTINUOUSLY UNTIL noLopp() IS CALLED
function draw() {

    if (frameRate() > 40) {
        hardDif = 8;
    } else {
        hardDif = 7;
    }

    // console.log('framerCount', framerCount);

    background(100);

    // CREATE GRID THAT GETS COVERED AS MAZE IS GENERATED
    for (var i = 0; i < grid.length; i++) {

        grid[i].show();

    }

    current.visited = true;


    // ONLY SHOW THIS AS MAZE IS BEING MADE
    if (mazeFinished === false) {

        current.highlight();

    } 

    
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

        // PUSH CURRENT CELL TO UNVISITED 
        // USED FOR FINDING CORRECT PATH
        allUnvisited.push(current);
        
        

    // AS LONG AS THERE IS SOMETHING IN THE STACK THE GENERATOR WILL CONTINUE TO RUN
    } else if (stack.length > 0) {
        
        // CHECKS TO SEE IF CURRENT CELL IS FURTHEST FROM STARTING POINT
        if (stack.length > stackLength) {

            // RESET CORRECT PATH STACK BECAUSE THERE IS A NEW LONGEST PATH
            correctPathStack = [];

            // RESET ALL UNVISITED BECAUSE ONLY NEED TO TRACK UNVISITED WHEN BACK TRCKING FROM CURRENT LONGEST PATH
            allUnvisited = [];

            // SETS STACKLENGTH CHECKER VARIABLE
            stackLength = stack.length;

            // SETS FURTHEST CELL TO CURRENT CELL
            furthestCell = current;

            // PUSH FURTHEST TO THE CORRECTPATH STACK
            correctPathStack.push(current);

        } 
        
        // SETS CURRENT CELL TO MOST RECENT CELL IN STACK IN ORDER TO BACK TRACK
        // THIS IS THE ENTIRE BACKTRACKING PART
        current = stack.pop();
        

        // CREATES CORRECT PATH STACK BY CHECKING TWO THINGS
        // 1. IF THE CURRENT CELL IS NOT ALREADY IN THE CORRECT PATH STACK
        // 2. IF THE CURRENT CELL WAS NOT VISITED BEFORE THE CURRENT FURTHEST CELL WAS FOUND
        if (correctPathStack.indexOf(current) === -1 && allUnvisited.indexOf(current) === -1) {
            
            correctPathStack.push(current);
            
        } 
        

    // WHEN THERE IS NOTHING LEFT IN THE STACK 
    // MEANING THE CURRENT CELL IS AT THE STARTING POSITION    
    } else if (stack.length === 0) {

        
        if (drawGhost === false) {
            
            drawGhost = true;

        }

        // CREATES THE ENDING GOAL CELL FROM THE FURTHEST CELL
        var endX = (furthestCell.i) * w;
        var endY = (furthestCell.j) * w;

        // GEM
        //****************************
        if (difficultyChosen) {

            fill(0, 255, 0, 255);
            ellipse(endX + w/2, endY + w/2, w/1.5, w/1.5);

        }
        //****************************
        

        // SETS VARIABLE TO TRUE SIGNALING THE MAZE HAS FINISHED GENERATING        
        mazeFinished = true;


        // CHECKS 4 THINGS
        // 1. COUNTDOWN NOT AT 0 YET AND DIFFICULTY CHOSEN THEN DISPLAY COUNTDOWN
        // 2. COUNTDOWN NOT AT 0 YET AND DIFFICULT NOT CHOSEN
        // 3. SECONDS < 10 DISPLAY 0 IN FRONT OF SECONDS
        // 4. SECONDS >= 10 DO NOT DISPLAY 0 IN FRONT OF SECONDS
        if (countDown > 0 && difficultyChosen && canPlay) {
            
            $('.countdown-div').html(`${countDown}`);
            $('.play-buttons').addClass('hidden');
            $('.play-buttons').attr('src', 'replayarrow.png');

        } else {

            $('.countdown-div').html('');

            
            if (canCopy) {
                canCopy = false;
                stackCopy = correctPathStack.slice(0);
                canReset = true;                
            }

            if (canPlay && drawReplay) {
                
                drawReplay = false;
                $('.play-buttons').removeClass('hidden');
                
            }
            
            

        }
     
        
    }

    // SETS VARIABLES TO CURRENT CURRENT GRID POSITION
    var cI = current.i;
    var cJ = current.j;

    // IF DIFFICULTY CHOSEN THEN DISPLAY THE PLAYER LETTING USER KNOW THE GAME IS READY TO BE PLAYED
    if (difficultyChosen) {

        // PLAYER
        // *************************
        noStroke();
        fill(0, 255, 255, 255);
        var player = ellipse(playerMoveX + w / 2, playerMoveY + w / 2, w / 1.5, w / 1.5);
        // *************************

    }

    
    
    // KEYPRESSES ONLY WORKS AFTER THREE THINGS PASS
    // 1. MAZE IS FINISHED GENERATING
    // 2. GAME IS NOT OVER
    // 3. COUNTDOWN HAS COMPLETED
    if (mazeFinished && gameOver === false && countDown === 0) {


        if (drawGhost) {

            // console.log('ghostCell', ghostCell);
            // GHOST
            // *************************
            noStroke();
            fill(255, 165, 0, 255);
            ellipse((ghostCell.i * w) + w / 2, (ghostCell.j * w) + w / 2, w / 1.5, w / 1.5);
            // *************************

        }


        
        // ALL OF THESE CHECK THREE THINGS
        // 1. WHICH ARROW IS DOWN
        // IN THE DIRECTION USER IS TRYING TO GO
        // 2. IS THERE A WALL IN THAT DIRECTION FOR THE CURRENT CELL
        // 3. IS THERE A WALL IN THAT DIRECTION FOR THE CELL NEXT TO THE CURRENT CELL

                 // LEFT ARROW
        if (keyIsDown(LEFT_ARROW) && (current.walls[3] !== true && grid[index(cI - 1, cJ)].walls[1] !== true))  {

            playerMoveX -= w/4;
            
            // RIGHT ARROW
        } else if (keyIsDown(RIGHT_ARROW) && (current.walls[1] !== true && grid[index(cI + 1, cJ)].walls[3] !== true))  {

            playerMoveX += w/4;
            
            // UP ARROW
        } else if (keyIsDown(UP_ARROW) && (current.walls[0] !== true && grid[index(cI, cJ - 1)].walls[2] !== true)) {

            playerMoveY -= w/4;
            
            // BOTTOM ARROW
        } else if (keyIsDown(DOWN_ARROW) && (current.walls[2] !== true && grid[index(cI, cJ + 1)].walls[0] !== true))  {

            playerMoveY += w/4;

        }
        

        // SET PLAYERS X AND Y COORDINATES
        player.x = playerMoveX + w / 2;
        player.y = playerMoveY + w / 2;
        

        // SET CURRENT CELLS X AND Y COORDINATES TO CENTER OF CELL
        var currentY = ((cJ * w) + (w / 2));
        var currentX = ((cI * w) + (w / 2));

        // THESE CHECK IF THE PLAYER IS 1 CELLS WIDTH AWAY FROM THE CURRENT CELL
        // THEN RESETS THE CURRENT CELL TO THE CORRECT CELL ACCORDINGLY
        if ((player.y - currentY) === w) {

            current = grid[index(cI, cJ + 1)];

        } else if ((currentY - player.y) === w) {

            current = grid[index(cI, cJ - 1)];

        }

        if ((player.x - currentX) === w) {

            current = grid[index(cI + 1, cJ)];

        } else if ((currentX - player.x) === w) {

            current = grid[index(cI - 1, cJ)];

        }


        // ONLY USED FOR TESTING TO SEE USER PATH
        // if (userCell.indexOf(current) === -1) {

        //     userCell.push(current);

        //     counter +=1;
        //     console.log('counter', counter);
        // }

        // for (var indexCell = 0; indexCell < userCell.length; indexCell++) {
        //     var element = userCell[indexCell];

        //     fill(255, 0, 0, 255);
        //     ellipse((element.i * w) + (w / 2), (element.j * w) + (w / 2), w / 2, w / 2);

    
            
        // }
        
        
    }

    if (current === furthestCell || ghostCell === furthestCell) {

        // SET GAME OVER VARIABLE TO TRUE
        gameOver = true;

        noLoop();

        // CHECKS TO SEE IF THE PLAYER HAS WON!!!!
        if (current === furthestCell) {

            $('.countdown-div').html('YOU WON!');

        } else {

            $('.countdown-div').html('YOU LOST!');

        }

    }


    checkDifficultySelection();

    // if (canReset) {
    //     console.log('rate', frameRate());
    // }
    
}




// CHECKS TO SEE IF A DIFFICULTY HAS BEEN SELECTED 
function checkDifficultySelection() {

    if (levelRadios[0].checked) {

        difficulty = 'EASY';

        difficultyChosen = true;

    } else if (levelRadios[1].checked) {

        difficulty = 'MEDIUM';

        difficultyChosen = true;

    } else if (levelRadios[2].checked) {

        difficulty = 'HARD';

        difficultyChosen = true;

    }

}




// NIFTY LITTLE FUNCTION FOR FINDING THE INDEX OF A CELL IN A 1 DIMENSIONAL ARRAY
function index(i, j) {

    if (i < 0 || j < 0 || i > cols - 1 || j > rows - 1) {

        return -1;

    }

    // FORMULA:
    // ((INDEX OF DESIGNATED ROW) * NUMBER OF COLUMNS) + THE INDEX OF THE DESIGNATED COLUMN
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

$('.play-buttons').on('click', function() {

    if (canReset && $(this).attr("src") === "replayarrow.png") {

        $('.countdown-div').html('');

        $('.play-buttons').attr("src", "playButton.png");

        correctPathStack = stackCopy.slice(0);

        playerX = 0;
        playerY = 0;
        playerMoveX = 0;
        playerMoveY = 0;

        ghostCell = { i: 0, j: 0 };

        current = grid[0];

        countDown = 3;

        drawReplay = true;

        if (gameOver) {
            gameOver = false;
            loop();
        }

        gameOver = false;


    } else if (mazeFinished && $(this).attr("src") === "playButton.png" && $('input[type=radio]:checked').length > 0) {

        canPlay = true;

    }
    
});
