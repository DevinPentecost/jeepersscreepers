//Constants
ROLE_REPAIRER = "repairer";

var roleRepairer = {

	//It has a role value
	role: ROLE_REPAIRER,

	/** @param {Creep} creep **/
	run: function (creep) {
		if (creep.carry.energy == 0) {
			var containers = creep.room.find(FIND_STRUCTURES, {
				filter: (structure) => {
					return (structure.structureType == STRUCTURE_CONTAINER) && structure.store[RESOURCE_ENERGY] > creep.carryCapacity;
				}
			});
			if (containers.length > 0) {
				container = containers[0];
				if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(container);
				}
			} else {
				var sources = creep.room.find(FIND_SOURCES);
				if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
					creep.moveTo(sources[0]);
				}
			}
		}
		else {
			var roadToRepair = creep.pos.findClosestByRange(FIND_STRUCTURES, {
				filter: function (object) {
					return object.structureType === STRUCTURE_ROAD && (object.hits < object.hitsMax / 3);
				}
			});

			if (roadToRepair) {
				creep.moveTo(roadToRepair);
				creep.repair(roadToRepair);

				// perhaps check the results again?

			} else {

				// nothing to repair, let's do something else?

			}
		}
	}
};

module.exports = roleRepairer;