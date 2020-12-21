const fs = require("fs");

const data = fs.readFileSync("input.txt");
const values = data.toString().split("\n").filter(v => v.length > 0).map(parseLine);

function parseLine(line) {
	const res = line.match(/(.+) \(contains (.+)\)/);
	const ingredients = res[1].split(" ").filter(v => v.length > 0);
	const allergens = res[2].split(", ").filter(v => v.length > 0);
	return {ingredients, allergens};
}

function buildDict(values) {
	const allAllergens = values.flatMap(v => v.allergens).filter((v,i,s) => s.indexOf(v) === i);
	
	const possibleIngredients = allAllergens.map(v => {
		const all = values.filter(k => k.allergens.includes(v)).map(k => k.ingredients);
		return {allergen: v, possible: all[0].filter(k => all.every(l => l.includes(k)))};
	});
	
	const dict = new Map();
	
	while(true) {
		let n = false;
		for(let allergen of possibleIngredients) {
			const pos = allergen.possible.filter(v => !dict.has(v));
			if(pos.length === 1) {
				dict.set(pos[0], allergen.allergen);
				n = true;
			}
		}
		if(n === false) {
			break;
		}
	}
	if(possibleIngredients.length > Array.from(dict.keys()).length) {
		throw "not all allergens translated";
	}
	return dict;
}

const dictionary = buildDict(values);

console.log("part1:", values.flatMap(v => v.ingredients).filter(v => !dictionary.has(v)).length);
console.log("part2:", Array.from(dictionary.entries()).sort((a,b) => a[1] < b[1] ? -1 : 1).map(v => v[0]).join(","));