const fs = require("fs");

const data = fs.readFileSync("input.txt");
// const data = "389125467";
const values = data.toString().split("").filter(v => v.length > 0).map(v => parseInt(v));

class LinkedList {
    constructor() {
        this.head = null;
    }

    add(element) {
        if(this.head === null) {
            this.head = {element, next: null};
        } else {
            const last = this.getLast();
            last.next = {element, next: null};
        }
    }

    addAfter(element, reference) {
        next = reference.next;
        reference.next = {element, next};
    }

    shift(n = 1) {
        if(this.head === null) {
            return null;
        } else {
            let cache = this.head.element;
            this.head = this.head.next;
            return cache;
        }
    }

    getLast() {
        if(this.head === null) {
            return null;
        }
        let current = this.head;
        while(current.next !== null) {
            current = current.next();
        }
    }

    getFirst() {
        return this.head;
    }

    toArray() {
        let array = [];
        let next = this.head;
        while(next !== null) {
            array.push(next.element);
            next = next.next;
        }
        return array;
    }
}

function Min(array) {
    let min = array[0];
    for(let element of array.slice(1)) {
        if(element < min) {
            min = element;
        }
    }
    return min;
}

function Max(array) {
    let max = array[0];
    for(let element of array.slice(1)) {
        if(element > max) {
            max = element;
        }
    }
    return max;
}


function move(list) {
    const line = [...list];
    const selected = line[0];
    const pickup = line.splice(1, 3);
    const min = Min(line);
    const max = Max(line);
    let insertAfter = selected - 1;
    while(!line.includes(insertAfter)) {
        insertAfter--;
        if(insertAfter < min) {
            insertAfter = max;
        }
    }
    const insertAfterIndex = line.indexOf(insertAfter);
    const newLine = [...line.slice(1,insertAfterIndex + 1), ...pickup, ...line.slice(insertAfterIndex + 1), selected];
    return newLine;
}

function arrayEquals(a, b) {
	return a.length === b.length && a.every((v, i) => v === b[i]);
}

function moves(numbers, times, log = false) {
    let line = numbers;
    const percent = times / 100;
    for(let i = 0; i < times; i++) {
        line = move(line);
        if(log && i % percent === 0) {
            console.log(i/times * 100, "%");
        }
    }
    return fromOne(line);
}

function fromOne(line) {
    const length = line.length;
    const index = line.indexOf(1);
    return [...line, ...line].slice(index + 1, index + length);
} 

console.time("time");
console.log("part1:", moves(values, 100).join(""));
console.timeEnd("time");

// const values2 = [...values, ...Array.from(Array(1000000-values.length), (v, i) => Math.max(...values) + i + 1)];

// const res = moves(values2, 10000000);
// console.log(res.slice(0,2));