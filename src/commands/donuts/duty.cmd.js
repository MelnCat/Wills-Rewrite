const Command = require("../../structs/command.struct");
module.exports = new Command("duty", "Go on or off duty.", 2);
    .setFunction(async( client, message ) => {

        let user = message.member;
        let r = client.roles.onduty

        user.roles.exists("id", r) ? user.roles.remove("id", r) : user.roles.add("id", r);
        
        if(message.content.includes("d!duty")){
            message.reply("You're now on duty!")
        }
        if(message.content.includes("d!dudey")){
            message.reply("You're now on dudey!")
        }
        if(message.content.includes("d!doody")){
            message.reply("You're now on doody!")
        }
        if(message.content.includes("d!dowdey")){
            message.reply("You're now on dowdey!")
        }
        if(message.content.includes("d!dooooooty")){
            message.reply("You're now on dooooooty!")
        }
        if(message.content.includes("d!dooty")){
            message.reply("You're now on dooty!")
        }
        if(message.content.includes("d!dudy")){
            message.reply("You're now on dudy!")
        }

    });

    .setAlias({ "dudey", "doody", "dowdey", "dooooooty", "dooty", "dudy" });
