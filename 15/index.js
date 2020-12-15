const input = [5,2,8,16,18,0,1];

function getN(n, input) {
	const mentioned = new Map();
	const before = new Map();
	let mostRecent = null;
	for(let i = 0; i < n; i++) {
		mostRecent = i < input.length ? input[i] : before.has(mostRecent) ? mentioned.get(mostRecent) - before.get(mostRecent) : 0;
		if(mentioned.has(mostRecent)) {
			before.set(mostRecent, mentioned.get(mostRecent));
		}
		mentioned.set(mostRecent, i);
	}
	return mostRecent;
}

console.time("time");
console.log("part1:",getN(2020, input));
console.timeEnd("time");

console.time("time");
console.log("part2:",getN(30000000, input));
console.timeEnd("time");