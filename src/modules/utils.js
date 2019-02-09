const { models: { orders }, Op } = require("../modules/sql");
exports.hash = string => {
	string = String(string);
	var hash = 0, i, chr;
	if (string.length === 0) return hash;
	for (const char of string) {
		chr = char.charCodeAt(0);
		hash = ((hash << 5) - hash) + chr;
		hash |= 0;
	}
	return hash;
};
const moment = require("moment-timezone");
exports.timestamp = () => `${moment().tz("Canada/Pacific").format("DD-MM-YY hh:mm:ss z")}`;
exports.random = Math.random;
exports.random.seed = seed => {
	seed = exports.hash(seed);
	const x = Math.sin(seed) * 10000;
	return x - Math.floor(x);
};
exports.random.string = (amount = 1) => {
	let res = "";
	for (const i of Math.range(amount)) {
		res += "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".random();
	}
	return res;
};
exports.autoDeliver = async order => {
	"TODO";
};
exports.checkOrders = async() => {
	const unc = await orders.findAll({ where: { status: 0, expireFinish: { [Op.lt]: Date.now() } } });
	const dck = await orders.findAll({ where: { status: 2, cookFinish: { [Op.lt]: Date.now() } } });
	const dlv = await orders.findAll({ where: { status: 3, deliverFinish: { [Op.lt]: Date.now() } } });
	for (const order of unc) {
		await order.update({ status: 6 });
	}
	for (const order of dck) {
		await order.update({ status: 3 });
	}
	for (const order of dlv) {
		await order.update({ status: 4 });
	}
};
exports.chunk = (array = [], size = 3) => {
	const res = [];
	for (let [i, j] = [0, array.length]; i < j; i += size) {
		res.push(array.slice(i, i + size));
	}
	return res;
};
