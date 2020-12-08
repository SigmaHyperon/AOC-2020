const fs = require("fs");

const data = fs.readFileSync("input.txt");
const values = data.toString().split("\n").map(parseLine).filter(v => v !== null);

function parseLine(line) {
	if(line === null || line.length === 0) {
		return null;
	}
	let [ , instruction, argument] = line.match(/(\w+) ([\+\-]\d+)/);
	argument = parseInt(argument);
	return {instruction, argument};
}

class fsm {
	constructor() {
		this.reset();
	}

	executeInstruction(command) {
		switch(command.instruction) {
			case "acc" :
				this.acc += command.argument;
				this.ip++;
				break;
			case "jmp":
				this.ip += command.argument;
				break;
			case "nop":
				if((this.ip + command.argument) >= 600) {
					console.log(this.ip);
				}
				this.ip++;
				break;
			default:
				throw `invalid instruction '${command}'`;
		}
	}

	reset() {
		this.acc = 0;
		this.ip = 0;
	}

	run(commands) {
		this.reset();
		const visited = new Set();
		while(!visited.has(this.ip)) {
			if(this.ip >= commands.length) {
				return 0;
			}
			visited.add(this.ip);
			this.executeInstruction(commands[this.ip]);
		}
		return 1;
	}
}

const part1 = new fsm();
part1.run(values);
console.log(part1.acc);

function generatePermutations(commands, from, to) {
	const list = [];
	for(let i = 0; i < commands.length; i++) {
		const instruction = commands[i].instruction
		if(instruction === from) {
			const copy = commands.map(v => Object.assign({}, v));
			copy[i].instruction = to;
			list.push(copy);
		}
	}
	return list;
}

const part2 = new fsm();
const part2IS = [...generatePermutations(values, "jmp", "nop"), ...generatePermutations(values, "nop", "jmp")];

for(let i = 0; i < part2IS.length; i++) {
	const status = part2.run(part2IS[i]);
	if(status === 0) {
		break;
	}
}

console.log(part2.acc);