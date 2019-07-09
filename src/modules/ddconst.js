const { set } = require("lodash");
module.exports = str => str.split("\n")
	.map(x => x.split("=").map(y => y.trim()))
	.map(x => set({}, ...x))
	.reduce((x, l) => Object.assign(l, x), {});
