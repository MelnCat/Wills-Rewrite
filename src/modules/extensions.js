/*
* Process
*/
process.extensionsLoaded = true;
/*
* Math
*/
Math.sum = (...n) => n.reduce((a, b) => a + b);
Math.mean = (...n) => Math.sum(...n) / n.length;
Math.randint = (size, start = 0) => Math.floor(Math.random() * size) + start;
Math.range = (size, start = 0) => [...Array(size).keys()].map(x => x + start);
/*
* Array
*/
Array.prototype.random = function random() {
	return this[Math.randint(this.length)];
};
Array.prototype.sum = function sum() {
	return this.reduce((a, b) => +a + +b);
};
/*
* String
*/
String.prototype.replaceLast = function replaceLast(search, replacement) {
	const n = this.lastIndexOf(search);
	if (!(n + 1)) return this;
	return `${this.substring(0, n)}${replacement}${this.substring(n + search.length, this.length)}`.valueOf();
};
String.prototype.random = function random() {
	return this[Math.randint(this.length)];
};
String.prototype.equalsAny = function equalsAny(...strings) {
	return strings.includes(this.valueOf());
};
String.prototype.replaceCase = function replaceCase(search, replacement) {
	return this.replace(new RegExp(search.escapeRegExp(), "gi"), m => String(replacement).matchCase(m.concat(m)));
};
String.prototype.replaceAll = function replaceAll(search, replacement) {
	return this.replace(new RegExp(search.escapeRegExp(), "gi"), m => String(replacement));
};
String.prototype.bulkReplace = function bulkReplace(replacer) {
	// eslint-disable-next-line consistent-this
	let res = this;
	for (const x in replacer) {
		res = res.replaceAll(x, replacer[x]);
	}
	return res;
};
String.prototype.matchCase = function matchCase(pattern) {
	var result = "";

	for (var i = 0; i < this.length; i++) {
		var c = this.charAt(i);
		var p = pattern.charCodeAt(i);

		if (p >= 65 && p < 65 + 26) {
			result += c.toUpperCase();
		} else {
			result += c.toLowerCase();
		}
	}

	return result;
};
String.prototype.escapeRegExp = function escapeRegExp() {
	return this.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};
module.exports = "Ok!";
