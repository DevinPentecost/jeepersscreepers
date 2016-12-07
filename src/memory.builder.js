//Memory for each builder
var memoryBuilder = {

	//Prototype for a builder's memory
	memoryPrototype: function () {
		//We want to create a memory block
		var memory = {
			role: ROLE_BUILDER,
			building: false,
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


module.exports = memoryBuilder;