const fs = require("fs");

const test = false;
const file = fs.readFileSync(`part1-${test ? "test" : "data"}.txt`, "utf8");

const data = file
    .toString()
    .split("\n")
    .map(line => line.split("").map(a => +a));

function isVisible(data, x, y) {
    if (x === 0) return true;
    if (x === data.length - 1) return true;
    if (y === 0) return true;
    if (y === data[0].length - 1) return true;
    let visibleL = true;
    for (let i = 0; i < x; i++) {
        // console.log("L", i);
        visibleL = visibleL && data[i][y] < data[x][y];
    }
    if (visibleL) return true;
    let visibleR = true;
    for (let i = x + 1; i < data.length; i++) {
        // console.log("R", i);
        visibleR = visibleR && data[i][y] < data[x][y];
    }
    if (visibleR) return true;
    let visibleT = true;
    for (let i = 0; i < y; i++) {
        // console.log("T", i);
        visibleT = visibleT && data[x][i] < data[x][y];
    }
    if (visibleT) return true;
    let visibleB = true;
    for (let i = y + 1; i < data[0].length; i++) {
        // console.log("B", i);
        visibleB = visibleB && data[x][i] < data[x][y];
    }
    if (visibleB) return true;
    return false;
}


function buildVisible(data) {
    return data.map((line, x) => line.map((c, y) => isVisible(data, x, y)));
}


function calcScenicScore(data, x, y) {
    let i;
    let L = 0;
    i = x - 1;
    while (i >= 0 && data[i][y] < data[x][y]) {
        L++;
        i--;
    }
    if (i >= 0) L++;

    let R = 0;
    i = x + 1;
    while (i < data.length && data[i][y] < data[x][y]) {
        R++;
        i++;
    }
    if (i < data.length) R++;

    let T = 0;
    i = y - 1;
    while (i >= 0 && data[x][i] < data[x][y]) {
        T++;
        i--;
    }
    if (i >= 0) T++;

    let B = 0;
    i = y + 1
    while (i < data[0].length && data[x][i] < data[x][y]) {
        B++;
        i++;
    }
    if (i != data[0].length) B++;

    // return { t: data[x][y], x, y, T, L, B, R, total: L * R * T * B };
    return L * R * T * B;
}

function buildScenicScore(data) {
    return data.map((line, x) => line.map((c, y) => calcScenicScore(data, x, y)));

}
function add(a, b) { return a + b }

const visible = buildVisible(data);
console.log(visible.map(a => a.filter(i => i).length).reduce(add, 0));

const scenicScore = buildScenicScore(data);
// console.log(data)
// console.log(scenicScore)
// console.log(scenicScore.map(line => line.map(({ total }) => total)))
console.log(Math.max(...scenicScore.map(line => Math.max(...line))));