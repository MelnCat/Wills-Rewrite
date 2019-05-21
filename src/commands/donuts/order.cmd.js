const Command = require("../../structs/command.struct");
module.exports = new Command("order", "Order a donut.", 0)
	.setFunction(async(client, message, args, now) => {
		if (message.channel.type === 'dm') return message.author.send(client.errors.orderdms);
		const orders = client.getModel("orders");
		const { Op } = client.getModule("sql");
		if (message.author.hasOrder) return message.channel.send(client.errors.ordered);
		let description = args.join(" ");
		if (!description) return message.channel.send(client.errors.arguments);
		description = description.includes("donut") ? description : `${description} donut`;
		description = description.replaceLast("donuts", "donut").valueOf();
		try {
			await message.author.send("Thank you for ordering!");
		} catch (err) {
			return message.channel.send(client.errors.dms);
		}
		let id;
		do {
			id = client.utils.random.string(7);
		} while (await orders.findByPk(id));
		await orders.create({ id, user: message.author.id, description, status: 0, channel: message.channel.id });
		await message.channel.send(`Ordered a ${description}. Your id is \`${id}\`.`);
	});
