class Node {
  // constructor() { }
  constructor(value, x, y) {
    this.value = value;
    this.point = { 'x' : x, 'y' : y};
    this.parent = undefined;
    this.g = 0;
    this.h = 0;
  }
  cost(){
    return this.g + this.h;
  }
  equal(node){
    return node.point.x == this.point.x && node.point.y == this.point.y;
  }
  // move const
  moveCost(){
    if (this.value == 0) return 0;
    else return 1;
  }
}


// A base class is defined using the new reserved 'class' keyword
// This is based on https://en.wikipedia.org/wiki/A*_search_algorithm
class AStar {
  // ..and an (optional) custom class constructor. If one is
  // not supplied, a default constructor is used instead:
  // constructor() { }
  constructor(start, goal, maze) {
    this.maze = maze;
    this.start = start;
    this.goal = goal;
  }
  // Heureustic |r1 - r | + |c1 - c|
  manhattan(pointOne, pointTwo){
    return Math.abs(pointOne.point[0] - pointTwo.point[0]) +
           Math.abs(pointOne.point[1] - pointTwo.point[0]);
  }
  //
  lowestNodeCost(openList){
    var minCostNode = openList[0];
    for(let i=1; i < openList.length; i++ ){
      if (openList[i].cost() < minCostNode.cost() )
        minCostNode = openList[i];
    }
    return minCostNode;
  }
  // Is possible movment
  isPossibleMovement(x, y){
    if(x < 0 || y < 0 || y > this.maze.length-1 || x > this.maze[0].length-1 ) return false;
    if(this.maze[x][y] == 1) return false;
    return true;
  }
  // Return the children list of given node
  children(node){
    let x = node.point.x;
    let y = node.point.y;
    var neighbors = [];
    // ↑
    if (this.isPossibleMovement(x, y - 1)) {
       neighbors.push(this.maze[x][y - 1]);
    }
    // →
    if (this.isPossibleMovement(x + 1, y)) {
       neighbors.push(this.maze[x + 1][y]);
    }
    // ↓
    if (this.isPossibleMovement(x, y + 1)) {
       neighbors.push(this.maze[x][y + 1]);
    }
    // ←
    if (this.isPossibleMovement(x - 1, y)) {
       neighbors.push(this.maze[x - 1][y]);
    }
    return neighbors;
  }
  // find in array
  nodeInArray(node, list){
    for(let i=0; i< list.length;i++){
      if(node.equal(list[i])) return true;
    }
    return false;
  }
  // A*
  astar(){
    var openList = [];
    var closedList = [];
    // Current point is starting point
    var current = this.start;
    // Add the starting point to open List
    openList.push(current);
    // while the open list is not empty

    while(openList.length != 0){

      // Find the item in open list with lowest g+h score
      current = this.lowestNodeCost(openList);
      // If the path we want , retrace the path
      if (current.equal(this.goal)){
        var path = [];
        while(current.parent){
          path.push(current);
          current = current.parent;
        }
        path.push(currrent);
        return path;
      }

      //Remove the item from the open list
      openList = openList.filter(function(node) {return node.equal(current);});
      // Add to closed list
      closedList.push(current);

      // Loop through the node's children/siblings
      var children = this.children(current);
      for (let i =0 ; i<children.length; i++){
          let node = children[i];
          //If it is already in the closed set, skip it
          if (this.nodeInArray(node, closedList))
              continue;
          //Otherwise if it is already in the open set
          if(this.nodeInArray(node, openList)){
            //Check if we beat the G score
            let newG = current.g + current.moveCost();
            // If so, update the node to have a new parent
            if (node.g > newG){
              node.g = newG;
              node.parent = current;
            }

          } else {
            //If it isn't in the open set, calculate the G and H score for the node
            node.g = current.g + current.moveCost();
            node.h = this.manhattan(node, this.goal);
            // Set the parent to our current item
            node.parrent = current;
            // Add it to the set
            openList.push(node);
          }
      }
    }
    console.log("No solution");
  }

  // solve
  solve(){
    for(let i= 0; i < this.maze.length; i++){
      for (let j=0; j < this.maze[0].length; j++){
        this.maze[i][j] = new Node(this.maze[i][j], i, j);
      }
    }
    var path  = this.astar();
    return path;
  }
}
