const fs = require("fs");

const preamble_length = 25;

const data = fs.readFileSync("input.txt");
const values = data.toString().split("\n").map(v => parseInt(v)).filter(v => v !== null);

function arrayWithout(array, index) {
	return [...array.slice(0, index), ...array.slice(index + 1)];
}

function isValid(value, preamble) {
	const toFind = preamble.map(v => value - v);
	return toFind.some((v, i) => typeof arrayWithout(preamble, i).find(k => k === v) !== "undefined");
}

let currentIndex = preamble_length;
while(isValid(values[currentIndex], values.slice(currentIndex - preamble_length, currentIndex))) {
	currentIndex++;
}
const firstBreak = values[currentIndex];
console.log("part1: " + firstBreak);

for(let i = 0; i < values.length; i++) {
	let sum = values[i];
	const remaining = values.slice(i + 1);
	let counter = 1;
	while(sum < firstBreak) {
		sum += remaining.splice(0, 1)[0];
		counter++;
	}
	if(sum === firstBreak && counter > 0) {
		const min = Math.min(...values.slice(i, i + counter));
		const max = Math.max(...values.slice(i, i + counter));
		console.log("part2: " +(min+max));
		break;
	}
}