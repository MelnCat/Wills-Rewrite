const Command = require("../../structs/command.struct");


module.exports = new Command("blacklist", "Blacklist a user.", 4)
    .setFunction(async(client, message, args) => {
        const blacklist = getModel("blacklists")
        const { Op } = getModule("sql")


            let id = args[0];
            //if(isNaN(id)) return; //message todo
            if(!id) return; //message todo

            let b;
            try{
                b = await blacklist.findByPk(id)
            }catch(err) {
                //do nothing, this is just to see if the user is already blacklisted
            }
            if(b !== undefined) return; //message todo

            blacklist.create({ id })
            //success: todo
    })
    
    .setAlias("bl");
