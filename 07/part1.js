const fs = require("fs");

const test = false;
const file = fs.readFileSync(`part1-${test ? "test" : "data"}.txt`, "utf8");

const data = file
    .toString()
    .split("\n");

/**
 * 
 * @param {Array<string>} list 
 */
function buildTree(list) {
    const entries = { type: "dir" };
    entries.up = entries;
    let current = entries;
    for (const output of list) {
        if (output === "$ cd ..") {
            //go up
            current = current.up;
            continue;
        }
        if (output === "$ ls") {
            continue;
        }
        if (output.startsWith("$ cd ")) {
            const [, , dirName] = output.split(" ");
            current = current[dirName];
            continue;
        }
        if (output.startsWith("dir")) {
            const [, name] = output.split(" ");
            current[name] = { up: current, type: "dir", name };
            continue;
        }
        const [size, name] = output.split(" ");
        current[name] = { name, size, type: "file" }

    }
    return entries;
}

const add = (a, b) => a + b;

function calculateTreeSize(tree) {
    if (tree.type === "file") {
        return +tree.size;
    }
    const size = Object.entries(tree).map(([key, value]) => {
        if (key === "up" || key === "type" || key === "name") {
            return 0;
        }
        return calculateTreeSize(value);
    }).reduce(add, 0);
    tree.size = size;
    return size;
}

function findDirWithSizeLess(tree, size) {
    if (tree.type !== "dir") {
        return undefined;
    }
    return Object.entries(tree).flatMap(([key, value]) => {
        if (key === "up" || key === "size" || key === "type" || key === "name") {
            return undefined;
        }
        if (value.size > size) {
            return findDirWithSizeLess(value, size)?.flat();
        }
        if (value.type === "dir") {
            return [{ type: value.type, size: value.size, name: value.name }, findDirWithSizeLess(value, size)?.flat()];
        }
        return undefined;
    });
}

function findDirWithSize(tree, size) {
    if (tree.type !== "dir") {
        return undefined;
    }
    return Object.entries(tree).flatMap(([key, value]) => {
        if (key === "up" || key === "size" || key === "type" || key === "name") {
            return undefined;
        }
        if (value.type === "dir") {
            return [{ size: value.size, name: value.name }, findDirWithSizeLess(value, size)?.flat()];
        }
        return undefined;
    });
}


data.shift()
const tree = buildTree(data);
calculateTreeSize(tree);
console.log(tree);
const small = findDirWithSizeLess(tree, 100000)

console.log("---");

console.log(small.flat().filter(i => i));
console.log("---");

console.log(small.flat().filter(i => i).map(({ size }) => size).reduce(add, 0));

const disk = 70000000;
const totalUsed = tree.size;
const updateNeeds = 30000000;

const deleteRequired = updateNeeds - (disk - totalUsed)

console.log({ disk, totalUsed, updateNeeds, deleteRequired })
console.log(findDirWithSize(tree)
    .flat()
    .filter(i => i)
    .map(({ size }) => size)
    .filter(size => size >= deleteRequired)
    .sort());