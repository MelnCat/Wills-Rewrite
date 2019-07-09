const Command = require("../../structs/command.struct");
module.exports = new Command("cancel", "Cancel your own order.", "", 0)
	.setFunction(async(client, message, args, strings) => {
		if (!message.author.hasOrder) return message.channel.send(client.errors.nonexistent);
		await message.author.order.update({ status: 7 });
		await message.channel.send("Your order was successfully cancelled.");
	})
	.setAlias("delete");
