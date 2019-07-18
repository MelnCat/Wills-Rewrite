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
		const inspected = Object.entries(ingr).map(([i, c]) => [client.cached.stocks.find(x => x.id === +i), c]);
		const embed = new client.MessageEmbed()
			.setTitle("Ingredient Checklist")
			.setDescription("A checklist for the order's ingredients.")
			.setTimestamp();
		for (const [stock, count] of inspected) {
			const number = stock.count;
			embed.addField(`${number >= count ? client.mainEmojis.yes : client.mainEmojis.no} ${stock.emoji} ${count} ${stock.name}`, `${number}/${count} ${stock.name}`);
		}
		await message.channel.send(embed);
		if (inspected.find(([a, b]) => a.count < b)) return message.channel.send("Not enough ingredients.");
		await order.update({ prepared: true });
		for (const [stock, count] of inspected) {
			await stock.update({ count: stock.count - count });
		}
		return message.channel.send(`You have prepared \`${order.id}\`.`);
	});
