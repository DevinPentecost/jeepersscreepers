var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleSpawner = require('role.spawner');
var roleRepairer = require('role.repairer');
var roleTower = require('role.tower');

module.exports.loop = function () {

	//First clean up memory
	cleanUpDeadCreepMemory();
    
	//Handle all structures
	handleStructures();

	//Handle all of the creeps
	handleCreeps();
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

function handleStructures() {
	//Lets tell all generic structures to do their work
	for (var structureId in Game.structures) {
		//Get that structure
		var structure = Game.structures[structureId];

		//What structure are we looking at?
		if (structure.structureType == STRUCTURE_TOWER) {
			//It behaves like a tower
			roleTower.run(structure);
		} else if (structure.structureType == STRUCTURE_SPAWN) {
			//It behaves like a spawner
			roleSpawner.run(structure);
		}
	}
}

function handleCreeps() {
	//Go through each creep
	for (var creepId in Game.creeps) {

		//Get the creep
		var creep = Game.creeps[creepId];

		//What does it do?
		if (creep.memory.role == 'harvester') {
			//It harvests
			roleHarvester.run(creep);
		} else if (creep.memory.role == 'upgrader') {
			//It upgrades
			roleUpgrader.run(creep);
		} else if (creep.memory.role == 'builder') {
			//It builds
			roleBuilder.run(creep);
		} else if (creep.memory.role == 'repairer') {
			//It repairs
			roleRepairer.run(creep);
		}
	}
}