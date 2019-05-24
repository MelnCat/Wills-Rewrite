const owofy = require('owofy');

const Command = require("../../structs/command.struct");

module.exports = new Command("owo", "uwu owo >.<", 0)
	.setFunction(async(client, message, args) => message.channel.send(owofy(args.join(" "))));
