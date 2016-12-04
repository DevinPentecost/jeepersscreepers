//What is the minimum creeps per resource in this room?
var MINIMUM_HARVESTERS_PER_RESOURCE = 2;
var MINIMUM_UPGRADERS_PER_ROOM = 1;
var MINIMUM_BUILDERS_PER_ROOM = 2;
var MINIMUM_REPAIRERS_PER_ROOM = 2;

var roleSpawner = {

    /** @param {Spawner} spawner **/
    run: function(spawner) {
        //Figure out how many creeps are harvesters
        var totalHarvesters = 0;
        var totalUpgraders = 0;
        var totalBuilders = 0;
        var totalRepairers = 0;
        var roomCreeps = spawner.room.find(FIND_MY_CREEPS)
        for(var creepIndex in roomCreeps) {
            
            var creep = roomCreeps[creepIndex]
            
            if(creep.memory.role == 'harvester') {
                totalHarvesters = totalHarvesters + 1;
            }
            if(creep.memory.role == 'upgrader') {
                totalUpgraders = totalUpgraders + 1;
            }
            if(creep.memory.role == 'builder') {
                totalBuilders = totalBuilders + 1;
            }
            if(creep.memory.role == 'repairer'){
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
            //We need to create one
            console.log("Need a Harvester");
            newCreep = spawner.createCreep([MOVE, WORK, WORK, CARRY], "Harvester", {role: "harvester"});
        }else{
            //We can make other stuff
            //Enough upgraders?
            if(MINIMUM_UPGRADERS_PER_ROOM > totalUpgraders){
                //Make one
                console.log("Need a Upgrader");
                newCreep = spawner.createCreep([MOVE, WORK, CARRY], "Upgrader", {role: "upgrader"});
            }
            
            //Enough builders?
            if(MINIMUM_BUILDERS_PER_ROOM > totalBuilders){
                //Make one
                console.log("Need a Builder");
                newCreep = spawner.createCreep([MOVE, WORK, CARRY, CARRY], "Builder", {role: "builder"});
            }
            
            //Enough repairers?
            if(MINIMUM_REPAIRERS_PER_ROOM > totalRepairers){
                //Make one
                console.log("Need a Repairer");
                newCreep = spawner.createCreep([MOVE, WORK, CARRY, CARRY], "Repairer", {role: "repairer"});
            }
        }
        
        
    }
};

module.exports = roleSpawner;