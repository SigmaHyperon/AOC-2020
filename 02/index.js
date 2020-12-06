const fs = require("fs");

function parseLine(line) {
	let res = line.match(/(\d{1,2})-(\d{1,2}) ([a-z]): ([a-z]+)/);
	if(res?.length === 5) {
		return {
			min: parseInt(res[1]),
			max: parseInt(res[2]),
			char: res[3],
			pwd: res[4]
		}
	}
}

const data = fs.readFileSync("input.txt");
const values = data.toString().split("\n").map(v => parseLine(v)).filter(v => typeof v !== "undefined");

function isValid01(line) {
	const count = [...(line.pwd)].filter(v => v === line.char).length;
	return line.min <= count && count <= line.max;
}

function isValid02(line) {
	const characters = [...(line.pwd)];
	const char1 = characters[line.min - 1];
	const char2 = characters[line.max - 1];
	return (char1 == line.char) != (char2 == line.char)
}

function validate(func, values) {
	console.log(values.map(v => func(v)).reduce((acc, v) => v ? acc + 1: acc, 0));
}

validate(isValid01, values);
validate(isValid02, values);
