var memoryRoom = require('memory.room');

//Memory for each harvester
var memoryHarvester = {

	//Prototype for a harvester's memory
	memoryPrototype: function (targetResourceId) {
		//We want to create a memory block
		var memory = {
			role: ROLE_HARVESTER,
			targetResourceId: targetResourceId
		}

		//Return that memory
		return memory;
	},

	destroy: function (creepName) {
		//The creep is no longer here...

		//It needs to not be included in the resource count
		var sourceId = Memory.creeps[creepName].targetResourceId;

		//Get it's room's memory
		var source = Game.getObjectById(sourceId);
		if (source) {
			//Get that source's room
			var roomMemory = memoryRoom.getRoomMemory(source.room.name);

			//Remove it from the list
			var harvesters = roomMemory.sources[sourceId].assignedHarvesters;
			var harvesterIndex = harvesters.indexOf(creepName)
			console.log("BEFOR HARVE" + harvesters)
			harvesters.splice(harvesterIndex, 1);
			console.log("AFTER HARVE" + harvesters)
			console.log("DOUB VHEC" + roomMemory.sources[sourceId].assignedHarvesters);
		}

		//Finally remove it from memory
		delete Memory.creeps[creepName];
	}
};


module.exports = memoryHarvester;