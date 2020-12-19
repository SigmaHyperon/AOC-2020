const fs = require("fs");

function parse(file) {
	const data = fs.readFileSync(file);
	const values = data.toString().split("\n\n").filter(v => v.length > 0);
	
	const rules_ = values[0].split("\n").map(parseRule);
	const strings = values[1].split("\n");
	
	function parseRule(line) {
		const index = parseInt(line.match(/(\d+)\:/)[1]);
		let type = "";
		let content = [];
		if(line.includes("\"")) {
			type = "char";
			content.push(line.match(/\"(\w)\"/)[1]);
		} else if(line.includes("|")) {
			const res = line.split(":")[1].split("|");
			type = "or";
			content = [res[0].split(" ").filter(v => v.length > 0).map(v => parseInt(v)), res[1].split(" ").filter(v => v.length > 0).map(v => parseInt(v))];
		} else {
			type = "list";
			content = line.match(/[\d\s]+/g)[1].split(" ").filter(v => v.length > 0).map(v => parseInt(v));
		}
		return {index, type, content};
	}
	
	const rules = new Map();
	for(let line of rules_) {
		rules.set(line.index, line);
	}
	return {rules, strings};
}

function toRegex(rules, start) {
	const rule = rules.get(start);
	if(rule.type === "char") {
		return rule.content[0];
	} else if(rule.type === "list") {
		const parts = rule.content.map(v => toRegex(rules, v));
		return `(${parts.join("")})`;
	} else if(rule.type === "or") {
		let partA = rule.content[0].map(v => toRegex(rules, v)).join("");
		if(rule.content[1].length === 2 && rule.content[1].indexOf(rule.index) === rule.content[1].length - 1) {
			return `(${partA})+`;
		} else if (rule.content[1] .length === 3 && rule.content[1].indexOf(rule.index) === rule.content[1].length - 2) {
			return "("+Array.from(Array(20), (v,i) => i + 1).map(v => `(${toRegex(rules, rule.content[1][0])}){${v}}(${toRegex(rules, rule.content[1][2])}){${v}}`).join("|")+")";
		}
		let partB = rule.content[1].map(v => toRegex(rules, v)).join("");
		return `(${partA}|${partB})`;
	} else {
		throw `oh shitfuck`;
	}
}
console.time("time");
const part1 = parse("input.txt");
const string = toRegex(part1.rules, 0);
const reg = new RegExp("^"+string+"$");
console.log("part1:", part1.strings.filter(v => v.match(reg)).length);
console.log("length:",string.length);
console.timeEnd("time");

console.time("time");
const part2 = parse("input2.txt");
const string2 = toRegex(part2.rules, 0);
const reg2 = new RegExp("^"+toRegex(part2.rules, 0)+"$");
console.log("part2:", part2.strings.filter(v => v.match(reg2)).length);
console.log("length:",string2.length);
console.timeEnd("time");
