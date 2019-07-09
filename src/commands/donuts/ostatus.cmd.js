const Command = require("../../structs/command.struct");
module.exports = new Command("ostatus", "Check an order's status.", "[order:str]", 2)
	.setFunction(async(client, message, args, strings) => {
		const order = await client.utils.getOrder(message, args, 0, { between: [0, 4] }, true, "check");
		if (!order) return;
		return message.channel.send(client.customTicket(order, "The fetched order's status."));
	})
	.setAlias()
	.setShortcuts("os");
