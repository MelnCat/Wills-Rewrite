const { Client, Collection, MessageEmbed, Util, ...Discord } = require("discord.js");
const glob = require("glob");
const moment = require("moment-timezone");
const chalk = require("chalk");
const { timestamp } = require("../modules/utils");
const { compareTwoStrings } = require("string-similarity");
const { inspect } = require("util");
const { token } = require("../auth");
module.exports = class DiscordDonuts extends Client {
	constructor(shards = 2) {
		super({ disableEveryone: true, shardCount: shards });
		this.commands = new Collection();
		this.loadCommands();
		this.mainChannels = {};
		this.strings = this.getModule("strings");
		this.utils = this.getModule("utils");
		this.auth = require("../auth");
		this.errors = this.strings.errors;
		this.checkOrderInterval = setInterval(this.utils.checkOrders, 12000);
		this.util = Util;
		this.loadChannels();
	}
	loadChannels() {
		this.on("ready", async() => {
			for (const [name, channel] of Object.entries(this.strings.channels)) {
				const chan = this.channels.get(channel);
				if (!chan) this.error(`Channel ${chalk.magenta(name)} was not found.`);
				this.mainChannels[name] = chan;
				this.log(`Channel ${chalk.green(name)} was loaded!`);
			}
		});
	}
	static getShards(guildCount) {
		return Util.fetchRecommendedShards(token, guildCount);
	}
	createTicket(order) {
		const guild = this.channels.get(order.channel).guild;
		return new MessageEmbed
			.setTitle("New Ticket!")
			.setDescription("A new order is here!")
			.addField("🆔 ID", `\`${order.id}\``)
			.addField("📄 Description", order.description)
			.addField("ℹ Details", `**Customer**: ${this.users.get(order.user).tag} (${order.user})
Channel: #${this.channels.get(order.channel).name} (${order.channel})
Guild: ${guild.name} (${guild.id})
`)
			.addField("💻 Status", this.status(order));
	}
	simplestatus(s) {
		return this.strings.status[s];
	}
	status(order) {
		const st = this.simplestatus(order.status);
		const cl = this.users.get(order.claimer);
		return `${st}${order.status === 1 ? ` by ${cl.tag}` : ""}`;
	}
	loadCommands() {
		const commandFiles = glob.sync("./src/commands/**/*.js").map(file => [file, require(`../.${file}`)]);
		for (const [path, command] of commandFiles) {
			if (this.commands.has(command.name)) return this.error(`Attempted to load command ${chalk.redBright(command.name)}, but the command already exists. Path: ${chalk.yellowBright(path)}`);
			this.commands.set(command.name, command);
			this.log(`Command ${chalk.magentaBright(command.name)} loaded!`);
		}
	}
	refreshAuth() {
		delete require.cache[require.resolve("../auth")];
		return require("../auth");
	}
	get mainGuild() {
		return this.guilds.get(this.auth.mainServer);
	}
	getMainChannel(channelResolvable) {
		if (this.auth.channels[channelResolvable]) channelResolvable = this.auth.channels[channelResolvable];
		return this.getMainGuild().channels.get(channelResolvable);
	}
	getMainMember(id) {
		return this.mainGuild.members.get(id);
	}
	timestamp() {
		return `[${timestamp()}]`;
	}
	log(str) {
		if (str instanceof Object) str = inspect(str, true, null, true);
		console.log(`${chalk.gray(this.timestamp())} ${str}`);
	}
	getModule(m) {
		return require(`${__dirname}\\..\\modules\\${m}`);
	}
	getModel(m) {
		return this.getModule("sql").models[m];
	}
	warn(str) {
		if (str instanceof Object) str = inspect(str, true, null, true);
		console.warn(`${chalk.yellowBright(this.timestamp())} ${str}`);
	}
	error(str) {
		if (str instanceof Object) str = inspect(str, true, null, true);
		console.error(`${chalk.redBright(this.timestamp())} ${str}`);
	}
	getCommand(commandResolvable) {
		return this.commands.get(commandResolvable) || this.commands.find(command => [...command.aliases, ...command.shortcuts, command.name].some(str => str === commandResolvable || (compareTwoStrings(str, commandResolvable) > 0.65))) || null;
	}
};
