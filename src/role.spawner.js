/**
ROLE
**/

//Creep Role
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');

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

//What is the minimum creeps per resource in this room?
var MINIMUM_HARVESTERS_PER_RESOURCE = 1;
var MINIMUM_UPGRADERS_PER_ROOM = 1;
var MINIMUM_BUILDERS_PER_ROOM = 2;
var MINIMUM_REPAIRERS_PER_ROOM = 2;

//Constants
ROLE_SPAWNER = "spawner";

var roleSpawner = {

	//It has a role
	role: ROLE_HARVESTER,

    /** @param {Spawner} spawner **/
	run: function (spawner) {

		//Handling making harvesters for all resources in the room
		roleSpawner.handleHarvesters(spawner);

        //Figure out how many creeps are harvesters
        var totalHarvesters = 0;
        var totalUpgraders = 0;
        var totalBuilders = 0;
        var totalRepairers = 0;
        var roomCreeps = spawner.room.find(FIND_MY_CREEPS)
        for(var creepIndex in roomCreeps) {
            
            var creep = roomCreeps[creepIndex]
            
            if(creep.memory.role == ROLE_HARVESTER) {
                totalHarvesters = totalHarvesters + 1;
            }
            if(creep.memory.role == ROLE_UPGRADER) {
                totalUpgraders = totalUpgraders + 1;
            }
            if(creep.memory.role == ROLE_BUILDER) {
                totalBuilders = totalBuilders + 1;
            }
            if(creep.memory.role == ROLE_REPAIRER){
                totalRepairers = totalRepairers + 1;
            }
        }
        
        //How many resources are there?
        var sources = spawner.room.find(FIND_SOURCES);
        var totalSources = sources.length;
        
        //Do we need more?
        console.log(totalHarvesters + ' ' + totalUpgraders + ' ' + totalBuilders + ' ' + totalRepairers)
        var requiredHarvesters = MINIMUM_HARVESTERS_PER_RESOURCE * totalSources;
        var enoughHarvesters = totalHarvesters >= requiredHarvesters
        if(!enoughHarvesters){
            
        }else{
            //We can make other stuff
            //Enough upgraders?
            if(MINIMUM_UPGRADERS_PER_ROOM > totalUpgraders){
                //Make one
                console.log("Need a Upgrader");
                newCreep = spawner.createCreep([MOVE, WORK, CARRY], {role: "upgrader"});
            }
            
            //Enough builders?
            if(MINIMUM_BUILDERS_PER_ROOM > totalBuilders){
                //Make one
            	roleSpawner.spawnBuilder(spawner);
            }
            
            //Enough repairers?
            if(MINIMUM_REPAIRERS_PER_ROOM > totalRepairers){
                //Make one
                console.log("Need a Repairer");
                newCreep = spawner.createCreep([MOVE, WORK, CARRY, CARRY], {role: "repairer"});
            }
        }
	},

	handleHarvesters: function (spawner) {
		//Go through each source in the room
		var roomMemory = memoryRoom.getRoomMemory(spawner.room.name);
		var sources = roomMemory.sources;
		for (let sourceId in sources) {
			//Get the memory for that source
			var sourceMemory = sources[sourceId];

			//Does it need another guy?
			var assignedHarvesterCount = sourceMemory.assignedHarvesters.length;

			//Do we need more?
			if (assignedHarvesterCount < sourceMemory.maxHarvesters) {
				//Build one
				roleSpawner.spawnHarvester(spawner, sourceMemory);
			}
		}
	},

	spawnHarvester: function (spawner, sourceMemory) {
		//We need to create one
		console.log("Need a Harvester");

		//Get the memory and parts
		harvesterParts = roleHarvester.basicHarvesterParts;
		harvesterMemory = memoryHarvester.memoryPrototype(sourceMemory.id);
		

		//Attempt to make it
		newCreep = spawner.createCreep(harvesterParts, harvesterMemory);

		//Did we make one?
		if (_.isString(newCreep)) {
			//We can hold onto it
			sourceMemory.assignedHarvesters.push(newCreep);
		}
	},

	spawnBuilder: function (spawner) {
		//We need to create one
		console.log("Need a Builder");

		//Get the memory and parts
		builderParts = roleBuilder.basicBuilderParts;
		builderMemory = memoryBuilder.memoryPrototype();

		//Attempt to make it
		newCreep = spawner.createCreep(builderParts, builderMemory);
	}
};

module.exports = roleSpawner;