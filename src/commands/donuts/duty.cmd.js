const Command = require("../../structs/command.struct");
module.exports = new Command("duty", "Go on or off duty.", 2);
    .setFunction(async( client, message ) => {

        let user = message.member;
        let r = client.roles.onduty

        user.roles.exists("id", r) ? user.roles.remove("id", r) : user.roles.add("id", r);

    });

    .setAlias({ "dudey", "doody", "dowdey", "dooooooty", "dooty", "dudy" });
