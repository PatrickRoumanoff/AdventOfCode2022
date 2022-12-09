const fs = require("fs");

const test = false;
const file = fs.readFileSync(`${test ? "test" : "data"}.txt`, "utf8");

const data = file
    .toString()
    .split("\n")
    .map(line => line.split(" "))
    .map(([dir, count]) => ({ dir, count: +count }));

const H = { x: 0, y: 0 };
const T = { x: 0, y: 0 };
const trail = [{ ...T }];
data.map(({ dir, count }) => {
    for (let i = 0; i < count; i++) {
        switch (dir) {
            case "U":
                H.y++;
                break;
            case "D":
                H.y--;
                break;
            case "L":
                H.x--;
                break;
            case "R":
                H.x++;
                break;
        }
        if (Math.abs(H.y - T.y) <= 1 && Math.abs(H.x - T.x) <= 1) {
            continue;
        }

        if (T.x === H.x && T.y !== H.y) {
            T.y += Math.sign(H.y - T.y);
        }
        if (T.x !== H.x && T.y === H.y) {
            T.x += Math.sign(H.x - T.x);
        }
        if ((T.x !== H.x) && (T.y !== H.y)) {
            T.x += Math.sign(H.x - T.x);
            T.y += Math.sign(H.y - T.y);
        }
        trail.push({ ...T });
    }
})
console.log(new Set(trail.map(({ x, y }) => `${x}:${y}`).sort()).size);

function updateT(H, T) {
    if (Math.abs(H.y - T.y) <= 1 && Math.abs(H.x - T.x) <= 1) {
        return;
    }

    if (T.x === H.x && T.y !== H.y) {
        T.y += Math.sign(H.y - T.y);
    }
    if (T.x !== H.x && T.y === H.y) {
        T.x += Math.sign(H.x - T.x);
    }
    if ((T.x !== H.x) && (T.y !== H.y)) {
        T.x += Math.sign(H.x - T.x);
        T.y += Math.sign(H.y - T.y);
    }
}

const size = 10;
const rope = [];
for (let i = 0; i < size; i++) {
    rope.push({ x: 0, y: 0 });
}
const t = [{ ...rope[size - 1] }];
data.map(({ dir, count }) => {
    for (let i = 0; i < count; i++) {
        switch (dir) {
            case "U":
                rope[0].y++;
                break;
            case "D":
                rope[0].y--;
                break;
            case "L":
                rope[0].x--;
                break;
            case "R":
                rope[0].x++;
                break;
        }
        for (let r = 1; r < size; r++) {
            updateT(rope[r - 1], rope[r]);
        }
        t.push({ ...rope[size - 1] });
    }
})
console.log(t.map(({ x, y }) => `${x}:${y}`));
console.log(new Set(t.map(({ x, y }) => `${x}:${y}`)).size);
