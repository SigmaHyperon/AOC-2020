const fs = require("fs");

const data = fs.readFileSync("input.txt");
const values = data.toString().split("\n\n").map(parseLine);

function parseLine(line) {
	const people = [...line].filter(v => v === "\n").length + 1;
	const answers = {};
	for(let i = 0; i < line.length; i++) {
		const char = line[i];
		if(char.match(/\w/)) {
			if(typeof answers[char] === "undefined") {
				answers[char] = 1;
			} else {
				answers[char]++;
			}
		}
	}
	return {people, answers};
}

function groupAnswerCount01(line) {
	return Object.keys(line?.answers).length;
}
function groupAnswerCount02(line) {
	return Object.entries(line?.answers).filter(v => v[1] === line?.people).length;
}

console.log(`total answers: ${values.map(groupAnswerCount01).reduce((acc,v) => acc + v, 0)}`);
console.log(`total answers all: ${values.map(groupAnswerCount02).reduce((acc,v) => acc + v, 0)}`);