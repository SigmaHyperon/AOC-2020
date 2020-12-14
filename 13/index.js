const fs = require("fs");

const data = fs.readFileSync("input.txt");
const values = data.toString().split("\n").filter(v => v.length > 0);

const timestamp = parseInt(values[0]);
const lines = values[1].split(",").map(v => (v !== "x" ? parseInt(v) : v));
// const lines = [67,7,"x",59,61];

function findNext(timestamp, lines) {
	let time = 0;
	while(true) {
		for(let line of lines) {
			if(line !== "x" && (timestamp + time) % line === 0) {
				return {line,time};
			}
		}
		time++;
	}
}

function modInverse(a, b) {
	if(b === 1) {
		return 0;
	}
	let x = 1;
	while(a*x % b != 1){
		x++;
		if(x > 100000) {
			throw `taking too long: ${a}, ${b}`;
		}
	}
	return x;
}

function crt(n, a) {
	const N = n.reduce((acc, v) => acc * v, 1);
	const y = n.map(v => N / v);
	const z = y.map((v, i) => modInverse(v, n[i]));
	const x = z.reduce((acc, v, i) => a[i]*y[i]*z[i] + acc,0);
	return x % N;
}

function findPattern(start, lines) {
	let time = start;
	const values = Object.entries(lines).filter(v => v[1] !== "x").map(v => [parseInt(v[0]), v[1]]);
	while(true) {
		let i;
		for(i = 0; i< values.length; i++) {
			if((time + values[i][0]) % values[i][1] != 0){
				break;
			}
		}
		if(i === values.length) {
			return time;
		}

		time += values[0][1] - time % values[0][1];
	}
}
console.time("time");
const nextDeparture = findNext(timestamp, lines);
console.log("part1:", nextDeparture.line * nextDeparture.time);
console.timeEnd("time");
console.time("time");
const linesWithOffsets = Object.entries(lines).filter(v => v[1] !== "x").map(v => [parseInt(v[0]), v[1]]);
const n = linesWithOffsets.map(v => v[1]);
const a = linesWithOffsets.map(v => v[0] == 0 ? 0 : v[1] - (v[0] % v[1]));
//fucked up crt, but still gets me close enough to bruteforce the rest
console.log("part2:",findPattern(crt(n, a), lines));
console.timeEnd("time");