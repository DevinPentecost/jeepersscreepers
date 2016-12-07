var memoryRoom = require('memory.room')


var roleRoom = {

	/** @param {Room} room**/
	run: function (roomName) {
		//Get the memory for this room
		roomMemory = memoryRoom.getRoomMemory(roomName);

		//Now we want to check re-tabulation of the room's contents
		checkTabulateEverything(roomMemory);
	}
};

function checkTabulateEverything(roomMemory) {
	//Decrease the check
	//Did it hit zero?
	console.log("Ticks to Tabulate room " + roomMemory.name + ": " + roomMemory.tabulateCounter)
	if (--roomMemory.tabulateCounter < 1) {
		//It's time to retabulate
		memoryRoom.tabulateEverything(roomMemory);

		//We need to rebuild any roads
		buildRouteRoads(roomMemory);
	}
}

function buildRouteRoads(roomMemory) {
	//Get the room
	var room = Game.rooms[roomMemory.name];

	//Go over each route
	for (let spawnName in roomMemory.routes) {
		//Get the routes for that spawn
		for (let spawnRouteIndex in roomMemory.routes[spawnName]) {
			//Get the route
			let routeString = roomMemory.routes[spawnName][spawnRouteIndex];
			let route = Room.deserializePath(routeString);

			//Now go over each point...
			for (let positionIndex in route) {
				//Get the position
				var roomCoordinates = route[positionIndex];
				var roomPosition = room.getPositionAt(roomCoordinates.x, roomCoordinates.y);

				//Is there already a road or a construction site?
				var foundRoad = false;
				var foundObjects = roomPosition.look()

				//For each object
				foundObjects.forEach(
					function (foundObject) {
						//Is it a structure?
						if (foundObject.type == LOOK_STRUCTURES) {
							//Is it a road?
							if (foundObject.structureType == STRUCTURE_ROAD) {
								//We can't build here
								foundRoad = true;
							}
						} else if (foundObject.type == LOOK_CONSTRUCTION_SITES) {
							//We can't build stuff on top of each other
							foundRoad = true;
						}
					});

				//Did we find a road?
				if (!foundRoad) {
					//We can build
					room.createConstructionSite(roomPosition, STRUCTURE_ROAD);
				}
			}
		}		
	}
}

module.exports = roleRoom;