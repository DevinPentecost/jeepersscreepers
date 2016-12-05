var memorySource = require('memory.source')


//Memory for each room
var memoryRoom = {

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

	//A prototype for creating some memory for a resource
	memoryPrototype: function (roomName) {

		//Prototype the memory
		var roomMemory = {
			//It know's what it is
			name: roomName,

			//It tracks the memory for the resources
			sources: {}
		}

		//Initialize it
		initializeResources(roomMemory);

		//Return that memory
		return roomMemory;
	},

	initializeResources: initializeResources
	
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

module.exports = memoryRoom;