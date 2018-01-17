function Main(){
  var mazeGame = new Maze(81, 61, 10);
  mazeGame.newGame();

  // for debug
  return mazeGame;
}
// Button listner
function solve(){
  var astartmaze = new AStar(new Node(0, 1, 1), new Node(0, m.maze.length-1, m.maze[0].length-1), m.maze);
  var path  = astartmaze.solve();
  // Draw solution if existe
  if (path.length !=0 )
    m.drawPath();
}

var m = Main();
