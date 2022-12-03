const fs = require("fs");

const test = true;
const file = fs.readFileSync(`part1-${test ? "test" : "data"}.txt`, "utf8");

const data = file
    .toString()
    .split("\n")


function transform(sack) {
    const a = "a".codePointAt(0);
    const A = "A".codePointAt(0);
    return sack.split("").map(x => {
        if (x >= "a" && x <= "z")
            return x.codePointAt() - a + 1;
        if (x >= "A" && x <= "Z")
            return x.codePointAt() - A + 1 + 26;
        throw Error(x);
    })
}

function split(sack) {
    return [sack.slice(0, sack.length / 2), sack.slice(sack.length / 2, sack.length)]
}

function same([a, b]) {
    return a.map(aElem => b.find(bElem => bElem === aElem)).filter(a => a)[0];
}

const r = data.map(transform).map(split).map(same).reduce((a, b) => a + b, 0);
console.log(r);


function both(a, b) {
    return a.map(element => b.find(d => d === element)).filter(id => id);
}

function badge(a, b, c) {
    const aAndb = both(a, b);
    const bAndc = both(b, c);
    return both(aAndb, bAndc)[0];
}
const s = data.map(transform)
const result = [];
for (let i = 0; i < s.length; i = i + 3) {
    result.push(badge(s[i], s[i + 1], s[i + 2]));
}

console.log(result.reduce((a, b) => a + b));