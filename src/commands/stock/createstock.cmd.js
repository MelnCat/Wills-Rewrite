const Command = require("../../structs/command.struct");


module.exports = new Command("createstock", "Restock an ingredient!", "{ingredientID:int}", 2)
	.setFunction(async(client, message, args, strings) => {
		if (!args[2]) await message.argError(); //createstock emoji count name
	})
	.setAlias("makestock", "makeingredient", "createingredient");
