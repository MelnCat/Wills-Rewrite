const { Client, Collection } = require("discord.js");
const glob = require("glob");
const moment = require("moment-timezone");
const chalk = require("chalk");
const { timestamp } = require("../modules/util");
const { compareTwoStrings } = require("string-similarity");
module.exports = class DiscordDonuts extends Client {
	constructor() {
		super({ disableEveryone: true });
		this.commands = new Collection();
		this.loadCommands();
	}
	loadCommands() {
		const commandFiles = glob.sync("./src/commands/**/*.js").map(file => require(`../.${file}`));
		for (const command of commandFiles) {
			this.commands.set(command.name, command);
			this.log(`Command ${chalk.magentaBright(command.name)} loaded!`);
		}
	}
	timestamp() {
		return `[${timestamp()}]`;
	}
	log(str) {
		console.log(`${chalk.gray(this.timestamp())} ${str}`);
	}
	warn(str) {
		console.warn(`${chalk.yellowBright(this.timestamp())} ${str}`);
	}
	error(str) {
		console.error(`${chalk.redBright(this.timestamp())} ${str}`);
	}
	getCommand(commandResolvable) {
		return this.commands.find(command => [command.aliases, command.shortcuts, command.name].some(str => str === commandResolvable || (compareTwoStrings(str, commandResolvable) > 0.75))) || null;
	}
};
