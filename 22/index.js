const fs = require("fs");

const data = fs.readFileSync("input.txt");
const values = data.toString().split("\n\n").filter(v => v.length > 0).map(parsePlayer);

function parsePlayer(block) {
	return block.split("\n").slice(1).filter(v => v.length > 0).map(v => parseInt(v));
}

class Game {
	constructor(p1, p2) {
		this.p1 = [...p1];
		this.p2 = [...p2];
	}

	nextTurn() {
		const a = this.p1.shift();
		const b = this.p2.shift();
		if(a > b) {
			this.p1.push(a, b);
		} else {
			this.p2.push(b, a);
		}
	}

	play() {
		while(this.p1.length > 0 && this.p2.length > 0) {
			this.nextTurn();
		}
	}

	getWinner() {
		return this.p1.length > 0 ? 1 : 2;
	}

	getScore() {
		return [...this.p1, ...this.p2].reverse().map((v,i) => v * (i + 1)).reduce((acc, v) => acc + v, 0);
	}
}

console.time("time");
const part1 = new Game(...values);
part1.play();
console.log("part1:", part1.getScore());
console.timeEnd("time");

function arrayEquals(a, b) {
	return a.length === b.length && a.every((v, i) => v === b[i]);
}

class RecursiveGame extends Game {
	constructor(p1, p2) {
		super(p1, p2);
		this.previousStates = [];
		this.winner = 0;
	}
	nextTurn() {
		const state = {
			p1: [...this.p1], 
			p2: [...this.p2]
		};
		if(this.previousStates.some(v => arrayEquals(state.p1, v.p1) && arrayEquals(state.p2, v.p2))) {
			return 1;
		}
		this.previousStates.push(state);
		const a = this.p1.shift();
		const b = this.p2.shift();
		if(a <= this.p1.length && b <= this.p2.length) {
			const game = new RecursiveGame(this.p1.slice(0, a), this.p2.slice(0, b));
			game.play();
			if(game.getWinner() === 1) {
				this.p1.push(a, b);
			} else {
				this.p2.push(b, a);
			}
		} else {
			if(a > b) {
				this.p1.push(a, b);
			} else {
				this.p2.push(b, a);
			}
		}

		if(this.p1.length === 0) {
			return 2;
		} else if(this.p2.length === 0) {
			return 1;
		}

		return 0;
	}
	play() {
		while(this.winner === 0) {
			this.winner = this.nextTurn();
		}
	}
	getWinner() {
		return this.winner;
	}
}

console.time("time");
const part2 = new RecursiveGame(...values);
part2.play();
console.log("part2:", part2.getScore());
console.timeEnd("time");