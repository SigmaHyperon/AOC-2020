const fs = require("fs");

const data = fs.readFileSync("input.txt");
const values = data.toString().split("\n").filter(v => v.length > 0).map(v => parseInt(v));

function breakPrivateKey(subject, publicKey) {
    let value = 1;
    for(let i = 1; i < 1000000000; i++) {
        value = (value * subject) % 20201227;
        if(value === publicKey) {
            return i;
        } 
    }
}

function createKey(subject, loopsize) {
    let value = 1;
    for(let i = 0; i < loopsize; i++) {
        value = (value * subject) % 20201227; 
    }
    return value;
}

const keyPairs = values.map(v => {
    return {
        public: v,
        private: breakPrivateKey(7, v)
    }
});

console.log("part1:", createKey(keyPairs[0].public, keyPairs[1].private));