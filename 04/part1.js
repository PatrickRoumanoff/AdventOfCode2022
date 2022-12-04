const fs = require("fs");

const test = false;
const file = fs.readFileSync(`part1-${test ? "test" : "data"}.txt`, "utf8");

function startEnd(a) {
    const [s, e] = a.split("-");
    return ({ s: +s, e: +e });
}

const data = file
    .toString()
    .split("\n")
    .map(a => a.split(","))
    .map(([a, b]) => ([startEnd(a), startEnd(b)]));

function contains(p1, p2) {
    return (p1.s <= p2.s) && (p2.e <= p1.e);
}

function eitherContains(p1, p2) {
    return contains(p1, p2) ? 1 : contains(p2, p1) ? 1 : 0;
}

function overlap(p1, p2) {
    return ((p1.s <= p2.s) && (p2.s <= p1.e)) || ((p1.s <= p2.e) && (p2.e <= p1.e)) ||
        ((p2.s <= p1.s) && (p1.s <= p2.e)) || ((p2.s <= p1.e) && (p1.e <= p2.e))
}

const result = data.map(([a, b]) => eitherContains(a, b)).filter(a => a);
console.log(result.length);

const result2 = data.map(([a, b]) => overlap(a, b)).filter(a => a);
console.log(result2.length);