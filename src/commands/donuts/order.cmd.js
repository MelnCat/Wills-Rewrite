const Command = require("../../structs/command.struct");

module.exports = new Command("order", "Order a donut.", "{orderinfo:str}", 0)
	.setFunction(async(client, message, args, strings) => {
		const orders = client.getModel("orders");
		const { Op } = client.getModule("sql");
		if (message.author.hasOrder) return message.channel.send(client.errors.ordered);
		const embed = new client.MessageEmbed()
			.setTitle("Donut Menu")
			.setDescription("Please respond with the ID (number) of the donut you want to order.");
		for (const type of client.cached.donutTypes) {
			embed.addField(`[${type.id} ${type.name}]`, `${client.cached.orders.filter(x => x.type === +type.id).length} orders`);
		}
		const tId = await client.utils.getText(message, embed, 40000, m => m.content >= 0 && m.content < client.cached.donutTypes.length);
		const typeId = String(tId);
		if (typeId === undefined) return;
		const donutType = client.cached.donutTypes.find(x => x.id === typeId);
		let description = donutType.name;
		if (+typeId === 1) {
			await message.channel.send("Custom donut chosen.");
			description = await client.utils.getText(message, "Custom: What kind of donut do you want to order?");
			if (!description) return;
			description = description.toLowerCase().includes("donut") ? description : `${description} Donut`;
			description = description.replaceLast("donuts", "donut").valueOf();
		}
		try {
			await message.author.send("Thank you for ordering a donut! Your donut will be claimed and cooked shortly.");
		} catch (err) {
			return message.channel.send(client.errors.dms);
		}
		let id;
		do {
			id = client.utils.random.string(7);
		} while (await orders.findByPk(id));
		await orders.create({ id, user: message.author.id, description, status: 0, channel: message.channel.id, type: typeId });
		await message.channel.send(`Ordered a ${description}. Your id is \`${id}\`.`);
	});
