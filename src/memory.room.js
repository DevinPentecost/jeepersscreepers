//Imports
var memorySource = require('memory.source')

//How often to recalculate routes, in ticks
var TABULATE_FREQUENCY = 5000;
var TABULATE_STRUCTURES = [STRUCTURE_CONTAINER, STRUCTURE_CONTROLLER, STRUCTURE_EXTENSION, STRUCTURE_EXTRACTOR, STRUCTURE_LAB, STRUCTURE_LINK, STRUCTURE_NUKER, STRUCTURE_OBSERVER, STRUCTURE_PORTAL, STRUCTURE_STORAGE, STRUCTURE_TERMINAL, STRUCTURE_TOWER]

//Memory for each room
var memoryRoom = {

	//A prototype for creating some memory for a resource
	memoryPrototype: function (roomName) {

		//Prototype the memory
		var roomMemory = {
			//It know's what it is
			name: roomName,

			//How long till we tabulate things again?
			tabulateCounter: 0,

			//It tracks the memory for the resources
			sources: {},

			//The routes between spawns and objects in the room
			routes: {},
		}

		//Initialize it
		initializeResources(roomMemory);

		//Return that memory
		return roomMemory;
	},

	//For getting room memory
	getRoomMemory: function(roomName){
		//We want to look into the memory
		if(!("rooms" in Memory)){
			//We need to add it
			Memory.rooms = {};
		}

		//Is this room in the room memory?
		if(!(roomName in Memory.rooms)){
			//We add that too
			Memory.rooms[roomName] = memoryRoom.memoryPrototype(roomName);
		}

		//Return the memory
		return Memory.rooms[roomName];
	},

	initializeResources: initializeResources,
	tabulateEverything: function(roomMemory) {
		//We want to recalculate a bunch of expensive room things
		roomMemory.tabulateCounter = TABULATE_FREQUENCY;

		//Tabulate trade routes betweeen rooms
		tabulateRoutes(roomMemory);
	}
	
};

//A function for initializing resources
var initializeResources = function (roomMemory) {
	//We figure out the room we are in
	var room = Game.rooms[roomMemory.name]

	//Get all the sources in the room
	var sources = room.find(FIND_SOURCES);
	for (var source in sources) {
		//We want to give it a memory
		var source = sources[source];
		var sourceId = source.id;
		roomMemory.sources[sourceId] = memorySource.memoryPrototype(sourceId);
	}
}

//A trade route is anything that needs to transfer from within a room, not between rooms
var tabulateRoutes = function (roomMemory) {

	//For now, just find routes between structures
	var room = Game.rooms[roomMemory.name]

	//Is it one of the many we are looking for?
	var structures = room.find(FIND_MY_STRUCTURES, {
		filter: (structure) => {
			return (TABULATE_STRUCTURES.indexOf(structure.structureType) >= 0);
		}
	});

	//Now get all spawners in the room
	var spawners = room.find(FIND_MY_STRUCTURES, {
		filter: (structure) => {
			return (structure.structureType == STRUCTURE_SPAWN);
		}
	})

	//Now for each spawn...
	for (let spawnerIndex in spawners) {
		//Get the spawn
		spawner = spawners[spawnerIndex];
		spawnerPosition = spawner.pos;

		//Hold on to that path
		roomMemory.routes[spawner.name] = [];

		//Now go through each other structure of interest
		for (let structureIndex in structures) {
			//We get that structure
			var structure = structures[structureIndex];
			var structurePosition = structure.pos;

			//Now we get the route between it and the spawner
			var path = room.findPath(spawnerPosition, structurePosition);
			var serializedPath = Room.serializePath(path);

			//Store that path
			roomMemory.routes[spawner.name].push(serializedPath);
		}
	}
}

module.exports = memoryRoom;