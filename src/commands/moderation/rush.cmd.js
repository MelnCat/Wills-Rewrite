const Command = require("../../structs/command.struct");


module.exports = new Command("rush", "Finish cooking an order immediately.", "[order:str]", 3)
	.setFunction(async(client, message, args, strings) => {
		const order = await client.utils.getOrder(message, args, 0, { is: 2 }, false, "claim");
		if (!order) return;
		await order.update({ cookFinish: new Date(0) });
		return message.channel.send(`${order.id} has been rushed.`);
	});
