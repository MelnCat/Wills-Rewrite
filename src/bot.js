const Client = require("./structs/client.struct");
const client = new Client();
const Discord = require("discord.js");
const chalk = require("chalk");
const strings = client.getModule("strings");
const { models: { guildinfo, blacklist }, models, prefix: defaultPrefix } = client.getModule("sql");
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
	for (const [mname, model] of Object.entries(models)) {
		try {
			await model.sync({ alter: true });
		} catch (err) {
			client.error(`Model ${mname} failed to load. Reason: ${chalk.red(err.short)}`);
		}
	}
	client.log(`${chalk.cyanBright("Bot started!")} Logged in at ${chalk.bold(client.user.tag)}. ID: ${chalk.blue(client.user.id)}`);
});
client.on("messageUpdate", async(oldMessage, newMessage) => {
	if (oldMessage.createdAt < Date.now() - 30000) return;
	client.emit("message", newMessage);
});
client.on("message", async message => {
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
		client.getCommand(command).exec(client, message, args);
	} catch (err) {
		await message.channel.send(`${errors.internal}
\`\`\`js
${err.stack}
\`\`\`
		`);
		client.error(err);
	}
});
process.on("unhandledRejection", (err, p) => {
	client.error(err.stack);
});

client.login(client.auth.token);
