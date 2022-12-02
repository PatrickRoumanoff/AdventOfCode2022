var fs = require("fs");

// var data = fs.readFileSync("part1-test.txt", "utf8");
var data = fs.readFileSync("part1-data.txt", "utf8");

const dir = { forward: { h: 1 }, down: { z: 1 }, up: { z: -1 } };

let h = 0;
let z = 0;
let aim = 0;
data
    .toString()
    .split("\n")
    .map((d) => d.split(" "))
    .forEach(([action, a]) => {
        switch (action) {
            case "forward":
                h += +a;
                z += +a * aim;
                break;
            case "down":
                aim += +a;
                break;
            case "up":
                aim -= +a;
                break;
            default:
                throw new Error(`Unkown acion: ${action}`);
        }
    });
console.log(h * z);