//What is the minimum creeps per resource in this room?
var memorySource = {

	//A prototype for creating some memory for a resource
	memoryPrototype: function (resourceId) {

		//Prototype the memory
		var sourceMemory = {
			//It know's what it is
			id: resourceId,

			//Harvester variables
			assignedHarvesters: [],
			maxHarvesters: null
		}

		//Initialize it
		memorySource.calculateHarvesters(sourceMemory)

		//Return that memory
		return sourceMemory;
	},

	//A function for recalculating the appropriate number of harvesters
	calculateHarvesters: function (memorySource) {
		//We have a resource memory that we want to figure out how many things to assign
		var source = Game.getObjectById(memorySource.id);

		//Now go through all the adjacent tiles
		var emptySpaces = 0;
		for (xPos = source.pos.x - 1; xPos <= source.pos.x + 1; ++xPos) {
			for (yPos = source.pos.y - 1; yPos <= source.pos.y + 1; ++yPos) {
				//Is it a valid tile?
				var roomPosition = new RoomPosition(xPos, yPos, source.room.name);

				//What is there?
				var terrainType = Game.map.getTerrainAt(roomPosition);
				console.log(terrainType);
				if (terrainType != 'wall') {
					//We increment need
					console.log("ADDING EMPTY SPACE " + memorySource.id);
					++emptySpaces;
				}
			}
		}

		//We will just set the memory to need that many harvesters
		//TODO: Someday we'll use the distance to figure it out
		memorySource.maxHarvesters = emptySpaces;
	}

};

module.exports = memorySource;