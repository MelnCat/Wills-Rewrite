const Command = require("../../structs/command.struct");


module.exports = new Command("restock", "Restock an ingredient!", "{ingredientID:int}", 2)
	.setFunction(async(client, message, args, strings) => {
		const ingredients = client.getModel("stocks");
		if (isNaN(args[0]) || typeof args[0] === "undefined") await message.argError();
		args[0] = Number(args[0]);
		const ingr = await ingredients.findByPk(args[0]);
		if (!ingr) return message.channel.send("Please input a valid ingredient ID.");
		await ingr.update({ count: ingr.max });
		await message.channel.send(`🛒 **${ingr.name}** has been restocked!`);
	});
