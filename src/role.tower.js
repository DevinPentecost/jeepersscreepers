//Constants
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

	//Does it have tower memory?
	if (!("towerMemories" in tower.room.memory)) {
		//Room has no tower memories!
		console.log("Room has no tower memory!");
		tower.room.memory.towerMemories = {}
	}

	//And get the memory for that specific tower
	if (!(tower.id in tower.room.memory.towerMemories)) {
		//Tower does not have memory yet
		console.log("Tower does not have memory yet!");
		var newTowerMemory = {
			healTargetId: null,
			attackTargetId: null,
		};
		setTowerMemory(tower, newTowerMemory);
	}

	//We can get and return the memory
	var towerMemory = tower.room.memory.towerMemories[tower.id];

	//Return it
	return towerMemory
}

function setTowerMemory(tower, towerMemory) {
	//Get the room for the tower
	var towerRoom = tower.room;

	//Set the memory for this tower
	tower.room.memory.towerMemories[tower.id] = towerMemory
}

function healTargetStructure(tower) {
	//The tower should have a target in it's memory
	var towerMemory = getTowerMemory(tower);
	var healTargetId = towerMemory.healTargetId;

	//Does it have one?
	if (healTargetId) {
		//Heal it
		healTarget = Game.getObjectById(healTargetId)
		tower.repair(healTarget);

		//Is it healed up?
		if (healTarget.hits > healTarget.hitsMax * HEAL_UPPER_LIMIT) {
			//Set the memory to have no heal target
			towerMemory.healTargetId = null;
			setTowerMemory(tower, towerMemory);

		}
	} else {
		//See if something needs healing
		var newHealTarget = findNearestDamagedStructure(tower);
		if (newHealTarget) {
			//Store it's ID
			towerMemory.healTargetId = newHealTarget.id;
		} else {
			//No heal target
			towerMemory.healTargetId = null
		}

		//Set the memory
		setTowerMemory(tower, towerMemory);
	}
}

function findNearestDamagedStructure(tower) {
	//Look for them, ignoring walls
	var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
		filter: (structure) => (structure.hits < structure.hitsMax * HEAL_UPPER_LIMIT) && (structure.structureType != STRUCTURE_WALL)
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