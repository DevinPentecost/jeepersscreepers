//Memory for each harvester
var memoryUpgrader = {

	//Prototype for a harvester's memory
	memoryPrototype: function () {
		//We want to create a memory block
		var memory = {
			role: ROLE_UPGRADER,
			upgrading: false,
			targetId: null,
		}

		//Return that memory
		return memory;
	},

	destroy: function (creepName) {
		//The creep is no longer here...

		//It needs to not be included in the resource count
		delete Memory.creeps[creepName];
	}
};


module.exports = memoryUpgrader;