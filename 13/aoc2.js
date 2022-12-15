const fs = require("fs");

const test = false;
const file = fs.readFileSync(`${test ? "test" : "data"}.txt`, "utf8");

const data = file
    .toString()
    .split("\n\n");



const monkeys = data.map(m => {
    const result = m.match(/^Monkey (?<n>\d):\n  Starting items: (?<items>.*)\n  Operation: new = (?<op>.*)\n  Test: divisible by (?<div>.*)\n    If true: throw to monkey (?<t>\d)\n    If false: throw to monkey (?<f>\d)/);
    if (!result?.groups) {
        throw new Error("no match")
    }
    return {
        n: +result?.groups.n,
        items: result?.groups.items.split(",").map(d => +d),
        op: result?.groups.op,
        div: +result?.groups.div,
        t: +result?.groups.t,
        f: +result?.groups.f,
        count: 0

    }
});

function log(monkeys) {
    console.log(monkeys.map(({ n, items, count }) => n + " count:" + count + ":" + items.join(", ")).join("\n"))
}

function Op(w, op) {
    const [a, o, b] = op.replaceAll("old", w).split(" ");
    switch (o) {
        case '+': {
            return +a + +b;
        }
        case '*': {
            return a * b;
        };
    }
    throw new Error("no op")
}

console.log(monkeys)
log(monkeys)

const superModulo = monkeys.map(({ div }) => div).reduce((a, b) => a * b, 1);
for (let round = 1; round <= 10_000; round++) {
    for (const m of monkeys) {
        let w;
        while (w = m.items.shift()) {
            m.count++
            const newWorry = Op(w, m.op) % superModulo;
            if (newWorry % m.div === 0) {
                monkeys[m.t].items.push(newWorry);
            } else {
                monkeys[m.f].items.push(newWorry);
            }
        }
    }
}

const r = monkeys.map(({ count }) => count).sort((a, b) => b - a);
console.log(r[0] * r[1])


