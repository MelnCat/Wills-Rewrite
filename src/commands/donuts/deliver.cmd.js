const Command = require("../../structs/command.struct");
module.exports = new Command("deliver", "Deliver a donut.", 2).setFunction(async (client, message, args, now) => {
	await message.channel.assert(client.mainChannels.delivery.id);
	const order = await client.utils.getOrder(message, args, 0, { is: 3 }, false, "deliver");
	if (!order) return;
	const invite = await client.channels
		.get(order.channel)
		.createInvite({ unique: true, maxUses: 1, reason: `Donut delivery for ${client.users.get(order.user)}` });
	await message.channel.send(`${client.emojis.yes} I have DMed you the information for the ticket!`);
	await message.author.send(invite.url, client.customTicket(order, `**Delivery URL**: ${order.url}`));
});
