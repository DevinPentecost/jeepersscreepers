var roleTower = {

	/** @param {Creep} creep **/
	run: function (tower) {
		//First we try to heal
		healNearestStructure(tower);

		//Next we defend
		attackClosestHostile(tower);
	}
};

function healNearestStructure(tower) {
	//Find the closest critically damaged structure
	var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
		filter: (structure) => structure.hits < structure.hitsMax / 3
	});

	//Did we find anything?
	if (closestDamagedStructure) {
		//Launch a heal beam
		tower.repair(closestDamagedStructure);
	}
}

function attackClosestHostile(tower) {
	//Find the closest critically damaged structure
	var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

	//Did we find anything?
	if (closestHostile) {
		//Launch a heal beam
		tower.attack(closestHostile);
	}
}

module.exports = roleTower;