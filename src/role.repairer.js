//Constants
ROLE_REPAIRER = "repairer";
REPAIR_THRESHOLD_PERCENTAGE = 0.3;

var roleRepairer = {

	//It has a role value
	role: ROLE_REPAIRER,

	//What are the types of harvester we'll make?
	basicRepairerParts: [MOVE, WORK, CARRY, CARRY],

	/** @param {Creep} creep **/
	run: function (creep) {

		//Is it currently repairing?
		if (creep.memory.repairing) {

			//Attempt to repair...
			var repairTarget = Game.getObjectById(creep.memory.targetId);
			var repairResult = creep.repair(repairTarget);

			//Were we too far away?
			if (repairResult == ERR_NOT_IN_RANGE) {
				//We need to move to it
				creep.moveTo(repairTarget);
			} else if (repairResult == ERR_INVALID_TARGET) {
				//We are done repairing I guess
				beginHarvesting(creep);
			}

			//Are we out of energy now?
			if (creep.carry.energy == 0) {
				//We can't repair. Go look for food...
				beginHarvesting(creep);
			}
		} else {
			//We are not repairing. We need to get resources

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
				//We can repair
				beginRepairing(creep);
			}
		}		
	},




};

module.exports = roleRepairer;


var beginHarvesting = function (creep) {
	//We aren't repairing any more
	creep.say("Need Energy");
	creep.memory.repairing = false;
	creep.memory.targetId = null;

	var targetId = findWithdrawTargetId(creep);

	//Save that
	creep.memory.targetId;
}

var beginRepairing = function (creep) {
	//We need to find something to repair
	creep.say("Repairing!");

	//Try to find something
	var repairTarget = creep.pos.findClosestByRange(FIND_STRUCTURES, {
		filter: (structure) => {
			return structure.hits < structure.hitsMax * REPAIR_THRESHOLD_PERCENTAGE;
		}

	});
	if (repairTarget) {
		//We can start repairing
		creep.memory.repairing = true;
		creep.memory.targetId = repairTarget.id;
	}
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
				return structure.energy == structure.energyCapacity;
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

module.exports = roleRepairer;