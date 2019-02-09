const Client = require("./structs/client.struct");
const client = new Client(2);
const Discord = require("discord.js");
const chalk = require("chalk");
const strings = client.getModule("strings");
const { Op } = require("./modules/sql");
const { models: { guildinfo, blacklist, orders }, models, prefix: defaultPrefix, sequelize } = client.getModule("sql");
const { errors } = strings;
Object.defineProperty(Error.prototype, "short", {
	get() {
		return `${this.name}: ${this.message}`;
	}
});
Object.defineProperty(Error.prototype, "shortcolors", {
	get() {
		return `${chalk.redBright(this.name)}: ${chalk.red(this.message)}`;
	}
});
client.log("Starting bot...");
client.on("ready", async() => {
	client.user.setActivity("Just started! Order donuts!");
	client.getModule("extensions");
	const authenErr = await sequelize.authenticate();
	if (authenErr) client.error(`${chalk.yellow("Database")} failed to load. ${chalk.red(authenErr)}`);
	for (const [mname, model] of Object.entries(models)) {
		try {
			await model.sync({ alter: true });
		} catch (err) {
			client.error(`Model ${mname} failed to load. Reason: ${chalk.red(err.short)}`);
		}
	}
	client.log(`${chalk.cyanBright("Bot started!")} Logged in at ${chalk.bold(client.user.tag)}. ID: ${chalk.blue(client.user.id)}`);
	client.log(`Currently in ${chalk.greenBright(client.guilds.size)} guild(s)!`);
});
client.on("messageUpdate", async(oldMessage, newMessage) => {
	if (oldMessage.createdAt < Date.now() - 30000) return;
	client.emit("message", newMessage);
});
client.on("message", async message => {
	message.author.hasOrder = Boolean(await orders.findOne({ where: { user: message.author.id, status: { [Op.lt]: 4 } } }));
	message.author.order = await orders.findOne({ where: { status: { [Op.lt]: 4 }, user: message.author.id } });
	const now = process.hrtime.bigint();
	if (message.author.bot) return;
	if (await blacklist.findByPk(message.author.id)) return message.channel.send(errors.blacklisted);
	message.guild.info = await (await guildinfo.findOrCreate({ where: { id: message.guild.id }, defaults: { id: message.guild.id } }))[0];
	const prefixes = [defaultPrefix, `<@${client.user.id}>`, `<@!${client.user.id}>`, message.guild.info.prefix];
	const prefix = prefixes.find(x => message.content.startsWith(x));
	if (!prefix) return;
	message.content = message.content.replace(prefix, "").trim();
	const args = message.content.split(/\s+/);
	const command = args.shift();
	if (!client.getCommand(command)) return;
	try {
		const gcommand = await client.getCommand(command);
		if (!gcommand.execPermissions(client, message.member)) return message.channel.send(client.errors.permissions);
		await gcommand.exec(client, message, args, now);
	} catch (err) {
		await message.channel.send(`${errors.internal}
\`\`\`js
${err.stack}
\`\`\`
		`);
		client.error(err);
	}
});
/*
* SQL OnUpdate
*/
orders.afterCreate(async(order, options) => {
	await client.users.get(order.user).send("Thank you for ordering a donut. Your order was sent to our cooks.");
	order.expireFinish = Date.now() + client.strings.times.expire;
	const tm = await client.mainChannels.ticket.send(client.createTicket(order));
	await order.update({ message: tm });
});
orders.beforeDestroy(async(order, options) => {
	await client.users.get(order.user).send("Sorry! Due to unexpected issues, your order was deleted.");
});
orders.beforeUpdate(async(order, options) => {
	if (!options.fields.includes("status")) return;
	if (!client.users.get(order.user)) return order.destroy();
	if (!client.channels.get(order.channel)) return order.destroy();
	if (order.status < 4 && order.message && !client.mainChannels.ticket.messages.fetch(order.message)) return order.destroy();
	switch (order.status) {
		case 6: {
			await client.users.get(order.user).send(client.errors.expired);
		}
	}
	if (order.status > 3) {
		if (await client.mainChannels.ticket.messages.fetch(order.message)) {
			const tm = await client.mainChannels.ticket.messages.fetch(order.message);
			await tm.delete();
		}
	} else {
		const tm = await client.mainChannels.ticket.messages.fetch(order.message);
		tm.edit(client.createTicket(order));
	}
});
process.on("unhandledRejection", (err, p) => {
	if (!err.name.equalsAny) client.getModule("extensions");
	if (err.name.equalsAny("TimeoutError", "SequelizeConnectionError")) {
		client.status = 1;
		return client.error(`Database failed to load.`);
	}
	client.error(err.stack);
});

client.login(client.auth.token);
