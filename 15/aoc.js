const fs = require("fs");

const test = false;
const file = fs.readFileSync(`${test ? "test" : "data"}.txt`, "utf8");

const data = file
    .toString()
    .split("\n")
    .map(l => {
        const r = l.match(/Sensor at x=(?<sx>-?\d+), y=(?<sy>-?\d+): closest beacon is at x=(?<bx>-?\d+), y=(?<by>-?\d+)/);
        if (r) {
            const g = r.groups;
            return ({ sensor: { x: +g.sx, y: +g.sy }, beacon: { x: +g.bx, y: +g.by } })

        } else {
            console.log(`no match: ${l}`)
        }
    }).filter(id => id);

function dist(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function maxX(data) {
    return Math.max(...data.map(({ x }) => x));
}
function minX(data) {
    return Math.min(...data.map(({ x }) => x));
}
function minY(data) {
    return Math.min(...data.map(({ y }) => y));
}
function maxY(data) {
    return Math.max(...data.map(({ y }) => y));
}

const sensors = data.map(({ sensor }) => sensor);
const beacons = data.map(({ beacon }) => beacon);

const minx = Math.min(minX(sensors), minX(beacons));
const maxx = Math.max(maxX(sensors), maxX(beacons));
const miny = Math.min(minY(sensors), minY(beacons));
const maxy = Math.max(maxY(sensors), maxY(beacons));

const d = data.map(({ sensor, beacon }) => {
    const distance = dist(sensor, beacon);
    return { sensor, beacon, distance }
})

function find(data, p) {
    return data.find(({ x, y }) => p.x == x && p.y == y);
}

function tuning(p) {
    return p.x * 4_000_000 + p.y;
}

function possible(d, beacons, p) {
    for (let { sensor, distance } of d) {
        if (dist(sensor, p) <= distance) {
            if (find(beacons, p)) {
                return "B";
            }
            return "#";
        }
    }
    return " ";
}

const y = test ? 10 : 2_000_000;
let result = 0;

for (let x = minx - 4_000_000; x <= maxx + 4_000_000; x++) {
    const p = { x, y };
    const pos = possible(d, beacons, p)
    if (pos === "#") {
        result++;
    }
}

console.log(result, "out of", (maxx - minx), "between", minx, maxx)

const max = test ? 20 : 4_000_000;

function inter(A, B) {
    return { x: (A + B) / 2, y: (B - A) / 2 }
}

function intersection(a, b) {
    const sa = a.sensor;
    const ra = a.distance + 1;
    const sb = b.sensor;
    const rb = b.distance + 1;

    const A1 = sa.x + sa.y + ra;
    const A2 = sa.x + sa.y - ra;
    const A3 = sa.x - sa.y + ra;
    const A4 = sa.x - sa.y - ra;
    const B1 = sb.x + sb.y + rb;
    const B2 = sb.x + sb.y - rb;
    const B3 = sb.x - sb.y + rb;
    const B4 = sb.x - sb.y - rb;

    const i = [
        inter(A1, B3), inter(A1, B4),
        inter(A2, B3), inter(A2, B4),
        inter(A3, B1), inter(A3, B2),
        inter(A4, B1), inter(A4, B2)
    ];

    return i
        .filter(p => dist(p, sa) == ra)
        .filter(p => dist(p, sb) == rb)
        .filter(({ x, y }) => x == Math.floor(x) && y == Math.floor(y))
}

function inRange(p) {
    return p.x >= 0 && p.x <= max && p.y >= 0 && p.y <= max;
}

const intersections = [];
for (let da = 0; da < d.length; da++) {
    for (let db = da + 1; db < d.length; db++) {
        const i = intersection(d[da], d[db])
            .filter(p => possible(d, beacons, p) == " ");

        if (i.filter(inRange).length > 0) {
            console.log(`${i[0].x}, ${i[0].y} => ${tuning(i[0])}`)
            process.exit();
        }
    }
}
