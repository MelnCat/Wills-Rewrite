const Command = require("../../structs/command.struct");


module.exports = new Command("blacklist", "Blacklist commands.", 3)
    .setFunction(async(client, message, args) => {
        const blacklists = client.getModel("blacklists")
        const { Op } = client.getModule("sql")
            if(!args[0] || isNaN(args[0])) return message.channel.send(client.strings.invalidID);
            if(await blacklists.findByPk(args[0])) return message.channel.send(`${client.mainEmojis.no} That ID is already blacklisted!`)
            await blacklists.create({ id: args[0] })
               await message.channel.send(`${client.mainEmojis.yes} The ID was successfully blacklisted!`)
            
    })
    .setShortcuts("bl");
