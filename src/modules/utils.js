const { models: { orders }, Op } = require("../modules/sql");
const perms = require("../modules/permissions");
const { findBestMatch, compareTwoStrings } = require("string-similarity");
const { MessageEmbed } = require("discord.js");
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
exports.getText = async(message, display = "Respond with text.", time = 40000, filter = m => m.author.id === message.author.id) => {
	await message.channel.send(display);
	const res = await message.channel.awaitMessages(m => filter(m) && m.author.id === message.author.id, { time, max: 1 });
	if (!res.size) return void message.channel.send("No response. Cancelled.");
	return res.first().content;
};
exports.getIndex = async(message, list, internal = list.map((x, i) => x === null ? list[i] : x), display = "item") => {
	const mapped = list.map((x, i) => `[${i + 1}] ${x}`);
	const index = await exports.getText(message, `Please reply with the index of the ${display}.
\`\`\`ini
${mapped.join("\n")}
\`\`\`
	`, 40000, m => !isNaN(m.content) && m.content > 0 && m.content <= list.length);
	if (!index) return false;
	return { index: index - 1, item: internal[index - 1], displayItem: list[index - 1] };
};
exports.getOrder = async(message, args, argn = 0, { between, is } = { is: 0 }, override = false, display = "check") => {
	const client = message.client;
	const filter = is !== undefined ? { [Op.eq]: is } : { [Op.between]: between };
	let order;
	if (await orders.findByPk(args[argn])) order = await orders.findByPk(args[argn]);
	if (!order) {
		let morders = await orders.findAll({ where: { status: filter }, order: [["createdAt", "DESC"]] });
		if (!morders.length) return void await message.channel.send(`There are currently no orders to ${display}.`);
		if (is > 0 && is < 4) {
			morders = morders.filter(x => x.claimer === message.author.id);
			if (morders.length === 1) order = morders[0];
		} else {
			const orderdis = morders.map(x => `${x.id} - ${x.description} [${client.statusOf(x)}]`);
			const res = await exports.getIndex(message, orderdis, morders, "order");
			if (!res) return;
			order = res.item;
		}
	}
	if (!override && !await orders.findOne({ where: { status: filter, id: order.id } })) return void await message.channel.send("The fetched order did not meet the status requirements.");
	return order;
};
exports.alert = async(client, data) => {
	const embed = new MessageEmbed()
		.setTitle("Kitchen Alert")
		.setDescription(data.bulkReplace({ "[orders]": await orders.count({ where: { status: { [Op.lt]: 4 } } }) }));
	client.mainChannels.kitchen.send(embed);
};
exports.getUser = async(message, args, argn = 0, autoself = false, onlyargn = true, filter = () => true) => {
	const client = message.client;
	let selecting = args.slice(argn, onlyargn ? argn + 1 : args.length).join(" ");
	let user;
	if (!args[argn] && autoself) {
		user = message.author;
	} else if (!args[argn] && !autoself) {
		return void await message.channel.send("You did not provide a user.");
	} else if (message.mentions.users.size) {
		user = message.mentions.users.first();
	} else if (!isNaN(args[argn])) {
		user = client.users.get(args[argn]);
		if (!user) {
			return void await message.channel.send("That is not a valid id.");
		}
	} else {
		const userlist = client.mainGuild.members.concat(message.guild.members).sort(
			(a, b) => compareTwoStrings(selecting, b.tag) - compareTwoStrings(selecting, a.tag)
		)
			.filter(x => filter(x.user || x))
			.array();
		if (!userlist.length) return;
		let names = userlist.map(x => x.tag).slice(0, 5);
		const nameDict = await exports.getIndex(message, names, userlist, "user");
		if (!nameDict) return;
		const u = nameDict.item;
		if (!u) client.log(nameDict);
		user = u.user || u;
	}
	if (!user) throw new Error("No user?");
	if (!filter(user)) return void await message.channel.send("That user did not pass the filter.");
	return user;
};
exports.execPermission = (id, member) => {
	const client = member.client;
	for (const i of Math.range(perms.length - id, id)) {
		if (perms[i](client, member)) return true;
	}
	return false;
};
