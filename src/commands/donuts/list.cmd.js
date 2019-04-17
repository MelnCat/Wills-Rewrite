const Command = require("../../structs/command.struct");
module.exports = new Command("list", "List all donuts.", 2)
	.setFunction(async(client, message, args, now) => {
		const orders = client.getModel("orders");
		const { Op } = client.getModule("sql");
		const list = await orders.findAll({ where: { status: { [Op.lt]: 4 } } });
		const embed = client.embed("Order List", "A list of all non-delivered orders.");
		for (const order of list) {
			embed.addField(order.id, `**Status**: ${client.statusOf(order)}
**Details**: ${order.description}`);
		}
		await message.channel.send(embed);
	});
