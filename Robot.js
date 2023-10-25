// Define the roads in the village as a list of strings, where each string represents a road connecting two places.
const roads = [
    "Alice's House-Bob's House",   "Alice's House-Cabin",
    "Alice's House-Post Office",   "Bob's House-Town Hall",
    "Daria's House-Ernie's House", "Daria's House-Town Hall",
    "Ernie's House-Grete's House", "Grete's House-Farm",
    "Grete's House-Shop",          "Marketplace-Farm",
    "Marketplace-Post Office",     "Marketplace-Shop",
    "Marketplace-Town Hall",       "Shop-Town Hall"
  ];
  
  // The buildGraph function creates a map of connected places using the roads data.
  const buildGraph = (edges) => {
    // Create an empty graph object with a null prototype.
    //null prototype, ensuring that it's an empty object without inherited properties
    let graph = Object.create(null);
  
    // Add an edge from 'from' to 'to' in the graph data structure.
  const addEdge = (from, to) => {
    // Check if the 'from' node doesn't exist in the graph.
    if (graph[from] == null) {
      // If it doesn't exist, create an array containing 'to' as the first connection.
      graph[from] = [to];
    } else {
      // If 'from' already has connections, simply add 'to' to its list of connections.
      graph[from].push(to);
    }
  }
  
  
    for (let [from, to] of edges.map(r => r.split("-"))) {
      addEdge(from, to);
      addEdge(to, from);
    }
  
    return graph;
  }
  
  // Create a road graph using the roads data.
  const roadGraph = buildGraph(roads);
  
  // Define a class called VillageState to represent the state of the village.
  class VillageState {
    constructor(place, parcels) {
      this.place = place;
      this.parcels = parcels;
    }
  
    // The move method checks if a move is valid and returns a new state accordingly.
    move(destination) {
      if (!roadGraph[this.place].includes(destination)) {
        return this; // Invalid move, return the old state.
      } else {
        // Valid move, update the parcels' locations and return a new state.
        let parcels = this.parcels.map(p => {
          if (p.place != this.place) return p;
          return { place: destination, address: p.address };
        }).filter(p => p.place != p.address);
        return new VillageState(destination, parcels);
      }
    }
  }
  
  // Create an initial state for the village with one parcel at the Post Office.
  let first = new VillageState("Post Office", [{ place: "Post Office", address: "Alice's House" }]);
  let next = first.move("Alice's House");
  
  console.log(next.place);    // Output: Alice's House
  console.log(next.parcels);  // Output: []
  
  // Object.freeze is used to make an object immutable.
  let object = Object.freeze({ value: 5 });
  object.value = 10; // Attempt to change a property (ignored).
  console.log(object.value); // Output: 5
  
  // The runRobot function simulates a robot navigating the village to deliver parcels.
  const runRobot = (state, robot, memory) => {
    for (let turn = 0;; turn++) {
      if (state.parcels.length == 0) {
        console.log(`Done in ${turn} turns`);
        break;
      }
      let action = robot(state, memory);
      state = state.move(action.direction);
      memory = action.memory;
      console.log(`Moved to ${action.direction}`);
    }
  }
  
  // The randomPick function selects a random element from an array.
  const randomPick = (array) => {
    let choice = Math.floor(Math.random() * array.length);
    return array[choice];
  }
  
  // The randomRobot function makes random moves to navigate the village.
  const randomRobot = (state) => {
    return { direction: randomPick(roadGraph[state.place]) };
  }
  
  // Create a random initial state with a specified number of parcels and run the randomRobot.
  VillageState.random = function(parcelCount = 5) {
    let parcels = [];
    for (let i = 0; i < parcelCount; i++) {
      let address = randomPick(Object.keys(roadGraph));
      let place;
      do {
        place = randomPick(Object.keys(roadGraph));
      } while (place == address);
      parcels.push({ place, address });
    }
    return new VillageState("Post Office", parcels);
  };
  
  runRobot(VillageState.random(), randomRobot);
  // Simulate the robot's actions.
  