const fs = require('fs');

const data = fs.readFileSync('d.txt', 'utf8');

let count = 0;
data.toString().split("\n").map(d => +d).forEach((d, i, a) => {
    if (i - 2 < 0 || i + 1 > d.length - 1) return;
    const prev = a[i - 2] + a[i - 1] + a[i];
    const cur = a[i - 1] + a[i] + a[i + 1];
    // console.log(prev, cur)
    if (prev < cur) count++;
});
console.log(count)