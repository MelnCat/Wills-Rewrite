const Command = require("../../structs/command.struct");
module.exports = new Command("status", "Check your order status.", 0)
	.setFunction(async(client, message, args, now) => {
		if (!message.author.hasOrder) return message.channel.send(client.errors.nonexistent);
		return message.channel.send(client.customTicket(message.author.order, "Your order's status."));
	})
	.setAlias("myorder", "myticket");
