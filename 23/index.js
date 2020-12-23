const fs = require("fs");

const data = fs.readFileSync("input.txt");
const values = data.toString().split("").filter(v => v.length > 0).map(v => parseInt(v));

class LinkedList {
    constructor() {
        this.head = null;
        this.min = null;
        this.max = null;
        this.last = null;
        this.lookup = new Map();
    }

    add(...elements) {
        this.addArray(elements);
    }

    addArray(array) {
        for(let element of array) {
            if(this.head === null) {
                this.head = {element, next: null};
                this.last = this.head;
                this.lookup.set(element, this.head);
                this.min = element;
                this.max = element;
            } else {
                this.last.next = {element, next: null};
                this.lookup.set(element, this.last.next);
                this.last = this.last.next;
                if(this.min > element) {
                    this.min = element;
                }
                if(this.max < element) {
                    this.max = element;
                }
            }
        }
    }

    addAfter(element, reference) {
        let next = reference.next;
        reference.next = {element, next};
        this.lookup.set(element, reference.next);
        if(next === null) {
            this.last = reference.next;
        }
        return reference.next;
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
        return this.last;
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

    getReference(element) {
        return this.lookup.get(element);
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
    const selected = list.shift();
    const pickup = [list.shift(), list.shift(), list.shift()];
    let insertAfter = selected - 1;
    while(insertAfter < list.min || pickup.includes(insertAfter)) {
        insertAfter--;
        if(insertAfter < list.min) {
            insertAfter = list.max;
        }
    }
    let insertAfterReference = list.getReference(insertAfter);
    insertAfterReference = list.addAfter(pickup[0], insertAfterReference);
    insertAfterReference = list.addAfter(pickup[1], insertAfterReference);
    insertAfterReference = list.addAfter(pickup[2], insertAfterReference);
    list.addAfter(selected, list.getLast());
}

function moves(numbers, times, log = false) {
    const logEvery = 100000
    let list = new LinkedList();
    list.addArray(numbers);
    const percent = times / 100;
    if(log) {
        console.time(logEvery);
    }
    for(let i = 0; i < times; i++) {
        move(list);
        if(log && (((i+1) % logEvery) === 0)) {
            console.timeEnd(logEvery);
            console.time(logEvery);
        }
        if(log && i % percent === 0) {
            console.log(i/times * 100, "%");
        }
    }
    if(log) {
        console.timeEnd(logEvery);
    }
    return fromOne(list.toArray());
}

function fromOne(line) {
    const length = line.length;
    const index = line.indexOf(1);
    return [...line, ...line].slice(index + 1, index + length);
} 

console.time("time");
console.log("part1:", moves(values, 100).join(""));
console.timeEnd("time");

console.time("time");
const values2 = [...values, ...Array.from(Array(1000000-values.length), (v, i) => Math.max(...values) + i + 1)];
console.log("part2:",moves(values2, 10000000).slice(0,2).reduce((acc, v) => acc * v, 1));
console.timeEnd("time");