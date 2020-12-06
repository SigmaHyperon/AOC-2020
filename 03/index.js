const fs = require("fs");

const tree = "#";

const data = fs.readFileSync("input.txt");
const values = data.toString().split("\n");

function isTree(line, x) {
	let i = x % line.length;
	if(i == 0) {
		i = 31;
	}
	return [...line][i - 1] === tree;
}

function downhill(slope, drift, stepsize = 1) {
	let x = 1;
	let count = 0;
	for(let i = 0; i < values.length; i += stepsize) {
		if(isTree(values[i], x)) {
			count++;
		}
		x += drift;
	}
	return count;
}



const trees = [
	downhill(values, 1),
	downhill(values, 3),
	downhill(values, 5),
	downhill(values, 7),
	downhill(values, 1, 2)
]

console.log(trees);
console.log(trees.reduce((acc, v) => acc * v, 1));

