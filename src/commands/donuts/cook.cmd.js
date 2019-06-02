const Command = require("../../structs/command.struct");
module.exports = new Command("cook", "Cook a donut.", "[order:str]", 2)
	.setFunction(async(client, message, args, now) => {
		const URLREGEX = /https?:\/\/.+?\.\w+/;
		await message.channel.assert(client.mainChannels.kitchen.id);
		const order = await client.utils.getOrder(message, args, 0, { is: 1 }, false, "cook");
		if (!order) return;
		await message.channel.send(`You are cooking order \`${order.id}\``);
		let url;
		if (args[1]) {
			url = args[1];
		}
		if (!url) {
			url = await client.utils.getText(message, "The next message you send will be set as the order's image.");
			if (!url) return;
		}
		if (!URLREGEX.exec(url)) return message.channel.send(client.errors.url);
		const time = +((Math.random() * 3) + 1).toFixed(2);
		await order.update({ url, status: 2, cookFinish: Date.now() + (60000 * time) });
		return message.channel.send(`You have put \`${order.id}\` in the oven. It will take \`${time}\` minutes to finish cooking.`);
	});
