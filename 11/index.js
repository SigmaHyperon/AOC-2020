const fs = require("fs");

const data = fs.readFileSync("input.txt");
const values = data.toString().split("\n");

const rowLength = values[0].length;

const sequence = values.flatMap(v => v.split(''));

function integers(length) {
	return Array.from(Array(length),(x,i)=>i).map(v => v+1);
}

function getSurrounding(index, list, stepSize = 1) {
	const toTop = Math.floor(index / rowLength);
	const toLeft = index % rowLength;
	const toRight = rowLength - index % rowLength - 1;
	const toBottom = list.length / rowLength - Math.ceil(index / rowLength);
	let indices = [];
	indices.push(integers(Math.min(toLeft, toTop, stepSize)).map(v => index - v * rowLength - v * 1));
	indices.push(integers(Math.min(toTop, stepSize)).map(v => index - v * rowLength));
	indices.push(integers(Math.min(toRight, toTop, stepSize)).map(v => index - v * rowLength + v * 1));
	indices.push(integers(Math.min(toLeft, stepSize)).map(v => index - v * 1));
	indices.push(integers(Math.min(toRight, stepSize)).map(v => index + v * 1));
	indices.push(integers(Math.min(toLeft, toBottom, stepSize)).map(v => index + v * rowLength - v * 1));
	indices.push(integers(Math.min(toBottom, stepSize)).map(v => index + v * rowLength));
	indices.push(integers(Math.min(toRight, toBottom, stepSize)).map(v => index + v * rowLength + v * 1));
	return indices.map(v => v.map(k => list[k]).find(k => k === "L" || k === "#")).filter(v => v !== undefined);
}

function generation(list, allowedOccupied, stepSize) {
	const nextGen = [];
	let changed = false;
	for(let i = 0; i < list.length; i++) {
		const surrounding = getSurrounding(i, list, stepSize);
		if(list[i] === "L" && !surrounding.some(v => v === "#")) {
			nextGen.push("#");
			changed = true;
			continue;
		}
		if(list[i] === "#" && surrounding.filter(v => v === "#").length >= allowedOccupied) {
			nextGen.push("L");
			changed = true;
			continue;
		}
		nextGen.push(list[i]);
	}
	return {list: nextGen, changed};
}

function run(sequence, allowedOccupied, stepSize) {
	let list = [...sequence];
	let changed = false;
	do {
		const result = generation(list, allowedOccupied, stepSize);
		list = result.list;
		changed = result.changed;
	} while(changed);
	return list.filter(v => v === "#").length;
}

console.log("part1: "+run(sequence, 4, 1));
console.log("part2: "+run(sequence, 5, rowLength));
