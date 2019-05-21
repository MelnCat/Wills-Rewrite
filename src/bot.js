const Client = require("./structs/client.struct");
const client = require("./modules/client");
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
Object.defineProperty(Discord.GuildMember.prototype, "isEmployee", {
	get() {
		return this.roles.has(client.mainRoles.employee.id) && this.guild.id === client.mainGuild.id;
	}
});
Object.defineProperty(Discord.GuildMember.prototype, "tag", {
	get() {
		return `${this.displayName}#${this.user.discriminator}`;
	}
});
client.log("Starting bot...");
client.on("modelsLoaded", async() => {
	client.orders = await orders.findAll();
});
client.on("ready", async() => {
	await client.loadModels();
	client.user.setActivity("Just started! Order donuts!");
	client.getModule("extensions");
	const authenErr = await sequelize.authenticate();
	if (authenErr) client.error(`${chalk.yellow("Database")} failed to load. ${chalk.red(authenErr)}`);
	client.log(`${chalk.cyanBright("Bot started!")} Logged in at ${chalk.bold(client.user.tag)}. ID: ${chalk.blue(client.user.id)}`);
	client.log(`Currently in ${chalk.greenBright(client.guilds.size)} guild(s)!`);
});
client.on("guildMemberUpdate", async(oldM, newM) => {
	if (oldM.isEmployee && !newM.isEmployee) {
		client.emit("fire", newM);
	}
	if (!oldM.isEmployee && newM.isEmployee) {
		client.emit("hire", newM);
	}
});
client.on("guildMemberRemove", async member => {
	if (member.isEmployee) client.emit("fire", member);
});
client.on("fire", member => {
	client.log(`oh fuck, ${member.tag} is fired.`);
});
client.on("hire", member => {
	client.log(`oh yay, ${member.tag} is hired.`);
});
client.on("messageUpdate", async(oldMessage, newMessage) => {
	if (oldMessage.createdAt < Date.now() - 30000) return;
	client.emit("message", newMessage);
});
client.on("message", async message => {
	if (!client.started) return process.exit();
	
	//if (!message.guild) return;
	if (message.channel.type == "dm") {
		const e = new MessageEmbed()
			.setAuthor(message.author.tag, message.author.avatarURL())
			.setTitle(`${message.author.tag} (ID: ${message.author.id}) sent me this:`)
			.addField(message.content)
			.setFooter(`Want to reply? Run \`d!replydm ${message.author.id} <content>\`!`)
			.setTimestamp();
		client.user.channels.find(ch => ch.id === client.channels.mailbox).send(e);
	}
	
	message.author.hasOrder = Boolean(await orders.findOne({ where: { user: message.author.id, status: { [Op.lt]: 4 } } }));
	message.author.order = await orders.findOne({ where: { status: { [Op.lt]: 4 }, user: message.author.id } });
	message.channel.assert = async function assert(id) {
		if (this.id !== id) {
			this.send(client.errors.channel.replace("{}", id));
			throw new client.classes.WrongChannelError(`Expected channel ${id} but instead got ${this.id}.`);
		}
	};
	if (await blacklist.findByPk(message.author.id)) return message.channel.send(errors.blacklisted);
	message.guild.info = await (await guildinfo.findOrCreate({ where: { id: message.guild.id }, defaults: { id: message.guild.id } }))[0];
	message.author.lastOrder = await orders.findOne({ where: { user: message.author.id }, order: [["createdAt", "DESC"]] });
	const prefixes = [defaultPrefix, `<@${client.user.id}>`, `<@!${client.user.id}>`, message.guild.info.prefix];
	const prefix = prefixes.find(x => message.content.startsWith(x));
	if (!prefix) return;
	message.content = message.content.replace(prefix, "").trim();
	message.permissions = message.channel.permissionsFor(client.user.id).toArray();
	const args = message.content.split(/\s+/);
	const command = args.shift();
	// COMMAND INFO START
	if (!client.getCommand(command)) return;
	if (client.strings.permissionFlags.find(x => !message.permissions.includes(x))) {
		return message.channel.send(`Sorry, the command failed to process because I do not have enough permissions in this channel.
I require the following permissions to be added:
${client.strings.permissionFlags.filter(x => !message.permissions.includes(x)).map(x => `\`${x}\``).join(", ")}`);
	}
	try {
		const gcommand = await client.getCommand(command);
		message.command = {
			onRecieved: process.hrtime.bigint(),
			name: gcommand.name,
			prefix,
			inputName: command
		};
		if (!gcommand.execPermissions(client, message.member)) return message.channel.send(client.errors.permissions);
		await gcommand.exec(client, message, args);
	} catch (err) {
		if (err instanceof client.classes.EndCommand) return;
		if (client.errors.codes[err.code]) {
			await message.channel.send(client.errors.codes[err.code]);
		} else {
			await message.channel.send(`${errors.internal}
\`\`\`js
${err.stack}
\`\`\`
		`);
		}
		client.error(err.stack);
	}
});
/*
* SQL OnUpdate
*/
orders.afterCreate(async(order, options) => {
	const tm = await client.mainChannels.ticket.send(client.createTicket(order));
	await order.update({ message: tm.id, expireFinish: Date.now() + client.strings.times.expire });
	client.orders.push(order);
});
orders.beforeDestroy(async(order, options) => {
	await client.users.get(order.user).send("Sorry! Due to unexpected issues, your order was deleted.");
	client.orders = client.orders.filter(x => x.id === order.id);
});
orders.beforeUpdate(async(order, options) => {
	if (!options.fields.includes("status")) return;
	if (!client.users.get(order.user)) return order.destroy();
	if (!client.channels.get(order.channel)) return order.destroy();
	if (order.status < 4 && order.message && !client.mainChannels.ticket.messages.fetch(order.message)) return order.destroy();
	switch (order.status) {
		case 2: {
			if (!order.url) return order.update({ status: 1 });
			await client.users.get(order.user).send(`Your order is now cooking. It will take ${((order.cookFinish - Date.now()) / 60000).toFixed(2)} minutes to finish cooking.`);
			break;
		}
		case 3: {
			await client.mainChannels.delivery.send(`<@${order.claimer}>, order \`${order.id}\` has finished cooking and is ready to be delivered!`);
			await order.update({ deliverFinish: Date.now() + client.strings.times.deliver });
			break;
		}
		case 4: {
			if (!order.deliverer) {
				await client.channels.get(order.channel).send(`<@${order.user}> Here is your donut! ${order.url}
Rate your cook using \`d!rate [1-5]\`.
If you enjoy our services and want to support us, donate at <https://patreon.com/discorddonuts>!
Have a great day!
`);
				return client.mainChannels.delivery.send(`Order \`${order.id}\` has been automatically delivered.`);
			}
			break;
		}
		case 6: {
			await client.users.get(order.user).send(client.errors.expired);
			break;
		}
	}
	if (order.status > 3) {
		if (await client.mainChannels.ticket.messages.fetch(order.message)) {
			const tm = await client.mainChannels.ticket.messages.fetch(order.message);
			await tm.delete();
		}
	} else {
		const tm = await client.mainChannels.ticket.messages.fetch(order.message);
		if (!tm || !tm.edit) return order.destroy();
		tm.edit(client.createTicket(order));
	}
});
process.on("unhandledRejection", (err, p) => {
	if (!process.extensionsLoaded) client.getModule("extensions");
	if (err.name.equalsAny("TimeoutError", "SequelizeConnectionError")) {
		client.status = 1;
		return client.error(`Database failed to load.`);
	}
	client.error(err.stack);
});

client.login(client.auth.token);
