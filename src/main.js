/**
ROLE
**/

//Creep Role
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');

//Building Role
var roleSpawner = require('role.spawner');
var roleTower = require('role.tower');
var roleRoom = require('role.room');


/**
MEMORY
**/

//Creep Memory
var memoryHarvester = require('memory.harvester');
var memoryBuilder = require('memory.builder');
var memoryUpgrader = require('memory.upgrader');
var memoryRepairer = require('memory.repairer');

//Building Memory
var memoryRoom = require('memory.room');

/**
END IMPORTS
**/

module.exports.loop = function () {

	//First clean up memory
	cleanUpDeadCreepMemory();

	//Then get the rooms under control
	handleRooms();

	//Handle all structures
	handleStructures();

	//Handle all of the creeps
	handleCreeps();
}

function cleanUpDeadCreepMemory() {
	//Go through each creep in the memory
	for (var creepName in Memory.creeps) {
		//Does it exist in the game world?
		if (!Game.creeps[creepName]) {
			//Destroy it via the handler
			var creepMemory = Memory.creeps[creepName];
			var creepMemoryHandler = getCreepMemoryHandler(creepMemory);
			creepMemoryHandler.destroy(creepName);
		}
	}
}

function handleRooms() {
	//Get all the rooms
	for (let roomName in Memory.rooms) {
		//Act accordingly
		roleRoom.run(roomName);
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
		var creepRoleHandler = getCreepRoleHandler(creep.memory);

		//Run it
		creepRoleHandler.run(creep);
	}
}

function getCreepRoleHandler(creepMemory) {
	//What does it do?
	var role = creepMemory.role;

	//What handler does it use?
	var handler = null;
	if (role == roleHarvester.role){
		//It harvests
		handler = roleHarvester;
	} else if (role == roleUpgrader.role) {
		//It upgrades
		handler = roleUpgrader;
	} else if (role == roleBuilder.role) {
		//It builds
		handler = roleBuilder;
	} else if (role == roleRepairer.role) {
		//It repairs
		handler = roleRepairer;
	}

	//Return the handler
	return handler;
}

function getCreepMemoryHandler(creepMemory) {
	//What does it do?
	var role = creepMemory.role;
	
	//Compare the role
	var handler = null;

	if (role == roleHarvester.role) {
		//It harvests
		handler = memoryHarvester;
	} else if (role == roleUpgrader.role) {
		//It upgrades
		handler = memoryUpgrader;
	} else if (role == roleBuilder.role) {
		//It builds
		handler = memoryBuilder;
	} else if (role == roleRepairer.role) {
		//It repairs
		handler = memoryRepairer;
	}

	//Return the handler
	return handler;
}