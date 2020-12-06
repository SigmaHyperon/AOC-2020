const fs = require("fs");

function parseLine(line) {
	const res = line.match(/([a-z]{3}):(\S+)/g).map(v => v.match(/([a-z]{3}):(\S+)/));
	const p = {};
	for(let i = 0; i < res.length; i++) {
		p[res[i][1]] = res[i][2];
	}
	return p;
}

const data = fs.readFileSync("input.txt");
const values = data.toString().split("\n\n").map(v => parseLine(v));

const required = [
	// "cid",
	"byr",
	"iyr",
	"eyr",
	"hgt",
	"hcl",
	"ecl",
	"pid"
];

function hasAllRequiredFields(line, required) {
	const keys = Object.keys(line);
	for(let j = 0; j < required.length; j++) {
		if(keys.indexOf(required[j]) == -1) {
			return false;
		}
	}
	return true;
}

function isValidByr(line) {
	return isBetween(line?.byr, 1920, 2002);
}

function isValidIyr(line) {
	return isBetween(line?.iyr, 2010, 2020);
}

function isValidEyr(line) {
	return isBetween(line?.eyr, 2020, 2030);
}

function isValidHgt(line) {
	const value = line?.hgt;
	const res = value?.match(/(\d{2,3})(in|cm)/);
	if(res == null) {
		return false;
	}
	if(res[2] === "cm") {
		return isBetween(res[1], 150, 193);
	} else if(res[2] === "in") {
		return isBetween(res[1], 59, 76);
	}
	return false;
}

function isValidHcl(line) {
	return line?.hcl?.match(/\#[a-f0-9]{6}/)?.length == 1;
}

function isValidEcl(line) {
	const valid = ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"];
	return valid.indexOf(line?.ecl) != -1;
}

function isValidPid(line) {
	return line?.pid?.match(/\d{9}/)?.length == 1;
}

function isBetween(check, lower, higher) {
	return check >= lower && check <= higher;
}

function isValid(line) {
	return hasAllRequiredFields(line, required)
		&& isValidByr(line)
		&& isValidIyr(line)
		&& isValidEyr(line)
		&& isValidHgt(line)
		&& isValidHcl(line)
		&& isValidEcl(line)
		&& isValidPid(line);
}



function validate(values) {
	const val = values.filter(isValid);
	return val.length;
}

console.log(validate(values, required));