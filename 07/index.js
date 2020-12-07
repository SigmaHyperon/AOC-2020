const fs = require("fs");

const toFind = "shiny gold";

const data = fs.readFileSync("input.txt");
const values = data.toString().split("\n").map(parseLine);

function parseLine(line) {
	const color = line.match(/([a-z]+ [a-z]+) bags contain .*/)?.[1];
	const children = line.match(/\d [a-z]+ [a-z]+/g)?.map(v => v.match(/(\d) ([a-z]+ [a-z]+)/))?.map(v => { return {count: v[1], color: v[2]}});
	return {color, children};
}

function findContaining(values, color) {
	let list = [color];
	while(true) {
		let added = false;
		for (const element of list) {
			for(const el of values) {
				if(list.indexOf(el.color) == -1 && canContain(el, element)) {
					list.push(el.color);
					added = true;
				}
			}
		}
		if(!added) {
			break;
		}
	}
	return list;
}

function canContain(node, color) {
	return node.children?.some(v => v.color === color);
}

function findBag(values, color) {
	return values.find(v => v.color === color);
}

function countBags(values, color) {
	const node = findBag(values, color);
	const childTotalCountArray = node.children?.map(v => v.count * countBags(values, v.color)) ?? 0;
	const childTotalCount = Array.isArray(childTotalCountArray) ? childTotalCountArray.reduce((acc, v) => acc + v, 0) : 0;
	return ( childTotalCount + 1 );
}

console.log(`${findContaining(values, toFind).length - 1} colors can contain a ${toFind} bag`);
console.log(`${countBags(values, toFind) - 1} bags are contained in a ${toFind} bag`);