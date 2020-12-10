const fs = require("fs");

const data = fs.readFileSync("input.txt");
const values = data.toString().split("\n").map(v => parseInt(v)).filter(v => v !== null);

const adaptors = values.sort((a, b) => a - b).filter((v, i) => values.indexOf(v) === i);

const differences = adaptors.map((v, i) => v - (i === 0 ? 0 : adaptors[i - 1]));

const grouped = differences.reduce((acc, v) => (acc[v] = (acc[v] || 0) + 1, acc), {});

console.log(`part1: ${grouped[1] * (grouped[3] + 1)}`);

function tribonacci(n) {
	if(n < 2) {
		return 0;
	} else if(n < 3) {
		return 1;
	} else {
		return tribonacci(n-3) + tribonacci(n-2) + tribonacci(n-1);
	}
}

function getPossibilities(stepsize) {
	if(stepsize == 0) {
		return 0;
	} else {
		return tribonacci(stepsize + 2)
	}
}

//get indices of all 3s
const indices = differences.map((v, i) => v == 3 ? i : -1).filter(v => v > 0);

//calculate distances between 3s
const distances = indices.map((v, i, a) => i == 0 ? v : v - a[i-1] - 1);

//account for step from last 3 to end
if(differences.length - indices[indices.length - 1] > 1) {
	distances.push(differences.length - indices[indices.length - 1] - 1);
}

//map to possibilities and multiply
console.log("part2: "+distances.filter(v => v > 0).map(getPossibilities).reduce((acc, v) => acc * v, 1));
