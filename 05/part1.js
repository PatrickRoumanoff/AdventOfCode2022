const fs = require("fs");

const test = true;
const file = fs.readFileSync(`part1-${test ? "test" : "data"}.txt`, "utf8");

const data = file
    .toString()
    .split("\n");

const firstInstruction = data.findIndex(a => a.startsWith("move "));

const rawStack = data.slice(0, firstInstruction - 2).reverse();
const rawInstructions = data.slice(firstInstruction, data.length);

function parseStack(stack) {
    const size = (stack[0].length + 1) / 4;
    const result = [];
    for (let i = 1; i <= size; i++) {
        result[i] = [];
    }
    stack.map(line => {
        for (let i = 1; i <= size; i++) {
            const crate = line[1 + 4 * (i - 1)];
            if (crate != " ") {
                result[i].push(crate);
            }
        }
    })
    return result;
}

function parseIntructions(instructions) {
    return instructions.map(line => {
        const result = line.match(/move (?<rep>\d+) from (?<start>\d+) to (?<end>\d+)/);
        return { rep: result.groups.rep, start: result.groups.start, end: result.groups.end };
    })
}

const stack = parseStack(rawStack);
console.log(rawStack, stack)
const instructions = parseIntructions(rawInstructions);

function applyInstruction(stack, { rep, start, end }) {
    for (let i = 1; i <= rep; i++) {
        const lifted = stack[start].pop();
        stack[end].push(lifted);
    }
    return stack;
}

function applyInstruction2(stack, { rep, start, end }) {
    const lifted = stack[start].splice(-rep);
    stack[end] = stack[end].concat(lifted);
    return stack;
}


// instructions.map(i => applyInstruction(stack, i));
instructions.map(i => applyInstruction2(stack, i));

console.log(stack.map(s => s.pop()).join(""))

