//Constants
ROLE_HARVESTER = "harvester";

var roleHarvester = {

	//It has a role value
	role: ROLE_HARVESTER,

	//What are the types of harvester we'll make?
	basicHarvesterParts: [MOVE, WORK, WORK, CARRY],

    /** @param {Creep} creep **/
	run: function (creep) {

		//Can it harvest?
		if (creep.carry.energy < creep.carryCapacity) {
			//We need to get the target resource from it's memory
			var targetResource = Game.getObjectById(creep.memory.targetResourceId);
            
			//Attempt to harvest from it. If we can't, move towards it instead
			if (creep.harvest(targetResource) == ERR_NOT_IN_RANGE) {
				creep.moveTo(targetResource);
            }
        }
        else {
            
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN ||
                            structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }else{
                var containers = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER) && structure.store[RESOURCE_ENERGY] < structure.storeCapacity;
                    }
                });
                if(containers.length > 0){
                    var container = containers[0];
                    if(creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                        creep.moveTo(container);
                    }
                }
            }
        }
    },
};

module.exports = roleHarvester;