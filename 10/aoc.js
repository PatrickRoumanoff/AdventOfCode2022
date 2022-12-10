const fs = require("fs");

const test = false;
const file = fs.readFileSync(`${test ? "test" : "data"}.txt`, "utf8");

const data = file
    .toString()
    .split("\n")
    .map(line => line.split(" "))
    .map(([i, count]) => ({ i, count: +count }));

const reg = [1];
let cycle = 0;
let s = 0;
const interesting = [20, 60, 100, 140, 180, 220];
const CRT = [];
for (let i = 0; i < 6; i++) {
    CRT.push([]);
    for (let j = 0; j < 40; j++) {
        CRT[i][j] = " "
    }
}

function printCRT(CRT) {
    console.log(CRT.map(l => l.join("")).join("\n"))
}

function around(x, s) {
    return x === s || x - 1 === s || x + 1 === s;
}

function printSprite(r) {
    const line = [];
    for (let i = 0; i < 40; i++) {
        line.push(around(i, r % 40) ? "#" : ".");
    }
    console.log(line.join(""));
}
// printCRT(CRT)

function getPosition(t) {
    const x = t % 40;
    const y = (t - x) / 40;
    return { x, y };
}

data
    .filter((_, i) => i < 1000)
    .map(({ i, count }) => {
        const { x, y } = getPosition(cycle);
        const { x: xs, y: ys } = getPosition(reg[0]);
        if (around(x, xs)) {
            CRT[y][x] = "#";
        } else {
            CRT[y][x] = " ";
        }
        // console.log({ i, count, reg: reg[0], cycle })
        // printSprite(reg[0])
        // printCRT(CRT)
        if (i === "noop") {
            cycle += 1;
            if (interesting.indexOf(cycle) !== -1) {
                s += cycle * (reg[0]);
                // console.log(cycle, "*", reg[0], "=", cycle * (reg[0]))
            }
        }
        if (i === "addx") {
            cycle += 2;
            const { x, y } = getPosition(cycle - 1);
            const { x: xs, y: ys } = getPosition(reg[0]);
            if (around(x, xs)) {
                CRT[y][x] = "#";
            } else {
                CRT[y][x] = " ";
            }
            // console.log({ i, count, reg: reg[0], cycle: cycle - 1 })
            // printSprite(reg[0])
            // printCRT(CRT)
            reg[0] += count;
            if (interesting.indexOf(cycle) !== -1) {
                s += cycle * (reg[0] - count);
                // console.log(cycle, "*", reg[0] - count, "=", cycle * (reg[0] - count))
            }
            if (interesting.indexOf(cycle - 1) !== -1) {
                s += (cycle - 1) * (reg[0] - count);
                // console.log("off", cycle - 1, "*", reg[0] - count, "=", (cycle - 1) * (reg[0] - count))
            }
        }
    })
console.log(s)
printCRT(CRT)

