const Command = require("../../structs/command.struct");


module.exports = new Command("restock", "Restock an ingredient!", "", 2)
	.setFunction(async(client, message, args, strings) => {
		const ingredients = client.getModel("stocks");
		const all = ingredients.findAll();
		const msg = await message.channel.send(`Loading ingredient matrix...`);
		const stocks = new client.classes.Matrix(6, 3, () => all.random());
		const display = client.classes.Matrix.from(stocks.map.map(y => y.map(x => x.emoji)));
		await msg.edit(display.toString());
	});
