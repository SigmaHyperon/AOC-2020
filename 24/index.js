const fs = require("fs");

const data = fs.readFileSync("input.txt");
const values = data.toString().split("\n").filter(v => v.length > 0).map(parseLine).map(translateDirections);

function parseLine(line) {
    return line.match(/(e|se|ne|w|sw|nw)/g);
}

function translateDirections(directions) {
    let x = 0;
    let y = 0;
    for(let direction of directions) {
        switch(direction) {
            case "e":
                x++;
                break;
            case "w":
                x--;
                break;
            case "ne":
                y++;
                break;
            case "sw":
                y--;
                break;
            case "nw":
                x--;
                y++;
                break;
            case "se":
                x++;
                y--;
                break;
        }
    }
    return {x,y};
}

function collectSwaps(coordinates) {
    const tiles = [];
    for(let tile of coordinates) {
        const l = tiles.find(v => v.co.x === tile.x && v.co.y === tile.y);
        if(typeof l !== "undefined") {
            l.c++;
        } else {
            tiles.push({co: tile, c: 1});
        }
    }
    return tiles;
}

function getBlacks(values) {
    return collectSwaps(values).filter(v => v.c % 2 !== 0).map(v => v.co);
}

console.log("part1:", getBlacks(values).length);

function countSurroundingBlacks(tile, state) {
    const permutations = [
        {x: 1, y: 0},
        {x: -1, y: 0},
        {x: 0, y: 1},
        {x: 0, y: -1},
        {x: 1, y: -1},
        {x: -1, y: 1},
    ]
    return permutations.map(v => {
        return {x: v.x + tile.x, y: v.y + tile.y}
    }).filter(v => isBlack(v, state)).length;
}

function isBlack(tile, state){
    return typeof state.find(v => v.x === tile.x && v.y === tile.y) !== "undefined";
}

function nextState(state) {
    const minX = Math.min(...state.map(v => v.x)) - 1;
    const maxX = Math.max(...state.map(v => v.x)) + 1;
    const minY = Math.min(...state.map(v => v.y)) - 1;
    const maxY = Math.max(...state.map(v => v.y)) + 1;
    const newState = [];
    for(let x = minX; x <= maxX; x++) {
        for(let y = minY; y <= maxY; y++) {
            if(isBlack({x,y}, state)) {
                const sb = countSurroundingBlacks({x,y}, state);
                if(sb > 0 && sb < 3) {
                    newState.push({x,y});
                }
            } else {
                const sb = countSurroundingBlacks({x,y}, state);
                if(sb === 2) {
                    newState.push({x,y});
                }
            }
        }
    }
    return newState;
}

function cycle(values, iterations) {
    let state = [...getBlacks(values)];
    for(let i = 0; i < iterations; i++) {
        state = nextState(state);
    }
    return state;
}

console.log("part2:", cycle(values, 100).length);