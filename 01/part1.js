const fs = require('fs');

const data = fs.readFileSync('01/d.txt', 'utf8');

const elf = [0];
elf[-1] = 0;
let elfi = -1;

data.toString().split("\n").forEach((d, i, a) => {
    if (d == "") {
        elfi++;
        elf[elfi] = 0;
        return
    }
    elf[elfi] += +d;
}
);
const sorted = elf.sort((a, b) => b - a);
console.log(sorted);
console.log(sorted[0] + sorted[1] + sorted[2]);