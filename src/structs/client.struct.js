const { Client, Collection } = require("discord.js");
const glob = require("glob");
const moment = require("moment-timezone");
const chalk = require("chalk");
const { timestamp } = require("../modules/util");
const { compareTwoStrings } = require("string-similarity");
const { inspect } = require("util");
module.exports = class DiscordDonuts extends Client {
	constructor() {
		super({ disableEveryone: true });
		this.commands = new Collection();
		this.loadCommands();
		this.auth = require("../auth");
	}
	loadCommands() {
		const commandFiles = glob.sync("./src/commands/**/*.js").map(file => require(`../.${file}`));
		for (const command of commandFiles) {
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
	warn(str) {
		if (str instanceof Object) str = inspect(str, true, null, true);
		console.warn(`${chalk.yellowBright(this.timestamp())} ${str}`);
	}
	error(str) {
		if (str instanceof Object) str = inspect(str, true, null, true);
		console.error(`${chalk.redBright(this.timestamp())} ${str}`);
	}
	getCommand(commandResolvable) {
		return this.commands.find(command => [...command.aliases, ...command.shortcuts, command.name].some(str => str === commandResolvable || (compareTwoStrings(str, commandResolvable) > 0.65))) || null;
	}
};
