const Discord = require("discord.js");
const define = (o, n, p) => {
	if (typeof o.prototype[n] !== "undefined") return false;
	o.prototype[n] = p;
	return true;
};
const staticdefine = (o, n, p) => {
	if (typeof o[n] !== "undefined") return false;
	o[n] = p;
	return true;
};
/*
* Discord
*/

/*
* Process
*/
process.extensionsLoaded = true;
/*
* Math
*/
staticdefine(Math, "sum", (...n) => n.reduce((a, b) => a + b));
staticdefine(Math, "mean", (...n) => Math.sum(...n) / n.length);
staticdefine(Math, "randint", (size, start = 0) => Math.floor(Math.random() * size) + start);
staticdefine(Math, "range", (size, start = 0) => [...Array(size).keys()].map(x => x + start));
/*
* Array
*/
define(Array, "random", function random() {
	return this[Math.randint(this.length)];
});
define(Array, "sum", function sum() {
	return this.reduce((a, b) => +a + +b);
});
/*
* String
*/
define(String, "replaceLast", function replaceLast(search, replacement) {
	const n = this.lastIndexOf(search);
	if (!(n + 1)) return this;
	return `${this.substring(0, n)}${replacement}${this.substring(n + search.length, this.length)}`.valueOf();
});
define(String, "random", function random() {
	return this[Math.randint(this.length)];
});
define(String, "equalsAny", function equalsAny(...strings) {
	return strings.includes(this.valueOf());
});
define(String, "replaceCase", function replaceCase(search, replacement) {
	return this.replace(new RegExp(search.escapeRegExp(), "gi"), m => String(replacement).matchCase(m.concat(m)));
});
define(String, "replaceAll", function replaceAll(search, replacement) {
	return this.replace(new RegExp(search.escapeRegExp(), "gi"), typeof replacement === "function" ? replacement : m => String(replacement));
});
define(String, "bulkReplace", function bulkReplace(replacer) {
	return Object.entries(replacer).reduce((l, c) => l.replaceAll(...c), this);
});
define(String, "replaceAsync", async function replaceAsync(replacer, replaceFunc) {
	const promises = [];
	this.replace(replacer, (match, ...args) => {
		const promise = replaceFunc(match, ...args);
		promises.push(promise);
	});
	const data = await Promise.all(promises);
	return this.replace(replacer, () => data.shift());
});
define(String, "matchCase", function matchCase(pattern) {
	return Array.from(this).map((x, i) => pattern.charCodeAt(i) >= 65 && pattern.charCodeAt(i) < 65 + 26 ? x.toUpperCase() : x.toLowerCase());
});
define(Array, "groupBy", function groupBy(func) {
	return this.reduce((objectsByKeyValue, obj) => {
		const value = func(obj);
		objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
		return objectsByKeyValue;
	}, {});
});
define(String, "escapeRegExp", function escapeRegExp() {
	return this.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
});
define(String, "splitEnd", function splitEnd(num, every) {
	return this.slice(0, -num).split().concat(this.slice(-num).splitEvery(every));
});
define(String, "splitStart", function splitStart(num, every) {
	return this.slice(0, num).splitEvery(every).concat(this.slice(num));
});
define(String, "splitEvery", function splitEvery(num = 1) {
	return this.match(new RegExp(`.{1,${num}}`, "g"));
});
define(String, "format", function format(...formats) {
	return formats.reduce((l, x) => l.replace("{}", x), this);
});
module.exports = "Ok!";
