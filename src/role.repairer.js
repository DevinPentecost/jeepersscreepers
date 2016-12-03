var roleRepairer = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    if(creep.energy === 0) {
            var spawn = creep.pos.findClosestByRange(FIND_MY_SPAWNS);
            var moveResult = creep.moveTo(spawn);
            /*
              check moveResult here
            */
            if(spawn.energy > 199) {
                var transferResult = spawn.transferEnergy(creep);
                /*
                    check transferResult here
                */
            }
	    }
        else{
        
            var roadToRepair = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: function(object){
                    return object.structureType === STRUCTURE_ROAD && (object.hits > object.hitsMax / 3);
                } 
            });
        
            if (roadToRepair){
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