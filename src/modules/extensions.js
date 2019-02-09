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
module.exports = "Ok!";
