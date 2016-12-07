//Constants
ROLE_UPGRADER = "upgrader";


var roleUpgrader = {

	//It has a role value
	role: ROLE_UPGRADER,

	//What are the types of harvester we'll make?
	basicUpgraderParts: [MOVE, WORK, CARRY],

    /** @param {Creep} creep **/
	run: function (creep) {

		//Is it upgrading?
		if (creep.memory.upgrading) {
			//We need to move to and upgrad the room
			var targetController = Game.getObjectById(creep.memory.targetId);

			if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
				//Move to it then
				creep.moveTo(targetController);
			}

			//Do we have any energy left?
			if (creep.carry.energy == 0) {
				//We need to go get more
				beginHarvesting(creep);
				
			}
		} else {
			//Continue getting resources
			if (!creep.memory.targetId) {
				//Keep looking...
				beginHarvesting(creep);
			}

			//Do we have something?
			if (creep.memory.targetId) {
				//We can move to the target
				var targetStructure = Game.getObjectById(creep.memory.targetId);
				if (creep.withdraw(targetStructure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					//We need to move closer
					creep.moveTo(targetStructure);
				}

				//Do we have enough energy?
				if (creep.carry.energy == creep.carryCapacity) {
					//We can go upgrade
					beginUpgrading(creep);
				}
			}
		}
	}
};

var beginHarvesting = function (creep) {
	//We aren't building any more
	creep.say("Need Energy");
	creep.memory.upgrading = false;
	creep.memory.targetId = null;

	var targetId = findWithdrawTargetId(creep);

	//Save that
	creep.memory.targetId = targetId;
}

var beginUpgrading = function (creep) {
	//We need to find something to build
	creep.say("Upgrading!");

	//We're upgrading this room's controller
	creep.memory.targetId = creep.room.controller.id;
	creep.memory.upgrading = true;
}


var findWithdrawTargetId = function (creep) {
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
	if (!target) {
		//We need to just look for any valid structure
		target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
			filter: (structure) => {
				return structure.energy > creep.carryCapacity;
			}
		});
	}

	//Return that target
	if (target) {
		targetId = target.id;
	}


	//Return that id
	return targetId
}



module.exports = roleUpgrader;