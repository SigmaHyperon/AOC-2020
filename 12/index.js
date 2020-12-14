const fs = require("fs");

const data = fs.readFileSync("input.txt");
const values = data.toString().split("\n").filter(v => v.length > 0).map(parseLine);

function parseLine(line) {
	const res = line.match(/([NSEWLRF])(\d+)/);
	return {c: res[1], d: parseInt(res[2])};
}

const directions = ["N", "E", "S", "W"];
const reverse = [...directions].reverse();

function sin(degrees) {
	return [0, 1, 0 , -1][degrees % 360 / 90];
}
function cos(degrees) {
	return [1, 0 , -1, 0][degrees % 360 / 90];
}

class Ferry{
	reset() {
		this.north = 0;
		this.east = 0;
		this.waypoint = {};
		this.waypoint.north = 1;
		this.waypoint.east = 10;
		this.direction = "E";
	}

	executeManeuver(m) {
		switch(m.c) {
			case "N":
				this.north += m.d;
				break;
			case "E":
				this.east += m.d;
				break;
			case "S":
				this.north -= m.d;
				break;
			case "W":
				this.east -= m.d;
				break;
			case "R":
				this.direction = [...directions, ...directions].slice(directions.indexOf(this.direction))[(m.d % 360) / 90];
				break;
			case "L":
				this.direction = [...reverse, ...reverse].slice(reverse.indexOf(this.direction))[(m.d % 360) / 90];
				break;
			case "F":
				this.executeManeuver({c: this.direction, d: m.d});
				break;
			default:
				throw `invalid maneuver '${m.c}'`;
		}
	}

	executeWaypointManeuver(m) {
		let north = this.waypoint.north;
		let east = this.waypoint.east;
		switch(m.c) {
			case "N": 
				this.waypoint.north += m.d;
				break;
			case "E": 
				this.waypoint.east += m.d;
				break;
			case "S":
				this.waypoint.north -= m.d;
				break;
			case "W":
				this.waypoint.east -= m.d;
				break;
			case "F":
				this.north += m.d * this.waypoint.north;
				this.east += m.d * this.waypoint.east;
				break;
			case "R":
				this.waypoint.north = cos(m.d) * north - sin(m.d) * east;
				this.waypoint.east = sin(m.d) * north + cos(m.d) * east;
				break;
			case "L":
				this.waypoint.north = cos(m.d) * north + sin(m.d) * east;
				this.waypoint.east = - sin(m.d) * north + cos(m.d) * east;
				break;
			default:
				throw `invalid maneuver '${m.c}'`;
		}
	}

	run(maneuvers, waypointMode = false) {
		this.reset();
		for(let m of maneuvers) {
			if(waypointMode) {
				this.executeWaypointManeuver(m);
			} else {
				this.executeManeuver(m);
			}
		}
		return Math.abs(this.north) + Math.abs(this.east);
	}
}

const part1 = new Ferry();
console.log("part1: "+ part1.run(values));

const part2 = new Ferry();
console.log("part2: "+ part2.run(values, true));
