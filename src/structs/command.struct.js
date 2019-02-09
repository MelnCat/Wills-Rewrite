const Discord = require("discord.js");
const Client = require("./client.struct");
module.exports = class Command {
	constructor(name, description, permissions) {
		this.name = name;
		this.description = description;
		this.permissions = permissions;
		this.aliases = [];
		this.shortcuts = [];
	}
	setFunction(exec) {
		this.exec = exec;
		return this;
	}
	setAlias(...aliases) {
		this.aliases = aliases;
		return this;
	}
	setShortcut(...shortcuts) {
		this.shortcuts = shortcuts;
		return this;
	}
	exec(client = new Client(), message = new Discord.Message, args = []) {
		return message.channel.send("No function has been set for this command.");
	}
};
