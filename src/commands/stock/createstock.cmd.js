const Command = require("../../structs/command.struct");


module.exports = new Command("createstock", "Restock an ingredient!", "{name:str} {capacity:int} {symbol:str}", 2)
	.setFunction(async(client, message, args, strings) => {
		const stocks = client.getModel("stocks");
		if (!args[2] || isNaN(args[1])) await message.argError();
		const [name, , symbol] = args;
		const capacity = +args[1];
		const count = await stocks.count();
		await stocks.create({ id: count, max: capacity, count: capacity, emoji: symbol });
		await message.channel.send(`[yes] Successfully created stock. Details: ID: ${count}, Capacity: ${capacity}, Symbol: ${symbol}`);
	})
	.setAlias("makestock", "makeingredient", "createingredient");
