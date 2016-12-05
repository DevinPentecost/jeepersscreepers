var roleRoom = {

	/** @param {Room} room**/
	run: function (room) {
		//Do nothing for now
	}
};

function getRoomMemory(roomName) {

	//We want to look into the memory
	if (!("rooms" in Memory)) {
		//We need to add it
		Memory.rooms = {};
	}

	//Is this room in the room memory?
	if (!(roomName in Memory.rooms)) {
		//We add that too
		Memory.rooms[roomName] = memoryRoom.memoryPrototype(roomName);
	}

	//Return the memory
	return Memory.rooms[roomName];
}

module.exports = roleRoom;