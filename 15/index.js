const input = [5,2,8,16,18,0,1];

function getN(n, input) {
	const mentioned = new Map();
	const before = new Map();
	let mostRecent = null;
	for(let i = 0; i < n; i++) {
		if(i < input.length) {
			//starting sequence
			mostRecent = input[i];
			mentioned.set(input[i], i);
		} else {
			if(!before.has(mostRecent)) {
				mostRecent = 0;
				before.set(mostRecent, mentioned.get(mostRecent));
				mentioned.set(mostRecent, i);
			} else {
				mostRecent = mentioned.get(mostRecent) - before.get(mostRecent);
				if(mentioned.has(mostRecent)) {
					before.set(mostRecent, mentioned.get(mostRecent));
				}
				mentioned.set(mostRecent, i);
			}
		}
	}
	return mostRecent;
}

console.time("time");
console.log("part1:",getN(2020, input));
console.timeEnd("time");

console.time("time");
console.log("part2:",getN(30000000, input));
console.timeEnd("time");