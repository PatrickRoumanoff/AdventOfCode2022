const fs = require("fs");

const test = false;
const file = fs.readFileSync(`${test ? "test" : "data"}.txt`, "utf8");

const data = file
    .toString()
    .split("\n")
    .map(line => line.split(""));


function findLetter(data, letter) {
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
            if (data[i][j] === letter) {
                return { i, j };
            }
        }
    }
    throw new Error("no letter");
}

function allLetters(data, letter) {
    const result = [];
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
            if (data[i][j] === letter) {
                result.push({ i, j });
            }
        }
    }
    return result;
}


function buildMap(data) {
    const map = [[""]];
    for (let i = 0; i < data.length; i++) {
        map[i] = []
        for (let j = 0; j < data[i].length; j++) {
            map[i][j] = "."
        }
    }
    return map;
}

const start = findLetter(data, "S");
const end = findLetter(data, "E");

data[start.i][start.j] = 'a';
data[end.i][end.j] = 'z';

function distance(source, dest) {
    return dest.charCodeAt() - source.charCodeAt();
}

function findPossible(data, { i, j }) {
    const result = [];
    const current = data[i][j];
    if (i - 1 >= 0 && distance(current, data[i - 1][j]) <= 1) {
        result.push({ i: i - 1, j, d: "<" });
    }
    if (i + 1 < data.length && distance(current, data[i + 1][j]) <= 1) {
        result.push({ i: i + 1, j, d: ">" });
    }
    if (j - 1 >= 0 && distance(current, data[i][j - 1]) <= 1) {
        result.push({ i, j: j - 1, d: "^" });
    }
    if (j + 1 < data[i].length && distance(current, data[i][j + 1]) <= 1) {
        result.push({ i, j: j + 1, d: "v" });
    }
    return result;
}


function posToString({ i, j }) {
    return `${i}:${j}`
}

function findPath(data, start, end) {
    const finalPath = [];
    const queue = [];
    const visited = [posToString(start)]

    queue.push([start]);
    while (queue.length > 0 && finalPath.length === 0) {
        const path = queue.shift();
        if (!path) {
            throw new Error("no path")
        }
        const pos = path[path.length - 1];
        const options = findPossible(data, pos).filter(o => !visited.includes(posToString(o)));
        for (const o of options) {
            if (o.i === end.i && o.j === end.j) {
                finalPath.splice(0, 0, ...path.concat([end]));
            }
            visited.push(posToString(o));
            queue.push(path.concat([o]));
        }
    }
    return finalPath.length - 1;
}

const map = buildMap(data);
const result = findPath(data, start, end);
console.log(result)

const starts = allLetters(data, "a");
console.log(starts.map(s => findPath(data, s, end)).filter(a => a > 0).sort((a, b) => a - b)[0]);
