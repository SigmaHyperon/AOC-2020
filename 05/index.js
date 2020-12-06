const fs = require("fs");

const data = fs.readFileSync("input.txt");
const values = data.toString().split("\n").map(parseLine);

function parseLine(line) {
	const unparsedRow = line.substr(0,7);
	const unparsedColumn = line.substr(7,3);

	const row = partitionIndex(unparsedRow, "F");
	const column = partitionIndex(unparsedColumn, "L");

	return {row, column};
}


function partitionIndex(string, lowerIndicator) {
	const separations = [...string];
	let rowlist = [...Array(Math.pow(2, string.length)).keys()]
	for(let i = 0; i < separations.length; i++) {
		const c = separations[i];
		if(c === lowerIndicator) {
			rowlist = rowlist.slice(0, rowlist.length / 2);
		} else {
			rowlist = rowlist.slice(rowlist.length / 2);
		}
	}
	return rowlist[0];
}

function seatId(seat) {
	return seat.row * 8 + seat.column;
}

const ids = values.map(seatId).sort();

console.log(`max: ${ids.reduce((acc, v) => Math.max(acc,v), 0)}`);

for(let i = 0; i < 128*8; i++) {
	if(ids.indexOf(i) == -1) {
		const column = i % 8;
		const row = (i - column) / 8;
		if(ids.indexOf(i-1) != -1 && ids.indexOf(i+1) != -1) {
			console.log(`missing: #${i} row: ${row} column:${column}`);
		}
	}
}