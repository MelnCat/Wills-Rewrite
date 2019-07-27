const Command = require("../../structs/command.struct");


module.exports = new Command("deletestock", "Delete an ingredient!", "{id:int}", 2)
	.setFunction(async(client, message, args, strings) => {
		const stocks = client.getModel("stocks");
		const count = await stocks.count();
		if (!args[0] || isNaN(args[0])) await message.argError();
		if (args[0] >= count || args[0] < 0) return message.channel.send(client.errors.stockNotFound);
		const ingredient = await stocks.findByPk(args[0]);
		await message.channel.send(`[yes] The ingredient ${ingredient.name} was successfully deleted. If any donut recipes required this ingredient, please modify their ingredients.`);
		await ingredient.destroy();
	})
	.setAlias("removestock", "removeingredient", "deleteingredient");
