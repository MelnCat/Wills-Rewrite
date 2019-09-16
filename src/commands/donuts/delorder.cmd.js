const Command = require("../../structs/command.struct");
module.exports = new Command("delorder", "Deletes an order.", "[order:str]", 3)
    .setFunction(async(client, message, args) => {
        const order = await client.utils.getOrder(message, args, 0, { between: [0, 4] }, false, "delete");
        await order.update({ status: 5 })
        
    });
