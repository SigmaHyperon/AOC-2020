const fs = require("fs");

const data = fs.readFileSync("input.txt");
const values = data.toString().split("\n").filter(v => v.length > 0).map(parseLine);

const bitLength = 36;

function parseLine(line) {
	if(line.match(/mask \= [01X]+/)) {
		return {command: "mask", value: line.match(/[01X]+/)[0]};
	}
	const [, address, value] = line.match(/mem\[(\d+)\] \= (\d+)/);
	return{command: "mem", address: parseInt(address), value: parseInt(value)};
}

function toBinary(integer, length) {
	const numberString = (integer >>> 0).toString(2);
	return `${Array.from(Array(length - numberString.length), v => "0").join("")}${numberString}`;
}

function fromBinary(string) {
	return parseInt(string, 2);
}

function applyMaskToValue(value, mask) {
	const string = toBinary(value, bitLength);
	return fromBinary([...string].map((v, i) => mask[i] === "X" ? v : mask[i]).join(""));
}


class Decoder{
	constructor(showMemorySize = false) {
		this.showMemorySize = showMemorySize;
	}
	reset() {
		this.mask = "";
		this.memory = new Map();
	}

	execute(command) {
		if(command.command === "mask") {
			this.mask = command.value;
		} else if(command.command === "mem") {
			this.memory.set(command.address, applyMaskToValue(command.value, this.mask));
		} else {
			throw `invalid command '${command.command}'`;
		}
	}

	run(list) {
		this.reset();
		for(let c of list) {
			this.execute(c);
		}
		if(this.showMemorySize) {
			console.log(`memory size: ${Array.from(this.memory.values()).length}`);
		}
		return Array.from(this.memory.values()).reduce((acc, v) => acc + v, 0);
	}
}

console.time("time");
const part1 = new Decoder();
console.log("part1:",part1.run(values));
console.timeEnd("time");

function applyMaskToAddress(address, mask) {
	const pre = [...toBinary(address, mask.length)].map((v, i) => mask[i] == 0 ? v : mask[i]).join("");
	const xCount = [...mask].filter(v => v === "X").length;
	const numbers = Array.from(Array(Math.pow(2, xCount)), (v, i) => toBinary(i, xCount));
	return numbers.map(v => replaceX(pre, v));
}

function replaceX(string, combination) {
	const c = [...combination];
	const s = [...string];
	for(let digit of c) {
		s[s.indexOf("X")] = digit;
	}
	return s.join("");
}

class DecoderV2 extends Decoder {
	execute(command) {
		if(command.command === "mask") {
			this.mask = command.value;
		} else if(command.command === "mem") {
			const addressList = applyMaskToAddress(command.address, this.mask);
			for(let address of addressList) {
				this.memory.set(fromBinary(address), command.value);
			}
		} else {
			throw `invalid command '${command.command}'`;
		}
	}
}

console.time("time");
const part2 = new DecoderV2();
console.log("part2:",part2.run(values));
console.timeEnd("time");