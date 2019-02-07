const Discord = require("discord.js");
const Client = require("./client.struct");
module.exports = class Command {
	constructor(name, description) {
		this.name = name;
		this.description = description;
	}
	setFunction(exec) {
		this.exec = exec;
		return this;
	}
	setAlias(...aliases) {
		this.aliases = aliases;
	}
	setShortcut(...shortcuts) {
		this.shortcuts = shortcuts;
	}
	exec(client = new Client(), message = new Discord.Message, args = []) {
		return message.channel.send("No function has been set for this command.");
	}
};
