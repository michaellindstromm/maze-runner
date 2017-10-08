
// CELL CONSTRUCTOR
function Cell(i, j) {

    // SETS THE I and J WHICH IS THE X and Y OF THE CORRESPONDING ROW AND COLUMN
    // ie. (0, 0) IS THE TOP LEFT CELL
    this.i = i;
    this.j = j;

    // SETS THE WALLS OF THE CURRENT CELL ALL TO TRUE CREATING A GRID
    // WALLS[0] = TOP
    // WALLS[1] = RIGHT
    // WALLS[2] = BOTTOM
    // WALLS[3] = LEFT
    this.walls = [true, true, true, true];

    // INITIALLY SET TO FALSE WHEN FIRST CREATING GRID
    this.visited = false;

    //FUNCTION THAT CHECKS FOR THIS CELLS TOP, RIGHT, BOTTOM, and LEFT NEIGHBORS
    this.checkNeighbors = function () {

        var neighbors = [];

        // SETS VARIABLES EACH OF THIS CELL'S NEIGHBORS
        var top = grid[index(i, j - 1)];
        var right = grid[index(i + 1, j)];
        var bottom = grid[index(i, j + 1)];
        var left = grid[index(i - 1, j)];

        
        // THE IF STATEMENTS BELOW CHECK TWO THINGS
        // 1. IF THIS CELL HAS A NEIGHBOR (FOR EDGE CASES lol)
        // 2. IF PARTICULAR NEIGHBOR FOR THIS CELL HAS ALREADY BEEN VISITED
        // IF EVALUATED TO TRUE THE NEIGHBORS FOR THIS CELL GET PUSHED INTO THIS CELL'S NEIGHBORS ARRAY

        // TOP
        if (top && !top.visited) {

            neighbors.push(top);

        }

        // RIGHT
        if (right && !right.visited) {

            neighbors.push(right);

        }

        // BOTTOM
        if (bottom && !bottom.visited) {

            neighbors.push(bottom);

        }

        // LEFT
        if (left && !left.visited) {

            neighbors.push(left);

        }


        // IF THIS CELL HAS UNVISITED NEIGHBORS THIS RETURNS A RANDOM NEIGHBOR FOR THE CURRENT CELL TO GO TO NEXT
        if (neighbors.length > 0) {

            var r = floor(random(0, neighbors.length));

            return neighbors[r];

        // OTHERWISE IT RETURNS UNDEFINED
        } else {

            return undefined;

        }


    }


    // USED TO HIGHLIGHT THE CURRENT CELL
    this.highlight = function () {
        var x = this.i * w;
        var y = this.j * w;
        noStroke();
        fill(255, 0, 0, 255);
        ellipse(x + w/2, y + w/2, w/1.5, w/1.5);
    }

    // USED TO DRAW LINES FOR CELL BASED ON THIS CELLS WALLS ARRAY
    this.show = function () {
        var x = this.i * w;
        var y = this.j * w;
        stroke(255);

        // IF THIS CELL'S WALLS ARRAY AT CERTAIN INDEX IS TRUE IT DRAWS THE CORRECT WALL ACCORDINGLY

        // TOP
        if (this.walls[0]) {

            line(x, y, x + w, y);
            
        }
        
        // RIGHT
        if (this.walls[1]) {
            
            line(x + w, y, x + w, y + w);
            
        }
        
        // BOTTOM
        if (this.walls[2]) {
            
            line(x + w, y + w, x, y + w);
            
        }
        
        // LEFT
        if (this.walls[3]) {
            
            line(x, y + w, x, y);

        }

        // WHEN CELL IS VISITED IT DRAWS A RECTANGLE WITH NO BORDER SO ONLY CORRECT WALLS SHOW
        if (this.visited) {

            noStroke();
            fill(66, 197, 244, 100);
            rect(x, y, w, w);
            
        }
    }
}