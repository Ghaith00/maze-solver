// A base class is defined using the new reserved 'class' keyword
class Maze {
  // ..and an (optional) custom class constructor. If one is
  // not supplied, a default constructor is used instead:
  // constructor() { }
  constructor(height, width, rectangleSize) {
    this.maze = [];
    this.tileSize = 10;
    this.graphics;
    //Manages booting, creating subsystems and running the logic and render loop.
    this.game = new Phaser.Game(width*10, height*10, Phaser.CANVAS, "");
    this.name = 'Pacman Maze';
    this.height = height;
    this.width = width;
    this.moves = [];
    this.position = {x : 1,y : 1};
    this.recSize = rectangleSize;
  }

  newGame(){
    // state : A base Game State object you can extend.
    // add : Adds a new State into the StateManager
    this.game.state.add("play_maze", this);
    // start : Start the given State.
    this.game.state.start("play_maze");
  }

  // Initialize the maze matrix
  initMaze(){
    for(let i = 0; i < this.height; i++){
         this.maze[i] = [];
         for(let j = 0; j < this.width; j++){
              this.maze[i][j] = 1;
         }
    }
    this.maze[1][1] = 0;

  }
  // Get possible direction of current position X, Y
  getPossibleDirections(){
    var possibleDirections = "";

    if(this.position.x + 2 > 0 && this.position.x + 2 < this.height - 1 && this.maze[this.position.x + 2][this.position.y] == 1){
         possibleDirections += "S";
    }
    if(this.position.x-2 > 0 && this.position.x - 2 < this.height - 1 && this.maze[this.position.x - 2][this.position.y] == 1){
         possibleDirections += "N";
    }
    if(this.position.y-2 > 0 && this.position.y - 2 < this.width - 1 && this.maze[this.position.x][this.position.y - 2] == 1){
         possibleDirections += "W";
    }
    if(this.position.y+2 > 0 && this.position.y + 2 < this.width - 1 && this.maze[this.position.x][this.position.y + 2] == 1){
         possibleDirections += "E";
    }
    return possibleDirections;
  }

  // List of moves
  moveNorth(){
    this.maze[this.position.x - 2][this.position.y] = 0;
    this.maze[this.position.x - 1][this.position.y] = 0;
    this.position.x -= 2;
  }
  moveSouth(){
    this.maze[this.position.x + 2][this.position.y] = 0;
    this.maze[this.position.x + 1][this.position.y] = 0;
    this.position.x += 2;
  }
  moveWest(){
    this.maze[this.position.x][this.position.y - 2] = 0;
    this.maze[this.position.x][this.position.y - 1] = 0;
    this.position.y -= 2;
  }
  moveEast(){
    this.maze[this.position.x][this.position.y + 2] = 0;
    this.maze[this.position.x][this.position.y + 1] = 0;
    this.position.y += 2;
  }

  // Clear screen and redraw rectangle every
  updateMazeGraphics(){
     this.graphics.clear();
     this.graphics.beginFill(0xcccccc);
     for(let i = 0; i < this.height; i ++){
          for(let j = 0; j < this.width; j ++){
               if(this.maze[i][j] == 1){
                    this.graphics.drawRect(j * this.recSize, i * this.recSize, this.recSize, this.recSize);
               }
          }
     }
     this.graphics.endFill();
     this.graphics.beginFill(0xff0000);
     this.graphics.drawRect(this.position.y * this.recSize, this.position.x * this.recSize, this.recSize, this.recSize);
     this.graphics.endFill();
  }

  // Method that will be invoked by Phaser
  create() {
    // Creates a new Graphics object.
    this.graphics = this.game.add.graphics(0, 0);

    this.initMaze();

    this.moves.push(this.position.x + this.position.y * this.width);


    let possibleDirections = "";
    while(this.moves.length){
          possibleDirections = this.getPossibleDirections();
           // If there is possible direction -> generate move
           if(possibleDirections){
             // generate move randomly
             let move = this.game.rnd.between(0, possibleDirections.length - 1);
             switch (possibleDirections[move]){
                    case "N":
                      this.moveNorth()
                      break;
                    case "S":
                      this.moveSouth()
                      break;
                    case "W":
                      this.moveWest()
                      break;
                    case "E":
                      this.moveEast()
                      break;
               }
               this.moves.push(this.position.y + this.position.x * this.width);
           } else {
             let back = this.moves.pop();
             this.position.x = Math.floor(back / this.width);
             this.position.y = back % this.width;
           }
           this.updateMazeGraphics();
        }

  }
  // Draw the path
  drawPath(path){
       var i = 0;
       this.game.time.events.loop(Phaser.Timer.SECOND/25, function(){
            if(i < path.length){
                 this.graphics.beginFill(0xff0000);
                 this.graphics.drawRect(path[i].x * this.recSize + 3, path[i].y * this.recSize + 3, this.recSize - 6, this.recSize - 6);
                 i++;
                 this.graphics.endFill();
            }
       });
  }

}
