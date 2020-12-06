const fs = require("fs");

const data = fs.readFileSync("input.txt");
const values = data.toString().split("\n\n").map(parseLine);

function parseLine(line) {
	const people = line.split("\n").length;
	const answers = [...(line.replace(/\n/g, ""))].reduce((acc,v) => (acc[v] = (acc[v] || 0) + 1, acc), {});
	return {people, answers};
}

function groupAnswerCount01(line) {
	return Object.keys(line?.answers).length;
}
function groupAnswerCount02(line) {
	return Object.values(line?.answers).filter(v => v === line?.people).length;
}

console.log(`total answers: ${values.map(groupAnswerCount01).reduce((acc,v) => acc + v, 0)}`);
console.log(`total answers all: ${values.map(groupAnswerCount02).reduce((acc,v) => acc + v, 0)}`);