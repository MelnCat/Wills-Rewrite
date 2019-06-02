const fs = require("fs");
const p = require("path");
module.exports = path => Object.assign({}, ...Array.from(fs.readFileSync(p.join(__dirname, path), { encoding: "utf8" }).trim().split("\n")
	.map(x => x.split("=").map(y => y.trim()))), ([key, val]) => ({ [key]: val }));
