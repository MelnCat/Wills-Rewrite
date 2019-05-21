const Command = require("../../structs/command.struct");

module.exports = new Command("replydm", "Message a user via DMs.", 2)
	.setFunction(async(client, message, args) => {
        const c = client.user.channels.find(ch => ch.id === client.channels.mailbox);
        if (!args[0]) return message.channel.send("Please provide an ID.");
        try {
            client.users.find("id", args[0]).send(args.join(" "));
        }catch(error) {
            return c.send("I was unable to send that message to the user.");
        }
        let u = client.users.find("id", args[0]);
        const e = new MessageEmbed()
            .setAuthor(client.user.tag, "https://cdn.discordapp.com/avatars/335637950044045314/2c61ed3955e97084b863a03999b0d241.webp")
            .setTitle(`${message.author.tag} has told me to send ${u.tag} this:`)
            .addField(args.join(" "))
        c.send(e);
        
    })

    .setShortcuts("rdm");
