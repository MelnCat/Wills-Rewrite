const { Client } = require("discord.js");
const glob = require("glob");
module.exports = class DiscordDonuts extends Client {
	constructor() {
		super({ disableEveryone: true });
	}
	loadCommands() {
		const commandFiles = glob.sync("./src/commands/**/*.js");
		for (const file of commandFiles) {
			console.log(file);
		}
	}
};
