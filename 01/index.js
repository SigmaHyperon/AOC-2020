const fs = require("fs");

const toFind = 2020;

const data = fs.readFileSync("input.txt");
const values = data.toString().split("\n").map(v => parseInt(v));

function findPair(list, result) {
	for(let i = 0; i < list.length; i++) {
		const v1 = list[i];
		for(let j = i + 1; j < list.length; j++) {
			if(j < list.length) {
				const v2 = list[j]
				if(v1 + v2 === result) {
					return [v1, v2];
				}
			}
		}
	}
}

function findN(list, find, n) {
	if(n == 2) {
		const res = findPair(list, find);
		return res;
	}
	for(let i = 0; i < list.length; i++) {
		const v1 = list[i];
		const remainingList = list.slice(i+1);
		const remainingFind = find - v1;
		const remainingN = n - 1;
		if(remainingList.length < remainingN || remainingFind < remainingN) {
			continue;
		} else {
			const res = findN(remainingList, remainingFind, remainingN);
			if(res != null) {
				return [v1, ...res];
			}
		}
	}
}

function printResult(n) {
	console.log(`${n.join(" + ")} = ${n.reduce((acc, v) => acc + v, 0)}`);
	console.log(`${n.join(" * ")} = ${n.reduce((acc, v) => acc * v, 1)}`);
}

printResult(findN(values, toFind, 2));
printResult(findN(values, toFind, 3));
