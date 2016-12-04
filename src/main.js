var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleSpawner = require('role.spawner');
var roleRepairer = require('role.repairer');

module.exports.loop = function () {

	//First clean up memory
	cleanUpDeadCreepMemory();
    
    var tower = Game.getObjectById('bd05d106b72310b59b08c205');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }

    for(var name in Game.creeps) {
    	var creep = Game.creeps[name];
		
        if(creep.memory.role == 'harvester') {
        	roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        }
    }
    
    for(var name in Game.spawns){
        var spawn = Game.spawns[name];
        if(spawn.memory.role == 'spawner'){
            roleSpawner.run(spawn);
        }
    }


    function cleanUpDeadCreepMemory() {
		//Go through each creep in the memory
    	for (var creepId in Memory.creeps) {
			//Does it exist in the game world?
    		if (!Game.creeps[creepId]) {
				//We need to remove it from the memory
    			delete Memory.creeps[creepId];
			}
		}
    }
}