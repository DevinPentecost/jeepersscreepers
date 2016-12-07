//Constants
ROLE_BUILDER = "builder";


var roleBuilder = {

	//It has a role value
	role: ROLE_BUILDER,

	//What are the types of builder we'll make?
	basicBuilderParts: [MOVE, WORK, CARRY, CARRY],

    /** @param {Creep} creep **/
	run: function (creep) {

		//Is it currently building?
		if (creep.memory.building) {

			//Attempt to build...
			var buildTarget = Game.getObjectById(creep.memory.targetId);
			var buildResult = creep.build(buildTarget);

			//Were we too far away?
			if (buildResult == ERR_NOT_IN_RANGE) {
				//We need to move to it
				creep.moveTo(buildTarget);
			} else if (buildResult == ERR_INVALID_TARGET) {
				//We are done building I guess
				beginHarvesting(creep);
			}

			//Are we out of energy now?
			if (creep.carry.energy == 0) {
				//We can't build. Go look for food...
				beginHarvesting(creep);
			}
		} else {
			//We are not building. We need to get resources

			//Are we full on resources?
			if (creep.carry.energy < creep.carryCapacity) {

				//Do we have a target?
				var target = Game.getObjectById(creep.memory.targetId)
				if (target) {
					//We can move and collect
					if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
						//Move to it
						creep.moveTo(target)
					}
				} else {
					//We need to keep looking?
					var targetId = findWithdrawTargetId(creep);
					creep.memory.targetId = targetId;
				}
			} else {
				//We can build
				beginBuilding(creep);
			}
		}
	},	
};

var beginHarvesting = function (creep) {
	//We aren't building any more
	creep.say("Need Energy");
	creep.memory.building = false;
	creep.memory.targetId = null;

	var targetId = findWithdrawTargetId(creep);

	//Save that
	creep.memory.targetId = targetId;
}

var beginBuilding = function (creep) {
	//We need to find something to build
	creep.say("Building!");
		
	//Try to find something
	var buildTarget = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
	if (buildTarget) {
		//We can start building
		creep.memory.building = true;
		creep.memory.targetId = buildTarget.id;
	}
}


var findWithdrawTargetId = function(creep){
	//Find something with enough energy
	//Start with a container or other storage
	var targetId = null;
	var target = null;
	target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
		filter: (structure) => {
			return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) && structure.store[RESOURCE_ENERGY] > creep.carryCapacity;
		}
	});

	//But if we can't find one, use the other
	if(!target){
		//We need to just look for any valid structure
		target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
			filter: (structure) => {
				return structure.energy > creep.carryCapacity;
			}
		});
	}

	//Return that target
	if(target){
		targetId = target.id;
	}


	//Return that id
	return targetId
}

module.exports = roleBuilder;