const Client = require("./structs/client.struct");
const client = new Client(2);
const Discord = require("discord.js");
const chalk = require("chalk");
const strings = client.getModule("strings");
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
		await client.getCommand(command).exec(client, message, args, now);
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
});
orders.beforeUpdate(async(order, options) => {
	if (!client.users.get(order.user)) return order.destroy();
	if (!client.channels.get(order.channel)) return order.destroy();
	if (order.message && !client.mainChannels.ticket.messages.fetch(order.message)) return order.destroy();
	switch (order.status) {
		case 0: {
			order.expireFinish = Date.now() + client.strings.times.expire;
			await client.mainChannels.ticket.send(client.createTicket(order));
			break;
		}
		case 6: {
			await client.users.get(order.user).send(client.errors.expired);
		}
	}
});
process.on("unhandledRejection", (err, p) => {
	client.error(err.stack);
});

client.login(client.auth.token);
