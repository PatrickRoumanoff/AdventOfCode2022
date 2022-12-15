const fs = require("fs");

const test = false;
const file = fs.readFileSync(`${test ? "test" : "data"}.txt`, "utf8");

const data = file
    .toString()
    .split("\n")
    .map(p => p.split(" -> ")
        .map(l => l.split(",")
            .map(d => +d))
        .map(([x, y]) => ({ x, y })));


//console.log(data);

const cave = [[""]];

function drawLine(a, b) {
    if (a.x === b.x) {
        if (!cave[a.x]) {
            cave[a.x] = [];
        }
        for (let y = Math.min(a.y, b.y); y <= Math.max(a.y, b.y); y++) {
            cave[a.x][y] = "#";
        }
        return;
    }
    if (a.y === b.y) {
        for (let x = Math.min(a.x, b.x); x <= Math.max(a.x, b.x); x++) {
            if (!cave[x]) {
                cave[x] = [];
            }
            cave[x][a.y] = "#";
        }
        return;
    }
    throw Error("broken line")
}

function drawPath(path) {
    for (let i = 0; i + 1 < path.length; i++) {
        drawLine(path[i], path[i + 1]);
    }
}

function findMaxY(data) {
    return Math.max(...data.map(p => p.map(({ y }) => y)).flat());
}

data.map(drawPath);

const MaxY = findMaxY(data);

function findNext(start, max) {
    const end = { x: start.x, y: start.y };
    while (end.y < max + 1) {
        // console.log(end)
        if (!cave[end.x]) {
            cave[end.x] = [];
        }
        if (cave[end.x][end.y + 1] === undefined) {
            end.y++;
            continue;
        }
        if (cave[end.x - 1]?.[end.y + 1] === undefined) {
            end.x--;
            continue;
        }
        if (cave[end.x + 1]?.[end.y + 1] === undefined) {
            end.x++;
            continue;
        }
        return end;
    }
    return undefined;
}

function dropSand(start, max) {
    while (true) {
        const r = findNext(start, max);
        // console.log(r);
        if (r) {
            cave[r.x][r.y] = "o";
        } else {
            return;
        }
    }
}
dropSand({ x: 500, y: 0 }, MaxY);

console.log(cave.flatMap(c => c.filter(d => d === "o")).length)

const actualMax = MaxY + 2;

for (let x = 0; x < 1000; x++) {
    if (!cave[x]) {
        cave[x] = [];
    }
    cave[x][actualMax] = "#";
}

function dropSand2(start, max) {
    while (true) {
        const r = findNext(start, max);
        if (r?.x === 500 && r?.y === 0) {
            return;
        }
        if (r) {
            cave[r.x][r.y] = "o";
        } else {
            return;
        }
    }
}
dropSand2({ x: 500, y: 0 }, actualMax);
console.log(cave.flatMap(c => c.filter(d => d === "o")).length + 1)
