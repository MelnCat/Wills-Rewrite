const Command = require("../../structs/command.struct");
module.exports = new Command("prepare", "Prepare a donut.", "[order:str]", 2)
	.setFunction(async(client, message, args, strings) => {
		await message.channel.assert(client.mainChannels.kitchen.id);
		const order = await client.utils.getOrder(message, args, 0, { is: 0 }, false, "prepare");
		const donutTypes = client.getModel("donutTypes");
		if (!order) return;
		const donutType = await donutTypes.findByPk(order.type);
		if (!donutType) {
			await order.update({ type: 0 });
		}
		const ingr = donutType.ingredients;
		const inspected = Object.entries(ingr).map(([i, c]) => [client.cached.stocks.find(x => x.id === i), c]);
		await order.update({ claimer: message.author.id, status: 1 });
		return message.channel.send(`You have claimed order \`${order.id}\`.`);
	});
