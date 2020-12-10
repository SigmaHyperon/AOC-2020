const fs = require("fs");

const data = fs.readFileSync("input.txt");
const values = data.toString().split("\n").map(v => parseInt(v)).filter(v => v !== null);

const adaptors = values.sort((a, b) => a - b).filter((v, i) => values.indexOf(v) === i);

const differences = adaptors.map((v, i) => v - (i === 0 ? 0 : adaptors[i - 1]));

const grouped = differences.reduce((acc, v) => (acc[v] = (acc[v] || 0) + 1, acc), {});

console.log(`part1: ${grouped[1] * (grouped[3] + 1)}`);

function tribonacci(n) {
	const list = [0, 0, 1];
	while(n > list.length - 1) {
		list.push(list.slice(list.length - 3).reduce((acc, v) => acc + v, 0));
	}
	return list[n];
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
console.log("part2: "+distances.filter(v => v > 0).map(v => tribonacci(v + 2)).reduce((acc, v) => acc * v, 1));