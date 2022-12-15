const fs = require("fs");
const { json } = require("stream/consumers");

const test = false;
const file = fs.readFileSync(`${test ? "test" : "data"}.txt`, "utf8");

const data = file
    .toString()
    .split("\n\n")
    .map(p => p.split("\n").map(l => JSON.parse(l)))

function compare(left, right) {

    const tl = typeof left;
    const tr = typeof right;
    // console.log({ left, tl, right, tr })
    if (tl == "number" && tr == "number") {
        if (left === right) {
            return 0;
        }
        return left < right ? 1 : -1;
    }
    if (tr == "object" && tl == "object") {
        let i = 0;
        while (i < left.length && i < right.length) {
            const r = compare(left[i], right[i]);
            if (r !== 0) {
                return r;
            }
            i++;
        }
        if (left.length == right.length) {
            return 0;
        }
        return left.length < right.length ? 1 : -1;
    }
    if (tr == "number" && tl == "object") {
        return compare(left, [right]);
    }
    if (tr == "object" && tl == "number") {
        return compare([left], right);
    }
    throw Error("wtf");
}

//part 1
const comp = data
    .map(([left, right]) => compare(left, right))
    .map((v, i) => ({ v, i: i + 1 }))
    .filter(({ v }) => v === 1)
    .map(({ i }) => i)
    .reduce((a, b) => a + b, 0);
console.log(comp);

//part 2
const all = data.flat().concat([[[2]]], [[[6]]]).sort(compare).reverse();

function find(a, b) {
    const A = JSON.stringify(a);
    for (let i = 0; i < b.length; i++) {
        if (JSON.stringify(b[i]) === A) {
            return i + 1;
        }
    }
    throw Error("not found");
}

console.log(find([[2]], all) * find([[6]], all));