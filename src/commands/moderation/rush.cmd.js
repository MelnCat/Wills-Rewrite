const Command = require("../../structs/command.struct");


module.exports = new Command("rush", "Finish cooking an order immediately.", "[order:str]", 3)
	.setFunction(async(client, message, args) => {
		const order = await client.utils.getOrder(message, args, 0, { is: 2 }, false, "claim");
		if (!order) return;
		await order.update({ cookFinish: Date.now() });
		return message.channel.send(`${order.id} has been rushed.`);
	});