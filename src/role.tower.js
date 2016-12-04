var HEAL_UPPER_LIMIT = .3

var roleTower = {

	/** @param {Creep} creep **/
	run: function (tower) {
		//First we try to heal
		healTargetStructure(tower);

		//Next we defend
		attackTargetHostile(tower);
	}
};

function getTowerMemory(tower) {
	//Get the room for the tower
	var towerRoom = tower.room;

	//Get the memory from the room
	var roomMemory = towerRoom.memory

	//Does it have tower memory?
	var towerMemories = roomMemory.towerMemories

	//And get the memory for that specific tower
	var towerMemory = towerMemories[tower.id];
}

function setTowerMemory(tower, towerMemory) {
	//Get the room for the tower
	var towerRoom = tower.room;

	//Get the memory from the room
	var roomMemory = towerRoom.memory

	//Set the memory for this tower
	roomMemory.towerMemories[tower.id] = towerMemory
}

function healTargetStructure(tower) {
	//The tower should have a target in it's memory
	var towerMemory = getTowerMemory(tower);
	var healTarget = towerMemory.healTarget;

	//Does it have one?
	if (healTarget) {
		//Heal it
		tower.repair(healTarget);

		//Is it healed up?
		if (healTarget.hits > healTarget.hitsMax * HEAL_UPPER_LIMIT) {
			//Set the memory to have no heal target
			towerMemory.healTarget = null;
			setTowerMemory(tower, towerMemory);

		}
	} else {
		//See if something needs healing
		towerMemory.healTarget = findNearestDamagedStructure(tower);
		setTowerMemory(tower, towerMemory);
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
	var towerMemory = getTowerMemory(tower);
	var attackTarget = towerMemory.attackTarget;

	//Does it have one?
	if (attackTarget) {
		//Attack it
		var attackResult = tower.attack(target);

		//Can it attack?
		if (attackResult != OK) {
			//We need to stop attacking this target
			towerMemory.attackTarget = null;
			setTowerMemory(tower, towerMemory);
		}
	} else {
		//See if something needs healing
		towerMemory.attackTarget = findNearestAttackTarget(tower);
		setTowerMemory(tower, towerMemory);
	}
}

function findNearestAttackTarget(tower) {
	//Look for them, ignoring walls
	var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

	//Return that
	return closestHostile;
}

module.exports = roleTower;