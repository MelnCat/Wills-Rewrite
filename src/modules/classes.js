const _ = require("lodash");
class GenericError extends Error {
	constructor(...m) {
		super(...m);
		this.name = this.constructor.name;
	}
}

class EndCommand extends GenericError { }
exports.EndCommand = EndCommand;

class WrongChannelError extends EndCommand { }
exports.WrongChannelError = WrongChannelError;

class IncorrectArgumentsError extends EndCommand { }
exports.IncorrectArgumentsError = IncorrectArgumentsError;

exports.ProgressBar = class ProgressBar {
	constructor(min = 0, max = 100, filled = "▓", unfilled = "░") {
		this.min = min;
		this.max = max;
		this.filled = filled;
		this.unfilled = unfilled;
	}

	generate(progress = this.max / 2, { percent = false, decimals = 0, prefix = "", total = this.max } = {}) {
		if (progress < 0) progress = 0;
		let s = progress * (total / this.max);
		if (s < 0) s = 0;
		let f = this.filled.repeat(s);
		let t = total - f.length;
		if (t < 0) t = 0;
		let u = this.unfilled.repeat(t);
		let e = "";
		let p = "";
		if (prefix) p = `${prefix} `;
		if (percent) e = ` ${((progress / this.max) * 100).toFixed(decimals)}%`;
		return `${p}${f}${u}${e}`;
	}

	setMin(m) {
		this.min = 0;
		return this;
	}

	setMax(m) {
		this.max = m;
		return this;
	}

	setFilled(f) {
		this.filled = f;
		return this;
	}

	setUnfilled(u) {
		this.unfilled = u;
		return this;
	}
};
exports.Matrix = class Matrix {
	constructor(rows, columns, defaultValue = 0) {
		this.map = Array(rows)
			.fill(0)
			.map((x, i) => Array(columns)
				.fill(0).map((y, j) => typeof defaultValue === "function" ? defaultValue(i * j) : defaultValue));
	}
	validate(row, column) {
		return Boolean(this.map[row] && this.map[row][column]);
	}
	row(number) {
		if (!this.validate(number, 0)) throw TypeError(`Row ${number} does not exist.`);
		return this.map[number];
	}
	column(number) {
		if (!this.validate(0, number)) throw TypeError(`Column ${number} does not exist.`);
		return this.rotate().row(number);
	}
	get(row, column) {
		if (!this.validate(row, column)) throw TypeError(`Point (${row}, ${column}) does not exist.`);
		return this.map[row][column];
	}
	set(row, column, newval) {
		if (!this.validate(row, column)) throw TypeError(`Point (${row}, ${column}) does not exist.`);
		this.map[row][column] = newval;
		return this.map;
	}
	static from(val) {
		if (!(val instanceof Array && val.every(x => x instanceof Array))) throw TypeError(`${val} is not a valid 2D Array.`);
		const matrix = new Matrix();
		matrix.map = val;
		return matrix;
	}
	rotate() {
		return Matrix.from(_.zip(...this.map));
	}
	popColumn(number) {
		if (!this.validate(0, number)) throw TypeError(`Column ${number} does not exist.`);
		const rotated = this.rotate();
		const returnval = rotated.row(number).pop();
		this.map = rotated.rotate();
		return returnval;
	}
	toString() {
		return this.map.map(x => x.join("")).join("\n");
	}
};

