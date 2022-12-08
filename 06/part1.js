const fs = require("fs");

const test = false;
const file = fs.readFileSync(`part1-${test ? "test" : "data"}.txt`, "utf8");

const data = file
    .toString()
    .split("\n");

function findIndex(data, count) {
    let i = 0;
    while (i < data.length) {
        const markers = data.slice(i, i + count).split("");
        const letters = new Set(markers);
        console.log(i, markers, letters)
        if (letters.size === count) {
            return i + count;
        }
        i++;
    }
    throw new Error("no marker");
}

data.map(d => {
    const control = findIndex(d, 4);
    console.log(d, control)
});

data.map(d => {
    const control = findIndex(d, 14);
    console.log(d, control)
});
