const Command = require("../../structs/command.struct");
module.exports = new Command("claim", "Claim a donut.", "[order:str]", 2)
	.setFunction(async(client, message, args, now) => {
		await message.channel.assert(client.mainChannels.kitchen.id);
		const order = await client.utils.getOrder(message, args, 0, { is: 0 }, false, "claim");
		if (!order) return;
		await order.update({ claimer: message.author.id, status: 1 });
		return message.channel.send(`You have claimed order \`${order.id}\`.`);
	});
