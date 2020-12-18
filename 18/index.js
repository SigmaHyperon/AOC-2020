const fs = require("fs");

const data = fs.readFileSync("input.txt");
const values = data.toString().split("\n").map(v => v.replace(/\s/g, "")).filter(v => v.length > 0);

function parseLine(line) {
	let acc = 0;
	let depth = 0;
	let operation = "add";
	for(let i = 0; i < line.length; i++) {
		if(!isNaN(parseInt(line[i]))) {
			if(operation === "add") {
				acc += parseInt(line[i]);
			} else {
				acc *= parseInt(line[i]);
			}
		} else if(line[i] === "*") {
			operation = "mul";
		} else if(line[i] === "+") {
			operation = "add";
		} else {
			let start = i + 1;
			depth++;
			while(depth > 0) {
				i++;
				if(line[i] === "(") {
					depth++;
				} else if(line[i] === ")") {
					depth--;
				}
			}
			let value = parseLine(line.substr(start, i - start));
			if(operation === "add") {
				acc += value;
			} else {
				acc *= value;
			}
		}
	}
	return acc;
}

console.log("part1:", values.map(v => parseLine(v)).reduce((acc, v) => acc + v, 0));

function parseLineAdvanced(line) {
	let parts = [];
	let depth = 0;
	for(let i = 0; i < line.length; i++) {
		if(line[i] === "(") {
			let start = i + 1;
			depth++;
			while(depth > 0) {
				i++;
				if(line[i] === "(") {
					depth++;
				} else if(line[i] === ")") {
					depth--;
				}
			}
			parts.push(parseLineAdvanced(line.substr(start, i - start)));
		} else {
			if(!isNaN(parseInt(line[i]))) {
				parts.push(parseInt(line[i]));
			} else {
				parts.push(line[i]);
			}
		}
	}
	while(parts.includes("+")) {
		let nParts = [];
		for(let k = 0; k < parts.length; k++) {
			if(parts[k+1] === "+") {
				nParts.push(parts[k] + parts[k + 2]);
				k += 2;
			} else {
				nParts.push(parts[k]);
			}
		}
		parts = nParts;
	}
	return parts.filter(v => typeof v === "number").reduce((acc, v) => acc * v, 1);
}

console.log("part2:", values.map(v => parseLineAdvanced(v)).reduce((acc, v) => acc + v, 0));