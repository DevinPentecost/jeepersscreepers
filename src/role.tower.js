var roleTower = {

	/** @param {Creep} creep **/
	run: function (tower) {
		//First we try to heal
		healTargetStructure(tower);

		//Next we defend
		attackTargetHostile(tower);
	}
};

function healTargetStructure(tower) {
	//The tower should have a target in it's memory
	var target = tower.healTarget;

	//Does it have one?
	if (target) {
		//Heal it
		tower.repair(target);
	} else {
		//See if something needs healing
		tower.healTarget = findNearestDamagedStructure(tower);
	}
}

function findNearestDamagedStructure(tower) {
	//Look for them, ignoring walls
	var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
		filter: (structure) => (structure.hits < structure.hitsMax / 3) && (structure.structureType != STRUCTURE_WALL)
	});

	//Return that
	return closestDamagedStructure;
}

function attackTargetHostile(tower) {
	//The tower should have a target in it's memory
	var target = tower.attackTarget;

	//Does it have one?
	if (target) {
		//Heal it
		tower.attack(target);
	} else {
		//See if something needs healing
		tower.attackTarget = findNearestAttackTarget(tower);
	}
}

function findNearestAttackTarget(tower) {
	//Look for them, ignoring walls
	var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

	//Return that
	return closestHostile;
}

module.exports = roleTower;