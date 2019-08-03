const { Client, Collection, MessageEmbed, Util, ...Discord } = require("discord.js");
const glob = require("glob");
const moment = require("moment-timezone");
const chalk = require("chalk");
const { timestamp } = require("../modules/utils");
const { compareTwoStrings, findBestMatch } = require("string-similarity");
const { ratio } = require("fuzzball");
const { inspect } = require("util");
const { token } = require("../auth");
const { basename, dirname, resolve } = require("path");
const Command = require("./command.struct");
const _ = require("lodash");
module.exports = class DiscordDonuts extends Client {
	constructor(shards = 2) {
		super({ disableEveryone: true, shardCount: shards });
		this.loadCommands();
		this.constants = this.getModule("constants");
		this.utils = this.getModule("utils");
		this.classes = this.getModule("classes");
		this.auth = require("../auth");
		this.status = 0;
		this.errors = this.constants.errors;
		this.statuses = ["with donuts."];
		this.permissionFlags = this.constants.permissionFlags;
		this.util = Util;
		this.cached = {};
		this._ = _;
		this.MessageEmbed = MessageEmbed;
		this.loadChannels();
		this.loadRoles();
		this.loadEmojis();
		this.loadMessages();
		this.loadIntervals();
		this.started = true;
	}

	async loadModels() {
		const { models } = this.getModule("sql");
		for (const [mname, model] of Object.entries(models)) {
			try {
				await model.sync({ alter: true });
			} catch (err) {
				this.error(`Model ${mname} failed to load. Reason: ${chalk.red(err.short)}`);
			}
		}
		this.emit("modelsLoaded");
	}

	loadIntervals() {
		this.on("ready", () => {
			this.statusInterval = setInterval(async() => {
				if (this.status === 1) {
					try {
						await this.getModule("sql").authenticate();
						this.status = 0;
					} catch (err) {
						// do nothing
					}
				}
				if (!this.user.presence.activity) return;
				if (this.status && this.user.presence.activity.name !== this.constants.cstatus[this.status]) this.user.setActivity(this.constants.cstatus[this.status]);
				if (!this.status && Math.floor(Math.random() * 50) === 34) this.user.setActivity(this.statuses.random());
			}, 10000);
			this.checkOrderInterval = setInterval(this.utils.checkOrders, 12000, this);
		});

		this.on("ready", () => {
			const sequelize = this.getModule("sql");
			this.databaseCacheInterval = setInterval(async() => {
				for (const [name, model] of Object.entries(sequelize.models)) {
					this.cached[name] = await model.findAll();
				}
			}, 1000);
		});

		this.on("ready", () => {
			const sequelize = this.getModule("sql");
			this.stockInterval = setInterval(async() => {
				if (!this.cached.stocks) return;
				const embed = new MessageEmbed()
					.setTitle("📦 Ingredients In Stock 📦")
					.setDescription("Ingredients are required to make donuts.")
					.setFooter("Run d!restock to restock ingredients!")
					.setThumbnail("https://i.kym-cdn.com/photos/images/original/001/262/983/2f0.png")
					.setTimestamp();
				for (const ingredient of this.cached.stocks) {
					embed.addField(`[${ingredient.id}] ${ingredient.emoji} ${ingredient.name}`, `${ingredient.count}/${ingredient.max} in stock.${ingredient.count / ingredient.max < 0.2 ? " Running low!" : ""}`);
				}
				await this.mainMessages.stocks.edit(embed);
			}, 2000);
		});

		this.on("ready", () => {
			const orders = this.getModel("orders");
			const { Op } = this.getModule("sql");
			this.orderInterval = setInterval(async() => {
				await orders.update({ status: 3 }, { where: { cookFinish: { [Op.lt]: Date.now() }, status: 2 } });
				await orders.update({ status: 6 }, { where: { expireFinish: { [Op.lt]: Date.now() }, status: 0 } });
				await orders.update({ status: 4 }, { where: { deliverFinish: { [Op.lt]: Date.now() }, status: 3 } });
			}, 2000);
		});
	}

	loadRoles() {
		this.mainRoles = {};
		this.on("ready", async() => {
			for (const [name, role] of Object.entries(this.constants.roles)) {
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
			for (const [name, emoji] of Object.entries(this.constants.emojis)) {
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
			for (const [name, channel] of Object.entries(this.constants.channels)) {
				const chan = this.mainGuild.channels.get(channel);
				if (!chan) {
					this.error(`Channel ${chalk.magenta(name)} was not found.`);
					continue;
				}
				this.mainChannels[name] = chan;
				this.log(`Channel ${chalk.green(name)} was loaded!`);
			}
		});
	}

	loadMessages() {
		this.mainMessages = {};
		this.on("ready", async() => {
			for (const [name, entry] of Object.entries(this.constants.messages)) {
				if (!entry.match(/^#\d+:\d+$/)) {
					this.error(`Message ${chalk.magenta(name)} was not the correct format.`);
					continue;
				}
				const [channel, message] = [entry.match(/(?<=#)\d+/)[0], entry.match(/(?<=:)\d+/)[0]];
				const chan = this.channels.get(channel);
				if (!chan) {
					this.error(`Channel for message ${chalk.magenta(name)} was not found.`);
					continue;
				}
				const msg = await chan.messages.fetch(message);
				if (!msg) {
					this.error(`Message ${chalk.magenta(name)} was not found.`);
					continue;
				}
				this.mainMessages[name] = msg;
				this.log(`Message ${chalk.red(name)} was loaded!`);
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
	embed(title, description, data) {
		return new MessageEmbed({ title, description, ...data });
	}
	customTicket(order, text = "No text specified.", title = "Ticket") {
		const guild = this.channels.get(order.channel).guild;
		return this.createTicket(order)
			.setTitle(title)
			.setDescription(text);
	}

	alert(string) {
		return this.utils.alert(this, string);
	}

	simplestatus(s) {
		return this.constants.status[s];
	}

	statusOf(order) {
		const st = this.simplestatus(order.status);
		const cl = this.users.get(order.claimer);

		return `${st}${order.status === 1 ? ` by ${cl.tag}` : ""}${order.status === 0 ? order.prepared ? ", prepared" : ", unprepared" : ""}`;
	}

	reloadCommands() {
		this.loadCommands();
	}

	loadCommands() {
		this.commands = new Collection();
		const commandFiles = glob.sync("./commands/**/*.js").map(file => {
			delete require.cache[resolve(file)];
			return [dirname(`.${file}`), require(`.${file}`)];
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
		return this.guilds.get(this.constants.mainServer);
	}

	get staffGuild() {
		return this.guilds.get(this.constants.staffServer);
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
		return require(`${__dirname}/../modules/${m}`);
	}

	refreshAuth() {
		delete require.cache[require.resolve("../auth")];
		return require("../auth");
	}

	refreshModule(m) {
		delete require.cache[require.resolve(`${__dirname}/../modules/${m}`)];
		return require(`${__dirname}/../modules/${m}`);
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
		commandResolvable = String(commandResolvable).toLowerCase();
		return this.commands.get(commandResolvable) || this.commands.find(command => [...command.aliases, ...command.shortcuts, command.name].some(str => str === commandResolvable || (compareTwoStrings(str, commandResolvable) > 0.85))) || null;
	}
};
