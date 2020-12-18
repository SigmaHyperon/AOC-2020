const fs = require("fs");

const data = fs.readFileSync("input.txt");
// const data = `.#.
// ..#
// ###`
const values = data.toString().split("\n");

class Spot {
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
	equals(spot) {
		return spot.x === this.x && spot.y === this.y && spot.z === this.z;
	}
	adjacentCoordinates() {
		let surrounding = [];
		for(let x = this.x - 1; x <= this.x + 1; x++) {
			for(let y = this.y - 1; y <= this.y + 1; y++) {
				for(let z = this.z - 1; z <= this.z + 1; z++) {
					const nSpot = new Spot(x, y, z);
					if(!nSpot.equals(this)) {
						surrounding.push(nSpot);
					}
				}
			}
		}
		return surrounding;
	}
}

class Space {
	constructor() {
		this.occupied = [];
	}
	isOccupied(spot) {
		return this.occupied.some(v => spot.equals(v));
	}
	getBorders() {
		const x = this.occupied.map(v => v.x);
		const y = this.occupied.map(v => v.y);
		const z = this.occupied.map(v => v.z);
		return {
			x: {
				min: Math.min(...x),
				max: Math.max(...x)
			},
			y: {
				min: Math.min(...y),
				max: Math.max(...y)
			},
			z: {
				min: Math.min(...z),
				max: Math.max(...z)
			}
		}
	}
	getNextGeneration() {
		const nextSpace = new Space();
		const borders = this.getBorders();
		for(let x = borders.x.min - 1; x <= borders.x.max + 1; x++) {
			for(let y = borders.y.min - 1; y <= borders.y.max + 1; y++) {
				for(let z = borders.z.min - 1; z <=borders.z.max + 1; z++) {
					const spot = new Spot(x, y, z);
					const surrounding = spot.adjacentCoordinates().filter(v => this.isOccupied(v)).length;
					if((this.isOccupied(spot) && surrounding === 2) || surrounding === 3) {
						nextSpace.occupied.push(spot);
					}
				}
			}
		}
		return nextSpace;
	}

	print() {
		const borders = this.getBorders();
		for(let z = borders.z.min; z <=borders.z.max; z++) {
			console.log("z=",z);
			for(let x = borders.x.min; x <= borders.x.max; x++) {
				for(let y = borders.y.min; y <= borders.y.max; y++) {
					const spot = new Spot(x, y, z);
					if(this.isOccupied(spot)) {
						process.stdout.write("#");
					} else {
						process.stdout.write(".");
					}
				}
				console.log();
			}
		}
	}

	occupiedCount() {
		return this.occupied.length;
	}
}

function parseInput(input) {
	const space = new Space();
	for(const [xIndex, line] of input.entries()) {
		for(const [yIndex, block] of [...line].entries()) {
			if(block === "#") {
				space.occupied.push(new Spot(xIndex, yIndex, 0));
			}
		}
	}
	return space;
}

let part1 = parseInput(values);
for(let i = 0; i < 6; i++) {
	part1 = part1.getNextGeneration();
}
console.log("part1:", part1.occupiedCount());
