const fs = require("fs");
const { type } = require("os");

class Tile {
	constructor(string) {
		this.index = parseInt(string.match(/Tile (\d+)/)[1]);
		this.pixels = string.split("\n").slice(1);
	}

	getEdges() {
		return {
			top: this.pixels[0], 
			bottom: this.pixels[this.pixels.length - 1], 
			left: this.pixels.map(v => v[0]).join(""), 
			right: this.pixels.map(v => v[v.length - 1]).join("")
		};
	}

	getEdgeList() {
		const edges = this.getEdges();
		return [edges.top, edges.bottom, edges.left, edges.right];
	}

	rotateX(times) {
		for(let i = 0; i < times; i++) {
			this.rotate();
		}
	}

	rotate() {
		const pixels = [];
		for(let i = 0; i < this.pixels[0].length; i++) {
			pixels.push(this.pixels.map(v => v[i]).reverse().join(""));
		}
		this.pixels = pixels;
	}

	flipVertical() {
		this.pixels = this.pixels.reverse();
	}

	flipHorizontal() {
		this.pixels = this.pixels.map(v => strRev(v));
	}

	getContent() {
		return this.pixels.slice(1, this.pixels.length-1).map(v => v.substring(1, v.length - 1));
	}
}

const data = fs.readFileSync("input.txt");
const values = data.toString().split("\n\n").filter(v => v.length > 0);

const tiles = values.map(parseTile);

function strRev(string) {
	return [...string].reverse().join("");
}


function parseTile(tile) {
	return new Tile(tile);
}

function buildEdgeMap(tiles) {
	const edges = new Map();
	const edgeList = tiles.flatMap(v => v.getEdgeList());
	for(let edge of edgeList) {
		const reverse = strRev(edge);
		if(edges.has(edge)) {
			edges.set(edge, edges.get(edge) + 1);
		} else if(edges.has(reverse)) {
			edges.set(reverse, edges.get(reverse) + 1);
		} else {
			edges.set(edge, 1);
		}
	}
	return edges;
}

function getCornerTiles(tiles) {
	const edges = Array.from(buildEdgeMap(tiles).entries()).filter(v => v[1] === 2).map(v => v[0]);
	return tiles.filter(v => [...v.getEdgeList().filter(v => edges.includes(v)), ...v.getEdgeList().filter(v => edges.includes(strRev(v)))].length === 2);
}

console.time("time");
console.log("part1:", getCornerTiles(tiles).map(v => v.index).reduce((acc, v) => acc * v, 1));
console.timeEnd("time");

function getEdgeStatus(edge, edgeList) {
	if(edgeList.has(edge)) {
		return edgeList.get(edge);
	} else if(edgeList.has(strRev(edge))) {
		return edgeList.get(strRev(edge));
	} else {
		throw "edge not found in edgelist";
	}
}

class Image {
	constructor(tiles) {
		this.tiles = tiles;
		this.used = [];
		this.size = Math.sqrt(this.tiles.length);
		this.constructed = [];
		this.edgeList = buildEdgeMap(tiles);
		this.built = false;
	}

	build() {
		let start = getCornerTiles(this.tiles)[0];
		while(getEdgeStatus(start.getEdges().top, this.edgeList) !== 1 || getEdgeStatus(start.getEdges().left, this.edgeList) !== 1){
			start.rotate();
			console.log("bblubb");
		}
		this.constructed.push([start]);
		this.used.push(start.index);
		while(true) {
			try {
				this.placeNextTile()
			} catch (e) {
				break;
			}
		}
		this.built = true;
	}

	placeNextTile() {
		let edgeToFind = null;
		if(this.constructed[this.constructed.length - 1].length === this.size) {
			edgeToFind = this.constructed[this.constructed.length - 1][0].getEdges().bottom;
			this.constructed.push([]);
		}
		if(edgeToFind == null) {
			edgeToFind = this.constructed[this.constructed.length - 1][this.constructed[this.constructed.length - 1].length - 1].getEdges().right;
		}
		const tile = this.tiles.find(v => !this.used.includes(v.index) && (v.getEdgeList().includes(edgeToFind) || v.getEdgeList().includes(strRev(edgeToFind))));

		if(typeof tile === "undefined") {
			this.constructed = this.constructed.filter(v => v.length > 0);
			throw "no next tile found";
		}

		this.constructed[this.constructed.length - 1].push(tile);
		this.used.push(tile.index);

		if(this.constructed[this.constructed.length - 1].length === 1){
			//todo: leftmost position
			const top = this.constructed[this.constructed.length - 2][0];
			while(top.getEdges().bottom !== tile.getEdges().top && top.getEdges().bottom !== strRev(tile.getEdges().top)) {
				tile.rotate();
			}
			if(top.getEdges().bottom === strRev(tile.getEdges().top)) {
				tile.flipHorizontal();
			}
		} else {
			const previous = this.constructed[this.constructed.length - 1][this.constructed[this.constructed.length - 1].length - 2];
			while(previous.getEdges().right !== tile.getEdges().left && previous.getEdges().right !== strRev(tile.getEdges().left)) {
				tile.rotate();
			}
			if(previous.getEdges().right === strRev(tile.getEdges().left)) {
				tile.flipVertical();
			}
		}
	}

	render() {
		if(!this.built) {
			throw "image not built yet";
		}
		const image = [];
		for(let row of this.constructed) {
			const rowContent = row.map(v => v.getContent());
			const lines = [];
			for(let i = 0; i < rowContent[0].length; i++) {
				lines.push(rowContent.map(v => v[i]).join(""));
			}
			image.push(...lines);
		}
		return image;
	}
}

const pattern = [
	"                  # ", 
	"#    ##    ##    ###", 
	" #  #  #  #  #  #   "
];
function getSnekCount(tile) {
	const rendered = tile.pixels;

	const patternLength = pattern[0].length;
	
	const regex = pattern.map(v => new RegExp(v.replace(/\#/g, "\\\#").replace(/ /g, ".")));
	
	let snekcount = 0;
	for(let i = 0; i < rendered.length - 4; i++) {
		for(let k = 0; k < rendered[0].length - 1 - patternLength; k++) {
			const line1 = rendered[i].substring(k, patternLength + k)
			const line2 = rendered[i+1].substring(k, patternLength + k)
			const line3 = rendered[i+2].substring(k, patternLength + k)
			if(line1.match(regex[0]) && line2.match(regex[1]) && line3.match(regex[2])) {
				snekcount++;
			}
		}
	}
	return snekcount;
}

console.time("time");

const image = new Image(tiles);
image.build();
const rendered = image.render();

const bigTile = new Tile("Tile 42\n"+rendered.join("\n"));
let snekCount = 0;
for(let i = 0; i < 8; i++) {
	const count = getSnekCount(bigTile);
	if(count > 0) {
		snekCount = count;
		break;
	}
	if((i+1)%4 === 0) {
		bigTile.flipHorizontal();
	} else {
		bigTile.rotate();
	}
}

const snekSize = pattern.join("").replace(/ /g, "").length;
const turbulence = bigTile.pixels.join("").replace(/\./g, "").length;
console.log("part2:", turbulence - snekCount * snekSize);
console.timeEnd("time");
