const fs = require("fs");

// const data = fs.readFileSync("part1-test.txt", "utf8");
const data = fs.readFileSync("part1-data.txt", "utf8");

const mapA = { A: "rock", B: "paper", C: "scissor" }
const mapX = { X: "rock", Y: "paper", Z: "scissor" }
const mapX2 = { X: "lose", Y: "draw", Z: "win" }

function choice(opp, outcome) {
    if (outcome === "draw") {
        return score(opp, opp);
    }
    if (outcome === "lose") {
        switch (opp) {
            case "rock": return score(opp, "scissor");
            case "paper": return score(opp, "rock");
            case "scissor": return score(opp, "paper");
        }
    }
    if (outcome === "win") {
        switch (opp) {
            case "rock": return score(opp, "paper");
            case "paper": return score(opp, "scissor");
            case "scissor": return score(opp, "rock");
        }
    }
}

const scoring = { rock: 1, paper: 2, scissor: 3 }

function score(a, b) {
    if (a === b) {
        return scoring[b] + 3;
    }
    switch (a + b) {
        case "scissorpaper": return scoring[b] + 0;
        case "rockscissor": return scoring[b] + 0;
        case "paperrock": return scoring[b] + 0;
        case "rockpaper": return scoring[b] + 6;
        case "paperscissor": return scoring[b] + 6;
        case "scissorrock": return scoring[b] + 6;
        default:
            throw new Error(`Unkown: ${a}-${b}`);
    }
}

const scores = data
    .toString()
    .split("\n")
    .map((d) => d.split(" "))
    .map(([a, x]) => score(mapA[a], mapX[x]));

console.log(scores.reduce((a, b) => a + b, 0))

const scores2 = data
    .toString()
    .split("\n")
    .map((d) => d.split(" "))
    .map(([a, x]) => choice(mapA[a], mapX2[x]));

console.log(scores2.reduce((a, b) => a + b, 0))
