const owofy = require("owofy");

const Command = require("../../structs/command.struct");

module.exports = new Command("owo", "Turns a sentence owo!", "{text:str}", 0)
	.setFunction(async(client, message, args) => {
		if (!args.length) await message.argError();
		await message.channel.send(owofy(args.join(" ")));
	}
	)
	.setAlias("uwu");
