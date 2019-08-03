const Command = require("../../structs/command.struct");


module.exports = new Command("restock", "Restock an ingredient!", "", 2)
	.setFunction(async(client, message, args, strings) => {
		const ingredients = client.getModel("stocks");
		await message.channel.send(`welcome to the temp jason is the big boi SCRUMPTIOUS 
**Instructions**
React with a number to acquire the lowest ingredient of that column! Each ingredient will add 35 of its type.`);
		const msg = await message.channel.send(`Loading ingredient matrix...`);
		const all = await ingredients.findAll();
		const stocks = new client.classes.Matrix(6, 4, () => all.random());
		const display = client.classes.Matrix.from(stocks.map.map(y => y.map(x => x.emoji)));
		await msg.edit(display.toString());
		for (const emoji of ["one", "two", "three", "four"]) {
			await msg.react(client.mainEmojis[emoji]);
		}
		const reactCollector = msg.createReactionCollector((r, u) => u.id === message.author.id && r.emoji.guild && r.emoji.guild.id === client.staffGuild.id, { time: 90000 });
		reactCollector.on("collect", async reaction => {
			const column = ["ddone", "ddtwo", "ddthree", "ddfour"].indexOf(reaction.emoji.name);
			if (column < 0) return message.channel.send("[no] Invalid Reaction.");
			const ingr = stocks.column(column);
			if (!ingr.length) return;
			const lastingr = stocks.popColumn(column);
			await lastingr.update({ count: Math.min(lastingr.max, lastingr.count + 35) });
			await msg.edit(display.toString());
			console.log(lastingr.name);
		});
		reactCollector.on("end", async() => message.channel.send("Stopped restocking."));
		const cancelCollector = msg.channel.createMessageCollector(m => m.author.id === message.author.id && m.content.toLowerCase() === "stop", { max: 1 });
		cancelCollector.on("collect", async mess => {
			await reactCollector.stop();
			await cancelCollector.stop();
		});
	});
