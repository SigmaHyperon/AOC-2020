const fs = require("fs");

const data = fs.readFileSync("input.txt");
const values = data.toString().split("\n\n");

const rules = values[0].split("\n").map(parseRule);
const myTicket = values[1].split("\n").slice(1).map(parseTicket)[0];
const otherTickets = values[2].split("\n").filter(v => v.length > 0).slice(1).map(parseTicket);

function parseRule(line) {
	const parts = line.match(/(.+): (\d+)\-(\d+) or (\d+)\-(\d+)/);
	return{name: parts[1], first: [parseInt(parts[2]), parseInt(parts[3])], second: [parseInt(parts[4]), parseInt(parts[5])]};
}

function parseTicket(line) {
	return line.split(",").map(v => parseInt(v));
}

function getErrorRate(ticket, rules) {
	return ticket.filter(v => getMatchingRules(v, rules).length === 0).reduce((acc, v) => acc + v, 0);
}

function getMatchingRules(value, rules) {
	return rules.filter(v => (v.first[0] <= value && v.first[1] >= value) || (v.second[0] <= value && v.second[1] >= value)).map(v => v.name);
}

console.time("time");
console.log("part1:", otherTickets.map(v => getErrorRate(v, rules)).reduce((acc, v) => acc + v, 0));
console.timeEnd("time");

function getFieldSequence(tickets, rules) {
	let fields = new Map();
	for(let ticket of tickets.filter(v => getErrorRate(v, rules) === 0)) {
		for(const [index, value] of ticket.entries()) {
			const mRules = getMatchingRules(value, rules);
			if(!fields.has(index)) {
				fields.set(index, mRules);
			} else if(fields.get(index).length > 1) {
				fields.set(index, fields.get(index).filter(v => mRules.includes(v)));
			}
		}
	}

	fields = Array.from(fields.entries()).sort((a, b) => a[1].length - b[1].length);

	let final = new Map();
	for(let field of fields) {
		final.set(field[1].filter(v => !Array.from(final.keys()).includes(v))[0], field[0]);
	}
	return final;
}

console.time("time");
console.log("part2:",Array.from(getFieldSequence(otherTickets, rules).entries()).filter(v => v[0].startsWith("departure")).map(v => myTicket[v[1]]).reduce((acc, v) => acc * v, 1));
console.timeEnd("time");