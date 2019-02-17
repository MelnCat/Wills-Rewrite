const { Client, Collection, MessageEmbed, Util, ...Discord } = require("discord.js");
const glob = require("glob");
const moment = require("moment-timezone");
const chalk = require("chalk");
const { timestamp } = require("../modules/utils");
const { compareTwoStrings } = require("string-similarity");
const { inspect } = require("util");
const { token } = require("../auth");
const { basename, dirname, resolve } = require("path");
const Command = require("./command.struct");
module.exports = class DiscordDonuts extends Client {
	constructor(shards = 2) {
		super({ disableEveryone: true, shardCount: shards });
		this.loadCommands();
		this.strings = this.getModule("strings");
		this.utils = this.getModule("utils");
		this.classes = this.getModule("classes");
		this.auth = require("../auth");
		this.status = 0;
		this.errors = this.strings.errors;
		this.statuses = ["with donuts."];
		this.util = Util;
		this.loadChannels();
		this.loadRoles();
		this.loadEmojis();
		this.loadIntervals();
	}
	loadIntervals() {
		this.on("ready", () => {
			this.statusInterval = setInterval(() => {
				if (!this.user.presence.activity) return;
				if (this.status && this.user.presence.activity.name !== this.strings.cstatus[this.status]) this.user.setActivity(this.strings.cstatus[this.status]);
				if (!this.status && Math.floor(Math.random() * 50) === 34) this.user.setActivity(this.statuses.random());
			}, 10000);
			this.checkOrderInterval = setInterval(this.utils.checkOrders, 12000);
		});
	}
	loadRoles() {
		this.mainRoles = {};
		this.on("ready", async() => {
			for (const [name, role] of Object.entries(this.strings.roles)) {
				const r = this.mainGuild.roles.get(role);
				if (!r) {
					this.error(`Role ${chalk.blue(name)} was not found.`);
					continue;
				}
				this.mainRoles[name] = r;
				this.log(`Role ${chalk.cyan(name)} was loaded!`);
			}
		});
	}
	loadEmojis() {
		this.mainEmojis = {};
		this.on("ready", async() => {
			for (const [name, emoji] of Object.entries(this.strings.emojis)) {
				const r = this.emojis.get(emoji);
				if (!r) {
					this.error(`Emoji ${chalk.red(name)} was not found.`);
					continue;
				}
				this.mainEmojis[name] = r;
				this.log(`Emoji ${chalk.yellow(name)} was loaded!`);
			}
		});
	}
	loadChannels() {
		this.mainChannels = {};
		this.on("ready", async() => {
			for (const [name, channel] of Object.entries(this.strings.channels)) {
				const chan = this.mainGuild.channels.get(channel);
				if (!chan) {
					if (this.channels.get(channel)) {
						this.error(`Channel ${chalk.magenta(name)} was not found in the main guild\
, but it was instead found in the guild ${chalk.blue(this.channels.get(channel).guild.name)}.`);
						continue;
					}
					this.error(`Channel ${chalk.magenta(name)} was not found.`);
					continue;
				}
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
		return new MessageEmbed()
			.setTitle("New Ticket!")
			.setDescription("A new order is here!")
			.addField("🆔 ID", `\`${order.id}\``)
			.addField("📄 Description", order.description)
			.addField("ℹ Details", `**Customer**: ${this.users.get(order.user).tag} (${order.user})
**Channel**: #${this.channels.get(order.channel).name} (${order.channel})
**Guild**: ${guild.name} (${guild.id})
`)
			.addField("💻 Status", this.statusOf(order));
	}
	customTicket(order, text = "No text specified.") {
		const guild = this.channels.get(order.channel).guild;
		return new MessageEmbed()
			.setTitle("Ticket")
			.setDescription(text)
			.addField("🆔 ID", `\`${order.id}\``)
			.addField("📄 Description", order.description)
			.addField("ℹ Details", `**Customer**: ${this.users.get(order.user).tag} (${order.user})
**Channel**: #${this.channels.get(order.channel).name} (${order.channel})
**Guild**: ${guild.name} (${guild.id})
`)
			.addField("💻 Status", this.statusOf(order));
	}
	alert(string) {
		return this.utils.alert(this, string);
	}
	simplestatus(s) {
		return this.strings.status[s];
	}
	statusOf(order) {
		const st = this.simplestatus(order.status);
		const cl = this.users.get(order.claimer);
		return `${st}${order.status === 1 ? ` by ${cl.tag}` : ""}`;
	}
	reloadCommands() {
		this.loadCommands();
	}
	loadCommands() {
		this.commands = new Collection();
		const commandFiles = glob.sync("./src/commands/**/*.js").map(file => {
			delete require.cache[resolve(file)];
			return [dirname(`../.${file}`), require(`../.${file}`)];
		});
		for (const [path, command] of commandFiles) {
			if (!(command instanceof Command)) {
				this.error(`Attempted to load command ${chalk.redBright(command.name)}, but it wasn't a command. Path: ${chalk.yellowBright(path)}`);
				continue;
			}
			if (this.commands.has(command.name)) {
				this.error(`Attempted to load command ${chalk.redBright(command.name)}, but the command already exists. Path: ${chalk.yellowBright(path)}`);
				continue;
			}
			command.category = basename(path);
			this.commands.set(command.name, command);
			this.emit("commandLoad", command); // * LOADS EVENT onCommandLoad
		}
	}

	get mainGuild() {
		return this.guilds.get(this.strings.mainServer);
	}
	async getCommits() {
		const v = await this.utils.execBash("git rev-list --no-merges --count HEAD");
		if (isNaN(v)) return "???";
		return v.trim();
	}
	async getVersion() {
		const v = await this.getCommits();
		return v.padStart(3, 0).splitEnd(2).join(".");
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
	refreshAuth() {
		delete require.cache[require.resolve("../auth")];
		return require("../auth");
	}
	refreshModule(m) {
		delete require.cache[require.resolve(`${__dirname}\\..\\modules\\${m}`)];
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
